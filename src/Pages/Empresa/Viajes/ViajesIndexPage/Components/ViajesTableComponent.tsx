import PrimaryButton from "@/Components/PrimaryButton"
import DataHora from "@/Classes/DataHora"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import IViajeEmpresa from "@/Pages/Empresa/Types/IViajeEmpresa"
import { useNavigate } from "react-router-dom"
interface Props {
    viajes: IViajeEmpresa[]
}

const ViajesTableComponent = ({ viajes }: Props) => {
    const navigate = useNavigate()
    const showViaje = (codigo: string) => navigate('/empresa/viajes/' + codigo)
    return <div className="bg-slate-300 p-5">
        <table className="w-full">
            <thead>
                <tr>
                    <th className="text-start">Salida</th>
                    <th>Destino</th>
                    <th>Saldo en Efectivo</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {viajes.map(viaje =>
                    <tr key={viaje.id} className="">
                        <td className="py-2">{capitalizeFirstLetter(viaje.salida.ciudad) + ", " + viaje.salida.abreviacion} - {new DataHora(viaje.salida.dataHora).imprimir()}</td>
                        <td className="py-2 text-start">{capitalizeFirstLetter(viaje.destino.ciudad) + ", " + viaje.destino.abreviacion} - {new DataHora(viaje.destino.dataHora).imprimir()}</td>
                        <td className="text-center">Bs {viaje.valorArrecadadoEfectivo}</td>
                        <td className="text-center">
                            <PrimaryButton className="rounded-none" onClick={() => showViaje(viaje.id)}>ver mais</PrimaryButton>
                        </td>
                    </tr>
                )}
                {viajes.length == 0 &&
                    <tr>
                        <td colSpan={5} className="py-2 text-center font-semibold">
                            No hay Viajes Registrados
                        </td>
                    </tr>
                }
            </tbody>
        </table>
    </div>
}

export default ViajesTableComponent