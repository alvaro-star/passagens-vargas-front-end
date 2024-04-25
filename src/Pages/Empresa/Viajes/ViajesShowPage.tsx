
import PrimaryButton from "@/Components/PrimaryButton"
import IViaje from "@/Types/IViaje"
import IParada2 from "@/Types/IViaje/IParada2"
import http from "@/http"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface IViajeExtends extends IViaje {
    paradas: IParada2[]
}


const ViajesShowPage = () => {
    const parametros = useParams()
    const [viaje, setViaje] = useState<IViajeExtends>()

    const formatDataHora = (dataHora: string) => {
        let [data, time] = dataHora.split('T')
        let [ano, mes, dia] = data.split('-')
        let [hora, minutos] = time.split(':')
        return `${dia}/${mes}/${ano} alas ${hora}:${minutos}`
    }

    useEffect(() => {
        if (parametros.id) {
            http.get<IViajeExtends>(`viajes/${parametros.id}`)
                .then(resposta => setViaje(resposta.data))
        }
    }, [parametros])
    return (
        <div className="p-10">
            {viaje &&
                <>
                    <div className="mt-5 flex items-center justify-between px-5 py-2 bg-slate-400 text-white rounded-t">
                        <h2>Paradas</h2>
                        <PrimaryButton>+ Parada</PrimaryButton>
                    </div>
                    <div className="p-5 bg-gray-200 rounded-b">
                        <table className="w-full text-center">
                            <thead>
                                <tr>
                                    <th className="text-start">Ciudad</th>
                                    <th>Plataforma</th>
                                    <th>Fecha y Hora</th>
                                    <th className="w-64">Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viaje.paradas.map(parada =>
                                    <tr className="hover:bg-slate-300" key={parada.id}>
                                        <td className="py-2 text-start">{parada.ciudad}, {parada.abreviacion} - {parada.lugar}</td>
                                        <td className="">{parada.plataforma}</td>
                                        <td className="">{formatDataHora(parada.dataHora)}</td>
                                        <td className="">
                                            <div className="space-x-1 text-white">
                                                <button className="text-center bg-blue-700 rounded p-1.5 px-3 uppercase">
                                                    Ver
                                                </button>
                                                <button className="bg-yellow-400 rounded p-1.5 px-3 uppercase">
                                                    Editar
                                                </button>
                                                <button className="bg-red-500 rounded p-1.5 px-3 uppercase">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>)}
                            </tbody>
                        </table>
                    </div>

                    
                </>
            }
        </div>
    )
}

export default ViajesShowPage