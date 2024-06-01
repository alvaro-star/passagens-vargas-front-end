import IPrecio2 from "@/Types/IViaje/IPrecio2"
import IParadaComplete from "./IParadaViajesIndex"

export default interface IViaje {
    destino: IParadaComplete
    id: string
    isCobrado: boolean
    salida: IParadaComplete
    valorArrecadadoEfectivo: number
    valorArrecadadoWeb: number
    precios: IPrecio2[]
}