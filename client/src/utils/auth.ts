export function parseJwtPayload(token: string) {
  try {
    const parts = token.split('.')
    if (parts.length < 2) return null
    const payload = parts[1]
    // base64url -> base64
    const b64 = payload.replace(/-/g, '+').replace(/_/g, '/')
    const padded = b64 + '='.repeat((4 - (b64.length % 4)) % 4)
    // atob works in browser to decode base64 to binary string
    const binary = typeof atob === 'function' ? atob(padded) : Buffer.from(padded, 'base64').toString('binary')
    // decode utf-8
    const json = decodeURIComponent(binary.split('').map(c => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2)).join(''))
    return JSON.parse(json)
  } catch {
    return null
  }
}

export function getRolesFromToken(token: string) {
  const payload = parseJwtPayload(token)
  if (!payload) return []

  // Common claim keys: 'role', 'roles', or the ClaimTypes.Role URI
  const roleKeys = ['role', 'roles', 'http://schemas.microsoft.com/ws/2008/06/identity/claims/role']
  for (const k of roleKeys) {
    const v = payload[k]
    if (!v) continue
    if (Array.isArray(v)) return v
    // single value might be string or comma-separated
    if (typeof v === 'string') return v.includes(',') ? v.split(',').map(s => s.trim()) : [v]
  }

  // fallback: scan all payload values for roles
  const roles: string[] = []
  for (const key of Object.keys(payload)) {
    const val = payload[key]
    if (typeof val === 'string' && val.toLowerCase() === 'admin') roles.push('Admin')
    if (Array.isArray(val) && val.includes('Admin')) return ['Admin']
  }

  return roles
}
