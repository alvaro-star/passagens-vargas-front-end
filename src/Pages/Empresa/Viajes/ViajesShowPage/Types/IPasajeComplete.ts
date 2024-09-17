import IParada2 from "@/Types/IViaje/IParada2"

export default interface IPasajeComplete {
    id: string,
    carnet: string,
    nombre: string,
    nascimento: string,
    rembolsado: boolean
    pagado: boolean
    nSilla: 0,
    salida: IParada2
    destino: IParada2
}