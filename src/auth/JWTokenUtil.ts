import jwt from 'jsonwebtoken'
import { type Option } from '../utils/Option'
import { type TokenPayload, type TokenUtil } from './TokenUtil'

export class JWTokenUtil implements TokenUtil {
  constructor(private readonly secret: string) {}

  async generate(contents: TokenPayload): Promise<string> {
    return jwt.sign(contents, this.secret)
  }

  async verify(token: string): Promise<Option<TokenPayload>> {
    try {
      return jwt.verify(token, this.secret) as TokenPayload
    } catch {
      return undefined
    }
  }
}
