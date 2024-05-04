
import DataHora from "@/Classes/DataHora"
import PrimaryButton from "@/Components/PrimaryButton"
import IViaje from "@/Types/IViaje"
import IParada2 from "@/Types/IViaje/IParada2"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface IViajeExtends extends IViaje {
    paradas: IParada2[]
}

const ViajesShowPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [viaje, setViaje] = useState<IViajeExtends>()

    const formatDataHora = (dataHora: string) => new DataHora(dataHora).imprimir()

    useEffect(() => {
        if (id) {
            http.get<IViajeExtends>(`viajes/${id}`)
                .then(resposta => {
                    setViaje(resposta.data)
                })
        }
    }, [id])

    const ordenarParadas = () => {
        if (viaje) {
            return viaje?.paradas.sort((a: IParada2, b: IParada2) => {
                const dataHoraA: Date = new Date(a.dataHora);
                const dataHoraB: Date = new Date(b.dataHora);
                return dataHoraA.getTime() - dataHoraB.getTime();
            });
        } else return [];
    }

    return (
        <div className="p-10">
            {viaje &&
                <>
                    <div className="mt-5 flex items-center justify-between px-5 py-2 bg-slate-400 text-white rounded-t">
                        <h2>Paradas</h2>
                        <PrimaryButton onClick={() => { navigate(`/empresa/paradas/${id}/create`) }}>+ Parada</PrimaryButton>
                    </div>

                    <div className="p-5 bg-gray-200 rounded-b">
                        <table className="w-full text-center">
                            <thead>
                                <tr>
                                    <th className="text-start">Ciudad</th>
                                    <th>Plataforma</th>
                                    <th>Fecha y Hora</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {ordenarParadas().map(parada =>
                                    <tr className="hover:bg-slate-300" key={parada.id}>
                                        <td className="py-2 text-start">{parada.ciudad}, {parada.abreviacion} - {parada.lugar}</td>
                                        <td className="">{parada.plataforma}</td>
                                        <td className="">{formatDataHora(parada.dataHora)}</td>
                                        <td className="">
                                            <div className="space-x-1 text-white">
                                                <button className="bg-yellow-400 rounded p-1.5 px-3 uppercase">
                                                    Editar
                                                </button>
                                                <button className="bg-red-500 rounded p-1.5 px-3 uppercase">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </div>
    )
}

export default ViajesShowPage