import IParada2 from "./IParada2"
import IPrecio2 from "./IPrecio2"

export default interface IViaje {
    id: number
    logo: string
    salida: IParada2
    destino: IParada2
    precios: IPrecio2[]
}