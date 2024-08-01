

import IVIajeResponse from "../../Types/IViajeResponse"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter";
import IPrecio2 from "@/Types/IViaje/IPrecio2";
import HoraComponent from "./HoraComponent";
interface Props {
    viaje: IVIajeResponse
    precio: IPrecio2
    escojerViaje?: (viaje: IVIajeResponse, idPrecio: string) => void
    className?: string
}


const CardViaje = ({ viaje, escojerViaje, precio, className = '' }: Props) => {
    return (
        <div className={`px-5 pt-5 bg-gray-300 rounded ${className}`}>
            <section className="flex">
                <div className="mr-3 h-40 w-64 rounded-lg bg-white grid place-content-center">
                    <img src={viaje.logo} className="h-40 rounded-lg" />
                </div>
                <div className="text-lg w-80">
                    <p className="font-bold text-2xl">
                        Destino {capitalizeFirstLetter(viaje.destino.ciudad)}
                    </p>
                    <p>{capitalizeFirstLetter(viaje.destino.lugar)}</p>
                    <p>Departamento {capitalizeFirstLetter(viaje.destino.departamento)}</p>
                </div>
                <div className="text-lg w-80">
                    <p className="font-semibold text-2xl">
                        Salida {capitalizeFirstLetter(viaje.salida.ciudad)}
                    </p>
                    <p>{capitalizeFirstLetter(viaje.salida.lugar)}</p>
                    <p>Departamento {capitalizeFirstLetter(viaje.salida.departamento)}</p>
                </div>
            </section>
            <section className="py-1 flex items-center justify-between">
                <HoraComponent horaSalida={viaje.salida.dataHora} horaDestino={viaje.destino.dataHora} />
                <div>
                    {escojerViaje &&
                        <section className="w-full">
                            <div className="flex items-center space-x-3" key={precio.id}>
                                <p>
                                    <b className="font-semibold">Piso</b>: {precio.nPiso}
                                </p>
                                <p className="font-semibold">
                                    Bs. {precio.precio}
                                </p>
                                <button className="py-1.5 px-2 bg-blue-500 rounded text-white" onClick={() => escojerViaje(viaje, precio.id)}>COMPRAR</button>
                            </div>
                        </section>
                    }
                </div>
            </section>
        </div>
    )
}

export default CardViaje;