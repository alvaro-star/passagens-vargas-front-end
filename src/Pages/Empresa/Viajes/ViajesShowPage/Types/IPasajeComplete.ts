import IParada2 from "@/Types/IViaje/IParada2"

export default interface IPasajeComplete{
    id: string,
    carnet: string,
    nombre: string,
    nascimento: string,
    nSilla: 0,
    salida: IParada2
    destino: IParada2
}