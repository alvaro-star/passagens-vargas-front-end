

import { FaArrowRightLong } from "react-icons/fa6";
import IVIajeResponse from "../Types/IViajeResponse"
import { MdTimer } from "react-icons/md";
interface Props {
    viaje: IVIajeResponse
    indexViaje?: number
    escojerViaje?: (indexViaje: number | undefined, idViaje: string, idPrecio: string) => void
    className?: string
}

const CardViaje = ({ viaje, indexViaje, escojerViaje, className = '' }: Props) => {
    const getDataHora = (dataHora: string) => {
        let hora = dataHora.split('T')[1];
        let partes = hora.split(':')
        return `${partes[0]}:${partes[1]}`
    }

    return (
        <div className={`p-5 bg-gray-300 rounded flex ${className}`}>
            <section className="flex flex-col justify-between">
                <div className="flex space-x-3">
                    <div className="mr-3 h-32 w-64 rounded-lg bg-white grid place-content-center">
                        <img src={viaje.logo} className="h-32 rounded-lg" />
                    </div>
                    <section className="text-lg w-80">
                        <p className="font-bold text-2xl">
                            Destino {viaje.destino.ciudad}
                        </p>
                        <p>{viaje.destino.lugar}</p>
                        <p>Departamento {viaje.destino.departamento}</p>
                    </section>
                </div>
                <div className="text-xl flex items-center">
                    <MdTimer className="my-3 mr-3 text-3xl" />
                    <p className="font-semibold">Salida  </p> {getDataHora(viaje.salida.dataHora)}
                    <FaArrowRightLong className="mx-3 text-3xl" />
                    <p className="font-semibold">Destino  </p> {getDataHora(viaje.destino.dataHora)}
                </div>
            </section>
            <section className="w-full flex flex-col justify-between">
                <div className="text-lg w-80">
                    <p className="font-semibold text-2xl">
                        Salida {viaje.salida.ciudad}
                    </p>
                    <p>{viaje.salida.lugar}</p>
                    <p>Departamento {viaje.salida.departamento}</p>
                </div>
                {(viaje.precios?.length != 0 && escojerViaje) &&
                    <section className="flex flex-col items-end w-full">
                        {viaje.precios?.map(
                            precio => !precio.lleno &&
                                <div className="p-1 flex items-center space-x-3" key={precio.id}>
                                    <p>
                                        <b className="font-semibold">Piso</b>: {precio.nPiso}
                                    </p>
                                    <p className="font-semibold">
                                        Bs. {precio.precio}
                                    </p>
                                    <button className="py-1.5 px-2 bg-blue-500 rounded text-white" onClick={() => escojerViaje(indexViaje, viaje.id, precio.id)}>COMPRAR</button>
                                </div>
                        )}
                    </section>
                }
            </section>
        </div>
    )
}

export default CardViaje;