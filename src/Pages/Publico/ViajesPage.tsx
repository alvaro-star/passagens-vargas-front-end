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
    const [fechaSalidaSelecionada, setFechaSalidaSelecionada] = useState<Date>(new Date());

    const [formData, setFormData] = useState<IFormViaje>()
    const fetchData = async () => {
        try {
            let cookie1 = sessionStorage.getItem("formViaje");
            const formViaje = cookie1 ? JSON.parse(cookie1) : {};

            setFormData(formViaje);

            // Garantir que formViaje tenha os valores necessários antes de fazer a solicitação
            if (formViaje.idCiudadSalida && formViaje.idCiudadDestino && formViaje.fechaSalida) {
                const solicitacao = {
                    idCiudadSalida: formViaje.idCiudadSalida,
                    idCiudadDestino: formViaje.idCiudadDestino,
                    fechaSalida: formViaje.fechaSalida,
                };

                const resposta = await http.post("viajes", solicitacao);
                setViajes(resposta.data);
            }
        } catch (error) {
            alert("Um erro ocorreu");
        }
    };
    useEffect(() => {
        fetchData()
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
            setFechaSalidaSelecionada(new Date(formData.fechaSalida + "T00:00:00"));
        }
    }, [formData]);

    const escojerViaje = (indexViaje: number | undefined, idViaje: string, idPrecio: string) => {
        if (indexViaje != null) {
            if (viajes[indexViaje].id === idViaje) {
                //sessionStorage.removeItem("formViaje")
                let viaje = viajes[indexViaje]
                viaje.precios = []
                sessionStorage.setItem('viajeData', JSON.stringify(viaje))
                sessionStorage.setItem('idPrecio', idPrecio)
                navigate(`/viaje`)
            }
            else {
                console.log("O id do viaje e o id Passado sao diferentes");
                console.log("Id del index" + viajes[indexViaje].id);
                console.log("Id del viaje" + idViaje);
            }
        } else {
            console.log("O indice nao existe");
        }
    }

    return (
        <div className="w-full">
            <header className="w-full px-14 py-8">
                <h1 className="text-5xl">Logo</h1>
                {formData && ciudadSalida && ciudadDestino &&
                    <FormInlineTemplate
                        ciudadSalidaProps={ciudadSalida}
                        ciudadDestinoProps={ciudadDestino}
                        formData={formData} className="mt-8" />
                }
            </header>
            <section className="w-full text-center bg-gray-200 py-5 px-14 text-2xl">
                Pasajes de Autobus de <b className="font-semibold">{ciudadSalida?.nombre}</b>, para <b className="font-semibold">{ciudadDestino?.nombre}</b>
            </section>

            <section className="w-full pb-8">
                <ProcessLine step={1} className="my-8 mx-10" />

                <div className="max-w-7xl mx-auto">
                    <TimeLine fechaSalida={fechaSalidaSelecionada} />
                </div>
                <div className="grid grid-cols-1 gap-5 my-5 mx-auto max-w-7xl">
                    {viajes.map((viaje, index) =>
                        <CardViaje key={viaje.id}
                            indexViaje={index}
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