import { type Option } from '../utils/Option'

export interface TokenPayload {
  userId: string
}

export interface TokenUtil {
  generate: (contents: TokenPayload) => Promise<string>
  verify: (token: string) => Promise<Option<TokenPayload>>
}
