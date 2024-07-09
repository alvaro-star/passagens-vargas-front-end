import IPiso from "@/Types/IPiso"

export default interface IPrecio {
    id: string,
    precio: number,
    nPiso: number,
    lleno: boolean,
    nSillasDisponibles: number,
    piso: IPiso
    sillasOcupadas: number[],
    idViaje: number
}