import IParada2 from "@/Types/IViaje/IParada2"
import IPrecio2 from "@/Types/IViaje/IPrecio2"

export default interface IVIajeResponse {
    id: string,
    logo: string,
    salida: IParada2,
    destino: IParada2
    precios: IPrecio2[]
}