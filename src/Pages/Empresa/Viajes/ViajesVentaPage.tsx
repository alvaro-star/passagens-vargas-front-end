import DataHora from "@/Classes/DataHora";
import PrimaryButton from "@/Components/PrimaryButton";
import http from "@/http";
import Piso from "@/Pages/Publico/Components/Piso";
import SillaSquare from "@/Pages/Publico/Components/SillaSquare";
import IPiso from "@/Types/IPiso";
import ISilla from "@/Types/ISilla";
import IParada2 from "@/Types/IViaje/IParada2";
import { MouseEvent, useEffect, useState } from "react";
import { FaArrowRight } from "react-icons/fa";
import { useNavigate, useParams } from "react-router-dom"
import ISillaFromViajeFuncionario from "./Types/ISillaFromViajeFuncionario";
import IViaje from "./Types/IViajeIndex";
interface IViajeExtends extends IViaje {
    paradas: IParada2[]
}

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

const ViajesVentaPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [viaje, setViaje] = useState<IViajeExtends>()
    const [paradaSalida, setParadaSalida] = useState<IParada2>()
    const [paradaDestino, setParadaDestino] = useState<IParada2>()
    const [precio1, setPrecio1] = useState<IPrecio | null>(null)
    const [precio2, setPrecio2] = useState<IPrecio | null>(null)
    const [sillasEscogidas, setSillasEscogidas] = useState<number[]>([])
    const [nPiso, setNPiso] = useState(1)

    useEffect(() => {
        const cookie1 = sessionStorage.getItem("viajeSelectFuncionario")
        if (id && cookie1) {
            let viajeCookie: IViaje = JSON.parse(cookie1)
            http.get<IViajeExtends>(`viajes/${id}`)
                .then(({ data }) => {
                    const viajeResponse = data;
                    viajeResponse.paradas = ordenarParadas(viajeResponse.paradas);
                    data.paradas.forEach(paf => {
                        console.log();
                        if (viajeCookie.salida.idLugar === paf.idLugar)
                            setParadaSalida(paf)
                        if (viajeCookie.destino.idLugar === paf.idLugar)
                            setParadaDestino(paf)
                    })
                    setViaje(viajeResponse);

                    switch (viajeResponse.precios.length) {
                        case 1:
                            getPisoApi(viajeResponse.precios[0].id, setPrecio1)
                            break;
                        case 2:
                            let indicePrimerPiso = viajeResponse.precios[0].nPiso == 1 ? 0 : 1
                            let indiceSegundoPiso = viajeResponse.precios[0].nPiso == 2 ? 0 : 1
                            getPisoApi(viajeResponse.precios[indicePrimerPiso].id, setPrecio1)
                            getPisoApi(viajeResponse.precios[indiceSegundoPiso].id, setPrecio2)
                    }
                }).catch(erro => {
                    console.log(erro)
                    alert("Ocurrio un error en la consulta del viaje")
                });
        }
    }, [id]);
    const getPisoApi = (idPrecio: string | null, setPrecioParam: (precio: IPrecio) => void) => {
        if (idPrecio) {
            http.get(`precios/${idPrecio}/vender`)
                .then(resposta => {
                    let posicionesString: string = resposta.data.piso.posicoesBloqueadas
                    let posicionesBloqueadas: number[] = []
                    if (posicionesString != '')
                        posicionesBloqueadas = posicionesString.split(',').map(numeroString => parseInt(numeroString))
                    resposta.data.piso.posicoesBloqueadas = posicionesBloqueadas
                    setPrecioParam(resposta.data)
                })
        }
    }
    const ordenarParadas = (paradas: IParada2[]) => {
        if (paradas.length > 0)
            return [...paradas].sort((a: IParada2, b: IParada2) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
        return [];
    };
    const clickSilla = (eve: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, silla: ISilla) => {
        eve.preventDefault()
        if (silla.numero != -1 && silla.ocupado == false && sillasEscogidas.includes(silla.numero)) {
            setSillasEscogidas(sillasEscogidas.filter(value => value != silla.numero).sort((a, b) => a - b))
        } else {
            if (sillasEscogidas.length < 7)
                setSillasEscogidas([...sillasEscogidas, silla.numero].sort((a, b) => a - b))
        }
    }

    const remover = (eve: MouseEvent<HTMLButtonElement, globalThis.MouseEvent>, nSilla: number) => {
        eve.preventDefault()
        if (nSilla != -1 && sillasEscogidas.includes(nSilla)) {
            setSillasEscogidas(sillasEscogidas.filter(value => value != nSilla).sort((a, b) => a - b))
        } else {
            if (sillasEscogidas.length < 7) {
                setSillasEscogidas([...sillasEscogidas, nSilla].sort((a, b) => a - b))
            }
        }
    }

    const mandarLista = () => {
        const form: ISillaFromViajeFuncionario = {
            sillas: sillasEscogidas,
            precio1: precio1 ? precio1.precio : -1,
            precio2: precio2 ? precio2.precio : -1,
            nSillaMedio: precio2 ? precio2.piso.primeraSilla : -1
        }
        sessionStorage.setItem("sillaFromViajeFuncionario", JSON.stringify(form))
        navigate("/empresa/viajes/" + id + "/pagar")
    }
    return <div className="max-w-7xl mx-auto py-5 space-y-5">
        <section className="bg-white p-5 border border-gray-700">
            <h2 className="text-xl font-semibold">
                Ruta del viaje
            </h2>
            <div className="flex items-center space-x-2">
                {viaje && paradaSalida && paradaDestino && viaje.paradas.map((parada, index) =>
                    <div key={parada.id} className="flex items-center space-x-2">
                        <div hidden={index === 0}>
                            <FaArrowRight />
                        </div>
                        <div className={(parada.idLugar == paradaSalida?.idLugar || parada.idLugar == paradaDestino?.idLugar) ? "font-bold" : ""}>
                            {parada.ciudad}, {parada.abreviacion}
                        </div>
                    </div>
                )}
            </div>
        </section>
        <section className="p-5 bg-white border border-gray-700 flex space-x-5 items-center">
            {paradaSalida && paradaDestino && <>
                <div>
                    <h2 className="font-semibold">Salida</h2>
                    {paradaSalida.lugar}, {paradaSalida.abreviacion} - {paradaSalida.departamento} {new DataHora(paradaSalida.dataHora).imprimir()}
                </div>
                <div>
                    <h2 className="font-semibold">Destino</h2>
                    {paradaDestino.lugar}, {paradaDestino.abreviacion} - {paradaDestino.departamento} {new DataHora(paradaDestino.dataHora).imprimir()}
                </div>
            </>}
        </section>
        <section className="py-5 w-full bg-white border border-gray-700">
            <select hidden={viaje?.precios.length == 1} value={nPiso} onChange={eve => setNPiso(parseInt(eve.target.value))} className="px-2.5 py-2.5 w-32 h-11 ml-6 text-gray-900 bg-white rounded border border-gray-700 appearance-none focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500">
                <option value={1}>Piso 1</option>
                <option value={2}>Piso 2</option>
                <option value={3}>Ambos</option>
            </select>
            <div className="space-y-3">
                {precio1 != null && <div hidden={nPiso == 2}>
                    <Piso piso={precio1.piso} sillasOcupadas={precio1.sillasOcupadas} clickSilla={clickSilla} />
                </div>}
                {precio2 != null && <div hidden={nPiso == 1}>
                    <Piso piso={precio2.piso} sillasOcupadas={precio2.sillasOcupadas} clickSilla={clickSilla} />
                </div>}
            </div>
        </section>
        <section className="flex items-center justify-between space-x-3 p-5 border border-gray-700 bg-white">
            <div className="space-x-3 flex items-center">
                <h3 className="font-semibold">
                    Sillas Escogidas:
                </h3>
                <div className="flex space-x-4">
                    {sillasEscogidas.map((silla, indexSilla) => <SillaSquare key={indexSilla} onClick={eve => remover(eve, silla)} nSilla={silla} />)}
                </div>
            </div>
            <div className="">
                <PrimaryButton onClick={mandarLista} disabled={sillasEscogidas.length == 0} className="rounded-none">escojer lista</PrimaryButton>
            </div>
        </section>
    </div>
}

export default ViajesVentaPage