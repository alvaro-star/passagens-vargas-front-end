import { useEffect, useState } from "react"
import CardViaje from "./Components/CardViaje"
import IFormViaje from "./Types/IFormViaje"
import { useNavigate } from "react-router-dom"
import FormInlineTemplate from "./Components/FormInlineTemplate"
import ProcessLine from "./Components/ProcessLine"
import http from "@/http"
import IVIajeResponse from "./Types/IViajeResponse"
import ICiudad from "@/Types/ICiudad"
import TimeLine from "./Components/TimeLine"


const ViajesPage = () => {
    const navigate = useNavigate()
    const [viajes, setViajes] = useState<IVIajeResponse[]>([])

    const [ciudadSalida, setCiudadSalida] = useState<ICiudad | null>(null);
    const [ciudadDestino, setCiudadDestino] = useState<ICiudad | null>(null);

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

        http.post<IVIajeResponse[]>("viajes", solicitacao)
            .then(resposta => {
                setViajes(resposta.data)
            }).catch(() => {
                alert("Um erro")
            })
    }, [])

    useEffect(() => {
        if (formData) {
            const fetchCiudad = (idCiudad: number, setter: React.Dispatch<React.SetStateAction<ICiudad | null>>) => {
                http.get<ICiudad>(`ciudades/${idCiudad}`)
                    .then(resposta => {
                        setter(resposta.data);
                    });
            };

            fetchCiudad(formData.idCiudadSalida, setCiudadSalida);
            fetchCiudad(formData.idCiudadDestino, setCiudadDestino);
        }
    }, [formData]);

    const escojerViaje = (indexViaje: number | undefined, idViaje: string, idPrecio: string) => {
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
                {formData && ciudadSalida && ciudadDestino && <FormInlineTemplate
                    ciudadSalidaProps={{ value: ciudadSalida.id, label: ciudadSalida.nombre }}
                    ciudadDestinoProps={{ value: ciudadDestino.id, label: ciudadDestino.nombre }}
                    formData={formData} className="mt-8" />}
            </header>
            <section className="w-full bg-gray-200 p-4 px-14 text-lg">
                Pasajes de Autobus de <b className="font-semibold">{ciudadSalida?.nombre}</b> , para <b className="font-semibold">{ciudadDestino?.nombre}</b>
            </section>

            <section className="w-full">
                <ProcessLine step={1} className="my-8 mx-10" />

                <div className="max-w-7xl mx-auto">
                    <TimeLine />
                </div>
                <div className="grid grid-cols-1 gap-5 my-5 mx-auto max-w-7xl">
                    {viajes.map((viaje, index) =>
                        <CardViaje key={viaje.id}
                            index={index}
                            viaje={viaje}
                            escojerViaje={escojerViaje}
                        />
                    )}

                    {viajes.length == 0 &&
                        <div>
                            No hay viajes disponibles
                        </div>
                    }
                </div>
            </section>
        </div>
    )
}


export default ViajesPage