import IPasajeComplete from "./IPasajeComplete"

export default interface ISillaType{
    numero: number
    ocupado: boolean
    posicion: number
    pasajero: IPasajeComplete | null
}