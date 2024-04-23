
import IViaje from "@/Types/IViaje"
import IParada2 from "@/Types/IViaje/IParada2"
import http from "@/http"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"

interface ITrayectoExtends extends IViaje {
    paradas: IParada2[]
}


const ViajesShowPage = () => {
    const parametros = useParams()
    const [trayecto, setTrayecto] = useState<ITrayectoExtends>()

    const formatDataHora = (dataHora: string) => {
        let [data, time] = dataHora.split('T')
        let [ano, mes, dia] = data.split('-')
        let [hora, minutos] = time.split(':')
        return `${dia}/${mes}/${ano} alas ${hora}:${minutos}`
    }

    useEffect(() => {
        if (parametros.id) {
            http.get<ITrayectoExtends>(`viajes/${parametros.id}`)
                .then(resposta => setTrayecto(resposta.data))
        }
    }, [parametros])
    return (
        <div className="p-10">
            {trayecto &&
                <>
                    <h1 className="mt-5 px-5 py-2 bg-slate-400 text-white rounded">
                        Paradas
                    </h1>
                    <div className="grid grid-cols-2 px-5 py-3 rounded">
                        <p>Ciudad</p>
                        <p className="text-end mr-7">Fecha y Hora</p>
                    </div>
                    <div className="mt-0 space-y-3">
                        {trayecto.paradas.map(parada =>
                            <div className="grid grid-cols-3  px-5 py-3 bg-gray-300 rounded" key={parada.id}>
                                <p>{parada.ciudad}, {parada.abreviacion} - {parada.lugar}</p>
                                <p className="text-center">Plataforma: {parada.plataforma}</p>
                                <p className="text-end">{formatDataHora(parada.dataHora)}</p>
                            </div>)}
                    </div>
                </>
            }
        </div>
    )
}

export default ViajesShowPage