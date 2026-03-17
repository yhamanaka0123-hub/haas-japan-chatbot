import type { Chunk, SearchResult } from '../types'

/** Tokenize text into lowercase ASCII words + CJK character bigrams */
function tokenize(text: string): string[] {
  const tokens: string[] = []

  // ASCII words (English, numbers)
  const words = text.match(/[a-zA-Z0-9]+/g) ?? []
  for (const w of words) tokens.push(w.toLowerCase())

  // CJK bigrams: collect non-ASCII chars then slide a window of 2
  const cjkChars: string[] = []
  for (const ch of text) {
    if ((ch.codePointAt(0) ?? 0) > 127) cjkChars.push(ch)
  }
  for (let i = 0; i < cjkChars.length - 1; i++) {
    tokens.push(cjkChars[i] + cjkChars[i + 1])
  }

  return tokens
}

export class SearchIndex {
  private idf = new Map<string, number>()
  // chunk index → (token → normalized TF)
  private chunkTF = new Map<number, Map<string, number>>()

  constructor(private readonly chunks: Chunk[]) {
    this.build()
  }

  private build() {
    const df = new Map<string, number>() // document frequency
    const N = this.chunks.length

    for (let i = 0; i < this.chunks.length; i++) {
      const text = this.chunks[i].title + ' ' + this.chunks[i].content
      const raw = tokenize(text)

      // Raw term counts
      const counts = new Map<string, number>()
      for (const t of raw) counts.set(t, (counts.get(t) ?? 0) + 1)

      // Sublinear TF normalized by √(total tokens)
      const tf = new Map<string, number>()
      const total = raw.length || 1
      for (const [t, cnt] of counts) {
        tf.set(t, (1 + Math.log(cnt)) / Math.sqrt(total))
      }
      this.chunkTF.set(i, tf)

      // Accumulate DF
      for (const t of tf.keys()) df.set(t, (df.get(t) ?? 0) + 1)
    }

    // IDF = log((N+1) / (df+1))  — smoothed
    for (const [token, docFreq] of df) {
      this.idf.set(token, Math.log((N + 1) / (docFreq + 1)))
    }
  }

  search(query: string, topK = 5, categoryFilter?: string): SearchResult[] {
    const qTokens = tokenize(query)
    const scores = new Map<number, number>()

    for (const qt of qTokens) {
      const idf = this.idf.get(qt) ?? 0
      if (idf <= 0) continue

      for (const [i, tf] of this.chunkTF) {
        const t = tf.get(qt) ?? 0
        if (t > 0) scores.set(i, (scores.get(i) ?? 0) + t * idf)
      }
    }

    let ranked = Array.from(scores.entries()).sort(([, a], [, b]) => b - a)

    if (categoryFilter) {
      ranked = ranked.filter(([i]) => this.chunks[i].category === categoryFilter)
    }

    return ranked
      .slice(0, topK)
      .map(([i, score]) => ({ chunk: this.chunks[i], score }))
  }
}
