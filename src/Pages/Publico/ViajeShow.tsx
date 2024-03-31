import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import http from "../../http";

interface IPrecio {
    id: string,
    precio: number,
    nPiso: number,
    lleno: boolean,
    nSillasDisponibles: number,
    piso: {
        id: number,
        nLinhas: number,
        nColunas: number,
        distribuicaoFileira: string,
        nPiso: number,
        inicioContagem: string,
        nSillas: number,
        primeraSilla: number,
        idAutobus: number,
        posicoesIndisponiveis: []
    },
    sillasOcupadas: []
}

const ViajeShow = () => {
    const parametros = useParams()
    const navigate = useNavigate()
    const [precio, setPrecio] = useState<IPrecio>()
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
            <div className="w-96 bg-slate-100 p-5 rounded grid place-content-center">
                <div className="linha grid grid-cols-4 gap-3 place-content-center">
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 row-span-3 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                    <div className="w-10 h-10 bg-red-100 text-center">T</div>
                </div>
            </div>
        </div>
    )
}

export default ViajeShow;