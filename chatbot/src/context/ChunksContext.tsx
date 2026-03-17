import { createContext, useContext } from 'react'
import type { Chunk } from '../types'

export interface ChunksContextValue {
  chunks: Chunk[]
  ready: boolean
}

export const ChunksContext = createContext<ChunksContextValue>({ chunks: [], ready: false })
export const useChunks = () => useContext(ChunksContext)
