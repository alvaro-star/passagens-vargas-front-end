import PrimaryButton from "@/Components/PrimaryButton"
import http from "@/http"
import IPage from "@/Types/IPage"
import { useEffect, useState } from "react"
import IViaje from "../Types/IViajeIndex"
import DataHora from "@/Classes/DataHora"
interface Props {
    numeroAbaAtual: number
    numeroAbaJanela: number
    path: string
    order: string
    showViaje: (codigo: string) => void
}

const ViajeTable = ({ numeroAbaAtual, numeroAbaJanela, path, order, showViaje }: Props) => {
    const [viajes, setViajes] = useState<IViaje[]>([])
    const [nextPage, setNextPage] = useState<null | number>(null)

    useEffect(() => {
        http.get<IPage<IViaje>>(path + "?sortBy=dataHoraSalida&sortDirection=" + order)
            .then(resposta => {
                setViajes(resposta.data.content)
                if (resposta.data.totalPages > 1) {
                    setNextPage(1)
                } else {
                    setNextPage(null)
                }
            })
    }, [])

    const verMais = () => {
        if (nextPage != null) {
            http.get<IPage<IViaje>>(`${path}?sortBy=dataHoraSalida&sortDirection=${order}&page=${nextPage}`)
                .then(resposta => {
                    setViajes(viajes.concat(resposta.data.content))
                    if (resposta.data.totalPages <= resposta.data.pageable.pageNumber + 1) {
                        setNextPage(null)
                    } else {
                        setNextPage(resposta.data.pageable.pageNumber + 1)
                    }
                })
        }
    }

    return <div className={"bg-slate-300 p-5 " + (numeroAbaJanela != numeroAbaAtual ? "hidden" : "")}>
        <table className="w-full">
            <thead>
                <tr>
                    <th className="text-start">Salida</th>
                    <th>Destino</th>
                    <th>Saldo en Efectivo</th>
                    <th>Saldo en Web</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                {viajes.map(viaje =>
                    <tr key={viaje.id} className={viaje.isCobrado ? "text-green-600" : "text-red-500"}>
                        <td className="py-2">{viaje.salida.ciudad + ", " + viaje.salida.abreviacion} - {new DataHora(viaje.salida.dataHora).imprimir()}</td>
                        <td className="py-2 text-center">{viaje.destino.ciudad + ", " + viaje.destino.abreviacion} - {new DataHora(viaje.destino.dataHora).imprimir()}</td>
                        <td className="text-center">Bs {viaje.valorArrecadadoEfectivo}</td>
                        <td className="text-center">Bs {viaje.valorArrecadadoWeb}</td>
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
        {nextPage != null &&
            <div className="w-full text-center">
                <PrimaryButton className="rounded-none" onClick={verMais}>Ver mas</PrimaryButton>
            </div>
        }
    </div>
}

export default ViajeTable