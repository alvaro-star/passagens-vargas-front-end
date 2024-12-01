
class CookieManager<T> {
    cookieName: string
    constructor(cookieName: string) {
        this.cookieName = cookieName
    }
    public get() {
        let value = sessionStorage.getItem(this.cookieName)
        return value ? JSON.parse(value) : undefined
    }
    public set(value: T) {
        sessionStorage.setItem(this.cookieName, JSON.stringify(value))
    }
    public remove() {
        sessionStorage.removeItem(this.cookieName)
    }
}
export default CookieManager