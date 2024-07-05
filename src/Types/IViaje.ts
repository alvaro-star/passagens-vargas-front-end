import IPiso from "./IPiso"

export default interface IVIaje {
    codigo: string
    id: string
    idAutobus: number
    valorArrecadadoEfectivo: number
    valorArrecadadoWeb: number
    isCobrado:boolean
    precios: IPiso[]
}