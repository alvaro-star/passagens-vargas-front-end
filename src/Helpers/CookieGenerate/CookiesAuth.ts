import CookieManager from "./CookieManager"

const COOKIE_ROLE = "role"
const COOKIE_TOKEN = "token"
const COOKIE_REFRESH_TOKEN = "refreshToken"
const CookieRole = new CookieManager<string>(COOKIE_ROLE)
const CookieToken = new CookieManager<string>(COOKIE_TOKEN)
const CookieRefreshToken = new CookieManager<string>(COOKIE_REFRESH_TOKEN)

export { CookieRole, CookieToken, CookieRefreshToken }