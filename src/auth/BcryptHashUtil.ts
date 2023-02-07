import bcrypt from 'bcrypt'
import { type PasswordHashUtil } from './PasswordHashUtil'

export class BcryptHashUtil implements PasswordHashUtil {
  private readonly saltRounds = 10

  async generate(password: string): Promise<string> {
    return await bcrypt.hash(password, this.saltRounds)
  }

  async compare(password: string, passwordHash: string): Promise<boolean> {
    return await bcrypt.compare(password, passwordHash)
  }
}
