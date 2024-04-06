import { useEffect, useState } from "react"
import CardViaje from "./Components/CardViaje"
import IViaje from "../../Types/IViaje"
import IFormViaje from "./IFormViaje"
import http from "../../http"
import { useNavigate } from "react-router-dom"

const ViajesPage = () => {
    const navigate = useNavigate()
    const [viajes, setViajes] = useState<IViaje[]>([])
    useEffect(() => {
        let cookie1 = sessionStorage.getItem("formViaje")
        const formViaje: IFormViaje = cookie1 ? JSON.parse(cookie1) : {}

        const solicitacao = {
            idCiudadSalida: formViaje.idCiudadSalida,
            idCiudadDestino: formViaje.idCiudadDestino,
            fechaSalida: formViaje.fechaSalida,
        }

        http.post<IViaje[]>("viajes", solicitacao)
            .then(resposta => {
                setViajes(resposta.data)
            }).catch(() => {
                alert("Um erro")
            })
    }, [])

    const escojerViaje = (indexViaje: number | undefined, idViaje: number, idPrecio: string) => {
        if (indexViaje != null) {
            if (viajes[indexViaje].id === idViaje) {
                sessionStorage.removeItem("formViaje")
                let viaje = viajes[indexViaje]
                viaje.precios = []
                sessionStorage.setItem('viajeData', JSON.stringify(viaje))
                navigate(`/viaje/${idPrecio}`)
            }
        }
    }

    return (
        <div className="">
            <section className="w-full mt-5">
                <h2 className="m-5 text-2xl font-bold">Viajes</h2>
                <div className="grid grid-cols-1 gap-5 m-5">
                    {viajes.map((viaje, index) =>
                        <CardViaje key={viaje.id}
                            index={index}
                            viaje={viaje}
                            escojerViaje={escojerViaje}
                        />
                    )}
                </div>
            </section>
        </div>
    )
}


export default ViajesPage