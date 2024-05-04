

import { FaArrowRightLong } from "react-icons/fa6";
import IVIajeResponse from "../Types/IViajeResponse"
import { MdTimer } from "react-icons/md";
interface Props {
    viaje: IVIajeResponse
    index?: number
    escojerViaje?: (indexViaje: number | undefined, idViaje: string, idPrecio: string) => void
    className?: string
}

const CardViaje = ({ viaje, escojerViaje, className = '' }: Props) => {
    const getDataHora = (dataHora: string) => {
        let hora = dataHora.split('T')[1];
        let partes = hora.split(':')
        return `${partes[0]}:${partes[1]}`
    }

    return (
        <div className={`p-5 bg-gray-300 rounded ${className}`}>
            <section className="flex items-center">
                <img src={viaje.logo} className="mr-3 w-20  rounded-lg" />
                <section className="text-lg flex justify-between w-full items-center">
                    <div>
                        <p>{viaje.salida.lugar + ', ' + viaje.salida.ciudad} </p>
                        <p className="mt-1">{viaje.destino.lugar + ', ' + viaje.destino.ciudad} </p>
                    </div>
                </section>
            </section>
            <div className="text-xl flex items-center">
                <MdTimer className="my-3 mr-3 text-3xl" />
                <p className="font-semibold">Salida</p> {getDataHora(viaje.salida.dataHora)}
                <FaArrowRightLong className="mx-3 text-3xl" />
                <p className="font-semibold">Destino</p> {getDataHora(viaje.destino.dataHora)}

            </div>
            {(viaje.precios?.length != 0 && escojerViaje) && <section className="flex flex-col border-t border-black pt-2">
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