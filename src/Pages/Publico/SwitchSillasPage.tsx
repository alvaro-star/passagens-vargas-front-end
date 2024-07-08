import { MouseEvent, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Piso from "./Components/Piso";
import CardViaje from "./Components/CardViaje";
import ProcessLine from "./Components/ProcessLine";
import http from "@/http";
import IPiso from "@/Types/IPiso";
import ISilla from "@/Types/ISilla";
import PrimaryButton from "@/Components/PrimaryButton";
import IVIajeResponse from "./Types/IViajeResponse";
import FormInlineTemplateIndependent from "./Components/FormInlineTemplateIndependent";

interface IPrecio {
    id: string,
    precio: number,
    nPiso: number,
    lleno: boolean,
    nSillasDisponibles: number,
    piso: IPiso
    sillasOcupadas: number[],
    idViaje: number
}

const SwitchSillasPage = () => {

    const navigate = useNavigate()


    const [precio, setPrecio] = useState<IPrecio>()
    const [viaje, setViaje] = useState<IVIajeResponse>()
    const [sillasEscogidas, setSillasEscogidas] = useState<number[]>([])

    const clickSilla = (eve: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, silla: ISilla) => {
        eve.preventDefault()
        if (silla.numero != -1 && silla.ocupado == false && sillasEscogidas.includes(silla.numero)) {
            setSillasEscogidas(sillasEscogidas.filter(value => value != silla.numero).sort((a, b) => a - b))
        } else {
            if (sillasEscogidas.length < 5)
                setSillasEscogidas([...sillasEscogidas, silla.numero].sort((a, b) => a - b))
        }
    }

    const adicionar = (eve: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, nSilla: number) => {
        eve.preventDefault()
        if (nSilla != -1 && sillasEscogidas.includes(nSilla)) {
            setSillasEscogidas(sillasEscogidas.filter(value => value != nSilla).sort((a, b) => a - b))
        } else {
            if (sillasEscogidas.length < 5) {
                setSillasEscogidas([...sillasEscogidas, nSilla].sort((a, b) => a - b))
            }
        }
    }

    const mandar = () => {
        if (sillasEscogidas.length > 0) {
            sessionStorage.setItem("sillasFromViaje", sillasEscogidas.join())
            navigate(`/viaje/step3/${precio?.id}`)
        }
    }

    useEffect(() => {
        let cookie1 = sessionStorage.getItem("viajeData")
        let cookie2 = sessionStorage.getItem("idPrecio")
        let cookieJSON1 = cookie1 ? cookie1 : ''
        let cookieJSON2 = cookie2 ? cookie2 : ''
        if (cookieJSON1 === '' || cookieJSON2 === '')
            navigate('/')

        const viajeS = JSON.parse(cookieJSON1)
        setViaje(viajeS)

        http.get(`precios/${cookieJSON2}/vender`)
            .then(resposta => {
                let posicionesString: string = resposta.data.piso.posicoesBloqueadas
                let posicionesBloqueadas: number[] = []
                if (posicionesString != '') {
                    posicionesBloqueadas = posicionesString.split(',').map(numeroString => parseInt(numeroString))
                }
                resposta.data.piso.posicoesBloqueadas = posicionesBloqueadas
                setPrecio(resposta.data)
            })

    }, [])

    return (
        <div className="w-full bg-slate-100 flex flex-col">
            <header className="w-full h-64 bg-slate-500 p-2 flex flex-col items-center justify-center space-y-6">
                <div className="text-white font-semibold text-4xl text-center">Header</div>
                <FormInlineTemplateIndependent className="w-full" />
            </header>
            <div className="w-full">
                <ProcessLine step={2} className="my-8 mx-10" />
            </div>

            <section className="w-full max-w-7xl mx-auto">
                {viaje && <CardViaje className="m-5" viaje={viaje} />}
            </section>

            <section className="px-10 w-full my-10">
                {precio?.piso &&
                    <Piso piso={precio.piso} clickSilla={clickSilla} sillasOcupadas={precio.sillasOcupadas} />}
            </section>
            <section className="w-full mb-10 text-sky-900">
                <div className="max-w-7xl mx-auto grid grid-cols-2 gap-3">
                    <section className="border-2 border-gray-300 p-5 rounded-lg">
                        <h2 className="text-xl font-bold">Preferências y Condiciones</h2>
                        <h3 className="mt-2 text-lg font-semibold uppercase">Reembolsos y cambios</h3>
                        <p>Tasas de reembolsos hasta 3h antes dela salida - 100%</p>
                        <p>Cambia de fecha tu viaje gratis</p>
                        <h3 className="mt-2 text-lg font-semibold uppercase">Requisitos de Embarque</h3>
                        <p>Pide tu boleto en la terminal antes de partir</p>
                        <p>Los certificados</p>
                    </section>
                    <section className="">
                        <section className="border-2 border-gray-300 w-full p-5 rounded-lg">
                            <h2 className="text-xl font-bold">
                                Sillas Escogidas:
                            </h2>
                            <div className="flex flex-wrap mt-2 gap-4">
                                {sillasEscogidas.map((nSilla, index) =>
                                    <button
                                        onClick={(eve) => adicionar(eve, nSilla)}
                                        className="h-10 w-10 border-2 border-gray-500 bg-gray-300 rounded font-bold text-black"
                                        key={index}>
                                        {nSilla}
                                    </button>
                                )}
                            </div>
                        </section>
                        <PrimaryButton
                            onClick={mandar}
                            className="mt-2"
                            disabled={sillasEscogidas.length == 0} >
                            Escoger lista
                        </PrimaryButton>
                    </section>
                </div>
            </section>
        </div>
    )
}

export default SwitchSillasPage;