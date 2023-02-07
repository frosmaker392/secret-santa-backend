import { type Optional } from '../types'

export interface TokenContents {
  userId: string
}

export interface TokenUtil {
  generate: (contents: TokenContents) => Promise<string>
  verify: (token: string) => Promise<Optional<TokenContents>>
}