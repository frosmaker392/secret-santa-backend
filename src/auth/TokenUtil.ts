import { type Option } from '../utils/Option'

export interface TokenContents {
  userId: string
}

export interface TokenUtil {
  generate: (contents: TokenContents) => Promise<string>
  verify: (token: string) => Promise<Option<TokenContents>>
}
