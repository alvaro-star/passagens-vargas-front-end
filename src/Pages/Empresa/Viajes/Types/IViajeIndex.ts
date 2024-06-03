import IPrecio2 from "@/Types/IViaje/IPrecio2"
import IParadaComplete from "./IParadaViajesIndex"

export default interface IViaje {
    id: string
    isCobrado: boolean
    salida: IParadaComplete
    destino: IParadaComplete
    valorArrecadadoEfectivo: number
    valorArrecadadoWeb: number
    precios: IPrecio2[]
}