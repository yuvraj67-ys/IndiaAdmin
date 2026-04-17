export function createSessionCookie() {
  return `admin_session=authenticated; Path=/; HttpOnly; SameSite=Strict; Max-Age=86400`;
}
export function clearSessionCookie() {
  return `admin_session=; Path=/; HttpOnly; Max-Age=0`;
}
