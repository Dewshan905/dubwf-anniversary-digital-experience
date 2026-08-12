import crypto from 'node:crypto'

export function generatePassToken() {
  return crypto.randomBytes(24).toString('hex')
}
