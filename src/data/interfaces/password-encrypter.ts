export interface PasswordEncrypter {
  encryptPassword: (password: string) => Promise<string>
}
