import { MouseEvent, useEffect, useState } from "react";
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
    const [sillas, setSillas] = useState<number[]>([])
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
                    let precioApi = resposta.data
                    if (precioApi?.piso?.nSillas) {
                        let SillasDisponibles = [precioApi.piso.primeraSilla]
                        SillasDisponibles.length = precioApi?.piso?.nSillas
                        precioApi.piso.posicoesIndisponiveis.forEach(indisponivel => {
                            SillasDisponibles[indisponivel - 1] = -1
                        })
                        let contador = SillasDisponibles[0]
                        for (let index = 1; index < precioApi.piso.nSillas; index++) {
                            if (SillasDisponibles[index] != -1) {
                                contador++
                                SillasDisponibles[index] = contador
                            }
                        }
                        setSillas(SillasDisponibles)
                    }
                })
        } else {
            navigate('/')
        }
    }, [])
    return (
        <div className="w-full flex flex-col items-center">
            <header className="w-full bg-yellow-300 text-white font-bold p-2">Viaje</header>
            <div className="w-96 lg:-rotate-90 lg:-mt-96 mt-10 bg-slate-100 p-5 rounded grid place-content-center">
                <div className="p-2 bg-red-500  text-white text-center rounded-t-xl">
                    Cabeça
                </div>
                <div className="p-5 bg-red-200 grid grid-cols-4 gap-3 place-content-center">

                    <div></div>
                    {(precio?.piso.distribuicaoFileira && precio?.piso.nColunas < 4) ?
                        <>
                            <div className="row-span-12"></div>
                            <div></div>
                        </>
                        :
                        <>
                            <div></div>
                            <div className="row-span-12"></div>
                        </>
                    }
                    <div></div>
                    {sillas.map((silla, index) =>
                        <button onClick={(eve) => adicionar(eve, silla)} key={index} className="text-center lg:rotate-90 h-10 w-10 flex items-center justify-center bg-yellow-300 hover:bg-yellow-100 border">
                            {silla}
                        </button>
                    )}
                </div>
                <div className="p-2 text-white bg-red-500 text-center rounded-b">
                    Rabo
                </div>
            </div>

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