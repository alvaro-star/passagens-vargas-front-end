import { useState } from "react"
import CardViaje from "./Components/CardViaje"
import { useNavigate } from "react-router-dom"
import ProcessLine from "./Components/ProcessLine"
import IVIajeResponse from "./Types/IViajeResponse"
import TimeLine from "./Components/TimeLine"
import FormInlineTemplateDependent from "./Components/FormInlineTemplate/FormInlineTemplateDependent"
import http from "@/http"
import dataConvert from "@/Helpers/Date/dateConvert"
import IType from "@/Types/IType"


const ViajesPage = () => {
    const navigate = useNavigate()
    const [viajes, setViajes] = useState<IVIajeResponse[]>([])

    const [ciudadSalida, setCiudadSalida] = useState<IType | null>(null);
    const [ciudadDestino, setCiudadDestino] = useState<IType | null>(null);
    const [fechaSalida, setFechaSalida] = useState<Date | null>(null);

    const datasIguais = (data1: Date, data2: Date): boolean => {
        return data1.getFullYear() == data2.getFullYear() && data1.getMonth() == data2.getMonth() && data1.getDate() == data2.getDate()
    }
    const fetchViajes = async (idCiudadSalida: number | string, idCiudadDestino: number | string, fechaIda: string) => {
        const solicitacao = {
            idCiudadSalida: idCiudadSalida,
            idCiudadDestino: idCiudadDestino,
            fechaSalida: fechaIda,
        };
        await http.post("viajes", solicitacao)
            .then(resposta => { setViajes(resposta.data) })
            .catch(() => alert("Hubo un error"))
    };
    const clickOtherDay = (fechaNueva: Date | null) => {
        if (fechaNueva && fechaSalida && ciudadSalida && ciudadDestino && !datasIguais(fechaNueva, fechaSalida)) {
            setFechaSalida(fechaNueva)
            fetchViajes(ciudadSalida.value, ciudadDestino.value, dataConvert(fechaNueva))
        }
    }
    const escojerViaje = (viaje: IVIajeResponse, idPrecio: string) => {
        //sessionStorage.removeItem("formViaje")
        let viaje2 = { ...viaje, precios: [] }
        sessionStorage.setItem('viajeData', JSON.stringify(viaje2))
        sessionStorage.setItem('idPrecio', idPrecio)
        navigate(`/viaje`)
    }

    return (
        <div className="w-full">
            <header className="w-full px-14 py-8">
                <h1 className="text-5xl">Logo</h1>
                <FormInlineTemplateDependent
                    className="mt-8"
                    fetchViajes={fetchViajes}
                    setCiudadSalidaProp={setCiudadSalida}
                    setCiudadDestinoProp={setCiudadDestino}
                    setFechaIdaProp={setFechaSalida}
                />
            </header>
            <section className="w-full text-center bg-gray-200 py-5 px-14 text-2xl">
                Pasajes de Autobus de <b className="font-semibold">{ciudadSalida?.label}</b>, para <b className="font-semibold">{ciudadDestino?.label}</b>
            </section>

            <section className="w-full pb-8">
                <ProcessLine step={1} className="my-8 mx-10" />

                <div className="max-w-7xl mx-auto">
                    {fechaSalida && <TimeLine clickOtherDay={clickOtherDay} fechaSalida={fechaSalida} />}
                </div>
                <div className="grid grid-cols-1 gap-5 my-5 mx-auto max-w-7xl">
                    {viajes.map((viaje) =>
                        viaje.precios
                            .filter(precio => !precio.lleno)
                            .map(precio =>
                                <CardViaje key={precio.id} viaje={viaje} precio={precio} escojerViaje={escojerViaje} />
                            ))
                    }

                    {viajes.length == 0 && <div> No hay viajes disponibles</div>}
                </div>
            </section>
        </div>
    )
}


export default ViajesPage