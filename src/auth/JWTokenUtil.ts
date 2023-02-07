import jwt from 'jsonwebtoken'
import { type Optional } from '../types'
import { type TokenContents, type TokenUtil } from './TokenUtil'

export class JWTokenUtil implements TokenUtil {
  constructor(private readonly secret: string) {}

  async generate(contents: TokenContents): Promise<string> {
    return jwt.sign(contents, this.secret)
  }

  async verify(token: string): Promise<Optional<TokenContents>> {
    try {
      return jwt.verify(token, this.secret) as TokenContents
    } catch {
      return undefined
    }
  }
}
