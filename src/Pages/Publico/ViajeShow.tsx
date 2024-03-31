import { MouseEvent, useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../http";
import IPiso from "../../Types/IPiso";
import Piso from "./Components/Piso";

interface IPrecio {
    id: string,
    precio: number,
    nPiso: number,
    lleno: boolean,
    nSillasDisponibles: number,
    piso: IPiso
    sillasOcupadas: number[]
}

const ViajeShow = () => {
    const parametros = useParams()
    const navigate = useNavigate()

    const [precio, setPrecio] = useState<IPrecio>()
    const [sillasEscogidas, setSillasEscogidas] = useState<number[]>([])

    const adicionar = (eve: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, nSilla: number) => {
        eve.preventDefault()
        if (sillasEscogidas.includes(nSilla)) {
            setSillasEscogidas(sillasEscogidas.filter(value => value != nSilla))
        } else {
            setSillasEscogidas([...sillasEscogidas, nSilla])
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
    }, [])

    return (
        <div className="w-full flex flex-col items-center">
            <header className="w-full bg-yellow-300 text-white font-bold p-2">Viaje</header>
            
            {precio?.piso && <Piso piso={precio.piso} adicionar={adicionar} />}

            <div className="bg-green-400 mt-10 lg:-mt-96  w-full p-10">
                <h2 className="text-white font-bold">
                    Sillas Escogidas:
                </h2>
                <div className="flex flex-wrap gap-4">
                    {sillasEscogidas.map((nSilla, index) =>
                        <button key={index} onClick={eve => adicionar(eve, nSilla)} className="h-10 w-10 bg-red-500 text-white flex justify-center items-center p-2 border rounded hover:bg-red-100">
                            {nSilla}
                        </button>
                    )}
                </div>
            </div>
        </div>
    )
}

export default ViajeShow;