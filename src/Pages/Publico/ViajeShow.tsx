import { MouseEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../http";
import IPiso from "../../Types/IPiso";
import Piso from "./Components/Piso";
import SillaSquare from "./Components/SillaSquare";

import PrimaryButton from "../../Components/PrimaryButton";

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
            navigate('/viaje/step3')
        }
    }

    useEffect(() => {
        if (parametros.id) {
            let idViaje;
            http.get<IPrecio>(`precios/${parametros.id}/vender`)
                .then(resposta => {
                    setPrecio(resposta.data)
                    idViaje = resposta.data.idViaje
                    console.log(resposta.data);
                })
        } else {
            navigate('/')
        }
    }, [])

    return (
        <div className="w-full flex flex-col items-center">
            <header className="w-full bg-yellow-300 text-white font-bold p-2">Viaje</header>

            {precio?.piso &&
                <Piso piso={precio.piso} adicionar={adicionar} />}

            <div className="bg-green-400 mt-10 lg:-mt-96  w-full p-10">
                <h2 className="text-white font-bold">
                    Sillas Escogidas:
                </h2>
                <div className="flex flex-wrap mt-2 gap-4">
                    {sillasEscogidas.map((nSilla, index) =>
                        <SillaSquare nSilla={nSilla} onClick={(eve) => adicionar(eve, nSilla)} key={index} />
                    )}
                </div>
                <PrimaryButton onClick={eve => mandar(eve)} className="mt-2" disabled={sillasEscogidas.length == 0} >Mandar Lista</PrimaryButton>
            </div>
        </div>
    )
}

export default ViajeShow;