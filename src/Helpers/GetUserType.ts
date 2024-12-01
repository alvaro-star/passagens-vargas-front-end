import { CookieRole } from "./CookieGenerate/CookiesAuth";

export default function GetUserType() {
    return CookieRole.get()
}