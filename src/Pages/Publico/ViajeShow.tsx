import { MouseEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../http";
import IPiso from "../../Types/IPiso";
import Piso from "./Components/Piso";
import PrimaryButton from "../../Components/PrimaryButton";
import CardViaje from "./Components/CardViaje";
import IViaje from "../../Types/IViaje";
import ProcessLine from "./Components/ProcessLine";
import FormInlineTemplate from "./Components/FormInlineTemplate";


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

const ViajeShow = () => {
    const parametros = useParams()
    const navigate = useNavigate()

    const [precio, setPrecio] = useState<IPrecio>()
    const [viaje, setViaje] = useState<IViaje>()
    const [sillasEscogidas, setSillasEscogidas] = useState<number[]>([])

    const adicionar = (eve: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, nSilla: number) => {
        eve.preventDefault()
        if (sillasEscogidas.includes(nSilla)) {
            setSillasEscogidas(sillasEscogidas.filter(value => value != nSilla).sort((a, b) => a - b))
        } else {
            if (sillasEscogidas.length < 5) {
                setSillasEscogidas([...sillasEscogidas, nSilla].sort((a, b) => a - b))
            }
        }
    }

    const mandar = (eve: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>) => {
        eve.preventDefault()
        if (sillasEscogidas.length > 0) {
            sessionStorage.setItem("sillasFromViaje", sillasEscogidas.join())
            navigate(`/viaje/step3/${precio?.id}`)
        }
    }

    useEffect(() => {
        if (parametros.id) {
            http.get<IPrecio>(`precios/${parametros.id}/vender`)
                .then(resposta => {
                    setPrecio(resposta.data)
                })
        } else {
            navigate('/')
        }

        let cookie1 = sessionStorage.getItem("viajeData")
        let cookieJSON = cookie1 ? cookie1 : ''
        if (cookie1 === '') {
            navigate('/')
        }

        const viajeS = JSON.parse(cookieJSON)
        setViaje(viajeS)

    }, [])

    return (
        <div className="w-full bg-slate-100 flex flex-col items-center">
            <header className="w-full h-64 bg-slate-500 p-2 grid place-content-center gap-6">
                <div className="text-white font-semibold text-4xl text-center">Header</div>
                <FormInlineTemplate />
            </header>
            <div className="w-full">
                <ProcessLine step={2} className="my-8 mx-10" />
            </div>

            <section className="w-full">
                {viaje && <CardViaje className="m-5" viaje={viaje} />}
            </section>

            <section className="px-10 w-full my-10">
                {precio?.piso &&
                    <Piso piso={precio.piso} adicionar={adicionar} sillasOcupadas={precio.sillasOcupadas} />}
            </section>
            <section className="w-full px-20  mb-10 text-sky-900">
                <div className="grid grid-cols-2 gap-3">
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
                            onClick={eve => mandar(eve)}
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

export default ViajeShow;