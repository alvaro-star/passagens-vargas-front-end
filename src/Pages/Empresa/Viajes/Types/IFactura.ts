interface PasajeFactura {
    nSilla: number
    precio: number
}
interface IFactura {
    pasajes: PasajeFactura[]
    tasaServicio: number
    total: number
}

export default IFactura