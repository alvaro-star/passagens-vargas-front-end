import CookieManager from "./CookieManager";
const COOKIE_ID_EMPRESA = "idEmpresa"
const CookieEmpresaId = new CookieManager<string>(COOKIE_ID_EMPRESA)
export default CookieEmpresaId