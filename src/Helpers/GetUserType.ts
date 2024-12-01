import CookieEmpresaId from "./CookieGenerate/CookieEmpresaId";

export default function GetUserType() {
    return CookieEmpresaId.get()
}