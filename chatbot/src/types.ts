export interface Chunk {
  id: number
  url: string
  title: string
  content: string
  category: '授業' | 'クラブ' | 'キャリア' | 'その他'
}

export interface SearchResult {
  chunk: Chunk
  score: number
}

export interface Source {
  url: string
  title: string
}

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  sources?: Source[]
  noInfo?: boolean
  streaming?: boolean
}
