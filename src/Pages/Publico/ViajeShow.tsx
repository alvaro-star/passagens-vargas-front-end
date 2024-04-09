import { MouseEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../http";
import IPiso from "../../Types/IPiso";
import Piso from "./Components/Piso";
import SillaSquare from "./Components/SillaSquare";
import PrimaryButton from "../../Components/PrimaryButton";
import CardViaje from "./Components/CardViaje";
import IViaje from "../../Types/IViaje";
import ProcessLine from "./Components/ProcessLine";


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
        <div className="w-full flex flex-col items-center">
            <header className="w-full bg-yellow-300 text-white font-bold p-2">Viaje</header>
            <div className="w-full">
                <ProcessLine className="my-8 mx-10" />
            </div>

            <section className="w-full">
                {viaje &&
                    <CardViaje className="m-5" viaje={viaje} />
                }
            </section>

            {precio?.piso &&
                <Piso piso={precio.piso} adicionar={adicionar} sillasOcupadas={precio.sillasOcupadas} />}

            <section className="bg-green-400 mt-10 lg:-mt-40  w-full p-10">
                <h2 className="text-white font-bold">
                    Sillas Escogidas:
                </h2>
                <div className="flex flex-wrap mt-2 gap-4">
                    {sillasEscogidas.map((nSilla, index) =>
                        <SillaSquare nSilla={nSilla} onClick={(eve) => adicionar(eve, nSilla)} key={index} />
                    )}
                </div>
                <PrimaryButton onClick={eve => mandar(eve)} className="mt-2" disabled={sillasEscogidas.length == 0} >Mandar Lista</PrimaryButton>
            </section>
        </div>
    )
}

export default ViajeShow;