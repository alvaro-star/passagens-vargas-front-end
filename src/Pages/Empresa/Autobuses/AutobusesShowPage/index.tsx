import PrimaryButton from "@/Components/PrimaryButton"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import IAutobusExtends from "./Types/IAutobusExtends"
import IViajeEmpresa from "../../Types/IViajeEmpresa"
import InputRelatorioComponent from "./Components/InputRelatorioComponent"
import DataHora from "@/Classes/DataHora"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"

const AutobusesShowPage = () => {
    const path = '/empresa'

    const { id } = useParams()
    const navigate = useNavigate()

    const [autobus, setAutobus] = useState<IAutobusExtends | null>(null)
    const [viajes, setViajes] = useState<IViajeEmpresa[]>([])

    const showViaje = (id: string) => navigate(path + '/viajes/' + id)

    return (
        <div className="mx-auto max-w-7xl py-10">
            {autobus && <>
                <div className="w-full px-5 py-3 bg-slate-700 text-white font-semibold text-xl flex justify-between items-center">
                    <p>Lista de viajes del autobus {autobus.placa}</p>
                    <div className="space-x-4 flex items-center">
                        <PrimaryButton className="hidden">ver modelo</PrimaryButton>
                        <PrimaryButton className="rounded-none" onClick={() => navigate('viaje/create')}> registrar un viaje</PrimaryButton>
                    </div>
                </div>
            </>}

            <InputRelatorioComponent idAutobus={id} viajes={viajes} setViajes={setViajes} setAutobus={setAutobus} />

            <div className="w-full px-5 py-2 bg-white">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Origen</th>
                            <th>Destino</th>
                            <th>Dinero en Efectivo</th>
                            <th>Dinero dela Web</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {viajes.map(viaje =>
                            <tr className="hover:bg-slate-200" key={viaje.id}>
                                <td className="py-2">{capitalizeFirstLetter(viaje.salida.ciudad)}, {viaje.salida.abreviacion} - {new DataHora(viaje.salida.dataHora).imprimir()}</td>
                                <td className="text-start">{capitalizeFirstLetter(viaje.destino.ciudad)}, {viaje.destino.abreviacion} - {new DataHora(viaje.destino.dataHora).imprimir()}</td>
                                <td className="text-center">Bs {viaje.valorArrecadadoEfectivo}</td>
                                <td className="text-center">Bs {viaje.valorArrecadadoWeb}</td>
                                <td className="text-center">
                                    <PrimaryButton onClick={() => showViaje(viaje.id)} className="bg-blue-500 rounded-none">Ver viaje</PrimaryButton>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {viajes.length == 0 &&
                    <div className="my-2 w-full px-5 py-2 bg-gray-300 text-center">
                        No hay Viajes Registrados
                    </div>
                }
            </div>

        </div >
    )
}


export default AutobusesShowPage