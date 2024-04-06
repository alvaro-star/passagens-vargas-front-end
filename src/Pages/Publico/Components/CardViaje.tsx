import IViaje from "../../../Types/IViaje";
interface Props {
    viaje: IViaje
    index?: number
    escojerViaje?: (indexViaje: number|undefined, idViaje: number, idPrecio: string) => void
    className?: string
}

const CardViaje = ({ viaje, escojerViaje, className = '' }: Props) => {
    const getDataHora = (dataHora: string) => {
        let hora = dataHora.split('T')[1];
        let partes = hora.split(':')
        return `${partes[0]}:${partes[1]}`
    }

    return (
        <div className={` p-5 bg-slate-100 rounded ${className}`}>
            <section className="flex items-center">
                <img src={viaje.logo} className="mr-3 w-14  rounded-full" />
                <section className="text-lg flex justify-between w-full items-center">
                    <div>
                        <p>{viaje.salida.lugar + ', ' + viaje.salida.ciudad} </p>
                        <p className="mt-1">{viaje.destino.lugar + ', ' + viaje.destino.ciudad} </p>
                    </div>
                    <div className="text-xl">
                        {getDataHora(viaje.salida.dataHora)} - {getDataHora(viaje.destino.dataHora)}
                    </div>
                </section>
            </section>
            {(viaje.precios?.length != 0 && escojerViaje) && <section className="flex flex-col border-t mt-2 pt-2">
                {viaje.precios?.map(
                    (precio, index) => !precio.lleno &&
                        <div className="w-full p-1 flex items-center justify-between" key={index}>
                            <p>
                                <b className="font-semibold">Piso</b>: {precio.nPiso}
                            </p>
                            <p className="font-semibold">
                                Precio: Bs. {precio.precio}
                            </p>
                            <button className="py-1 px-2 bg-blue-500 rounded text-white" onClick={() => escojerViaje(index, viaje.id, precio.id)}>ESCOJER</button>
                        </div>
                )}
            </section>
            }
        </div>
    )
}

export default CardViaje;