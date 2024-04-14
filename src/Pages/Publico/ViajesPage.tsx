import { useEffect, useState } from "react"
import CardViaje from "./Components/CardViaje"
import IFormViaje from "./IFormViaje"
import { useNavigate } from "react-router-dom"
import FormInlineTemplate from "./Components/FormInlineTemplate"
import ProcessLine from "./Components/ProcessLine"
import IViaje from "@/Types/IViaje"
import http from "@/http"

const ViajesPage = () => {
    const navigate = useNavigate()
    const [viajes, setViajes] = useState<IViaje[]>([])

    const [formData, setFormData] = useState<IFormViaje>()
    useEffect(() => {
        let cookie1 = sessionStorage.getItem("formViaje")
        const formViaje: IFormViaje = cookie1 ? JSON.parse(cookie1) : {}
        setFormData(formViaje)

        const solicitacao = {
            idCiudadSalida: formViaje.idCiudadSalida,
            idCiudadDestino: formViaje.idCiudadDestino,
            fechaSalida: formViaje.fechaSalida,
        }

        http.post<IViaje[]>("viajes", solicitacao)
            .then(resposta => {
                setViajes(resposta.data)
                console.log(resposta.data);

            }).catch(() => {
                alert("Um erro")
            })
    }, [])

    const escojerViaje = (indexViaje: number | undefined, idViaje: number, idPrecio: string) => {
        if (indexViaje != null) {
            if (viajes[indexViaje].id === idViaje) {
                //sessionStorage.removeItem("formViaje")
                let viaje = viajes[indexViaje]
                viaje.precios = []
                sessionStorage.setItem('viajeData', JSON.stringify(viaje))
                navigate(`/viaje/${idPrecio}`)
            }
        }
    }

    return (
        <div className="w-full">
            <header className="w-full px-14 py-8">
                <h1 className="text-5xl"> Logo</h1>
                {formData &&
                    <FormInlineTemplate formData={formData} className="mt-8" />
                }
            </header>
            <section className="w-full bg-gray-200 p-4 px-14 text-lg">
                Pasajes (Falta configurarar o back-end) de Autobus de <b className="font-semibold">Teste - T</b> , para <b className="font-semibold">Potosi - PT</b>
            </section>

            <section className="w-full">

                <ProcessLine step={1} className="my-8 mx-10" />


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