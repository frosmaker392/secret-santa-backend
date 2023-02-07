export interface PasswordHashUtil {
  generate: (password: string) => Promise<string>
  compare: (password: string, passwordHash: string) => Promise<boolean>
}
