const SYSTEM_PROMPT = `あなたはUC Berkeley Haas MBAの日本人コミュニティサイト（haasjapan.wordpress.com）のアシスタントです。

以下のルールを必ず守ってください：
1. 【重要】以下の「参考情報」のみを使って回答してください。Haasや経営学に関する一般知識・トレーニングデータは使用しないでください。
2. 参考情報に質問に関連する内容がない場合は「申し訳ありませんが、この質問に関する情報はサイトで見つかりませんでした。」とのみ答えてください。
3. 回答は日本語でお願いします。
4. 簡潔に要点を絞って回答してください（400字以内が目安）。
5. 箇条書きを活用して読みやすくしてください。`

export async function streamAnswer(
  question: string,
  context: string,
  apiKey: string,
  onChunk: (text: string) => void,
  onDone: () => void,
  onError: (err: string) => void
): Promise<void> {
  let response: Response

  const url = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:streamGenerateContent?alt=sse&key=${apiKey}`

  try {
    response = await fetch(url, {
      method: 'POST',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({
        system_instruction: {
          parts: [{ text: SYSTEM_PROMPT }],
        },
        contents: [
          {
            role: 'user',
            parts: [{ text: `参考情報：\n\n${context}\n\n---\n\n質問：${question}` }],
          },
        ],
        generationConfig: {
          maxOutputTokens: 600,
        },
      }),
    })
  } catch (e) {
    onError(`ネットワークエラー: ${String(e)}`)
    return
  }

  if (!response.ok) {
    const body = await response.text()
    onError(`API エラー ${response.status}: ${body}`)
    return
  }

  const reader = response.body!.getReader()
  const decoder = new TextDecoder()
  let buffer = ''

  try {
    while (true) {
      const { done, value } = await reader.read()
      if (done) {
        onDone()
        break
      }

      buffer += decoder.decode(value, { stream: true })
      const lines = buffer.split('\n')
      buffer = lines.pop() ?? ''

      for (const line of lines) {
        if (!line.startsWith('data: ')) continue
        const payload = line.slice(6).trim()
        if (payload === '[DONE]') {
          onDone()
          return
        }
        try {
          const event = JSON.parse(payload) as {
            candidates?: Array<{
              content?: { parts?: Array<{ text?: string }> }
            }>
          }
          const text = event.candidates?.[0]?.content?.parts?.[0]?.text
          if (text) {
            onChunk(text)
          }
        } catch {
          // Ignore malformed SSE lines
        }
      }
    }
  } catch (e) {
    onError(String(e))
  }
}
