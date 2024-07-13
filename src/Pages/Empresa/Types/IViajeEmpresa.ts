import IPiso from "@/Types/IPiso"
import IParada2 from "@/Types/IViaje/IParada2"


export default interface IViajeEmpresa {
    codigo: string
    id: string
    idAutobus: number
    valorArrecadadoEfectivo: number
    valorArrecadadoNoWeb: number
    valorArrecadadoWeb: number
    isCobrado:boolean
    precios: IPiso[]
    salida: IParada2
    destino: IParada2
}