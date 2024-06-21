import DataHora from "@/Classes/DataHora";
import PrimaryButton from "@/Components/PrimaryButton";
import IPiso from "@/Types/IPiso";
import IParada2 from "@/Types/IViaje/IParada2";
import http from "@/http";
import { useEffect, useState } from "react";
import { IoClose, IoInformation } from "react-icons/io5";

interface Props {
    idPrecio: number | string
}
interface ISilla {
    numero: number
    ocupado: boolean
    posicion: number
    pasajero: IPasajeComplete | null
}
interface IPasajeComplete {
    id: string,
    carnet: string,
    nombre: string,
    nascimento: string,
    nSilla: 0,
    salida: IParada2
    destino: IParada2
}

const PasajerosListaEmpresaPage = ({ idPrecio }: Props) => {
    const [sillas, setSillas] = useState<ISilla[]>([])
    const [pisoModel, setPisoModel] = useState<IPiso | null>(null)
    const [pasajeros, setPasajeros] = useState<IPasajeComplete[]>([])

    useEffect(() => {
        http.get(`precios/${idPrecio}/vender`).then(({ data }) => {
            let posicionesString: string = data.piso.posicoesBloqueadas
            let posicionesBloqueadas: number[] = []
            if (posicionesString != '') {
                posicionesBloqueadas = posicionesString.split(',').map(numeroString => parseInt(numeroString))
            }
            data.piso.posicoesBloqueadas = posicionesBloqueadas
            setPisoModel(data.piso)
        })
        http.get(`pasajes/from/${idPrecio}`).then(({ data }) => setPasajeros(data))
    }, [idPrecio])

    useEffect(() => {
        if (!pisoModel) return
        if (!pisoModel.nLinhas || !pisoModel.nColunas) return;
        let SillasDisponibles: ISilla[] = []
        pisoModel.posicoesBloqueadas.forEach((nIndisponivel: number) => {
            SillasDisponibles[nIndisponivel - 1] = {
                numero: -1, ocupado: false, posicion: nIndisponivel, pasajero: null
            }
        })

        let HashMapNSillaIndex: number[] = []

        let contador = pisoModel.primeraSilla - 1

        if (pisoModel.inicioContagem == 'IZQUIERDA') {
            let nQuadrados = pisoModel.nLinhas * pisoModel.nColunas
            for (let index = 0; index < nQuadrados; index++) {
                if (!SillasDisponibles[index]) { // se não existe então não é indisponivel
                    contador++
                    SillasDisponibles[index] = {
                        numero: contador, ocupado: false, posicion: index + 1, pasajero: null
                    }
                    HashMapNSillaIndex.push(index)
                }
            }
        } else {
            for (let i = 0; i < pisoModel.nLinhas; i++) {
                for (let j = pisoModel.nColunas - 1; j >= 0; j--) {
                    let index = pisoModel.nColunas * i + j
                    if (!SillasDisponibles[index]) { // se não existe então não é indisponivel
                        contador++
                        SillasDisponibles[index] = {
                            numero: contador, ocupado: false, posicion: index + 1, pasajero: null
                        }
                        HashMapNSillaIndex.push(index)
                    }
                }
            }
        }

        pasajeros.forEach(pasajeroFor => {
            SillasDisponibles[HashMapNSillaIndex[pasajeroFor.nSilla - pisoModel.primeraSilla]].ocupado = true
            SillasDisponibles[HashMapNSillaIndex[pasajeroFor.nSilla - pisoModel.primeraSilla]].pasajero = pasajeroFor
        })

        setSillas(SillasDisponibles)
    }, [pisoModel, pasajeros])
    const [mostrarLista, setMostrarLista] = useState(true)
    const [aba, setAba] = useState(2)
    const [sillaElegido, setSillaElegido] = useState<ISilla | null>(null)
    return (
        <div className="mt-3">
            <div className="bg-gray-700 text-white px-5 p-3 flex items-center justify-between">
                <p>Piso {pisoModel?.nPiso}</p>
                <div className="flex items-center space-x-2">
                    <p>Mostrar Contenido</p>
                    <input type="checkbox" onChange={() => setMostrarLista(!mostrarLista)} checked={mostrarLista} />
                </div>
            </div>
            <section hidden={!mostrarLista}>
                <section className="w-full flex items-center">
                    <div className={"w-1/2 text-center cursor-pointer p-3 " + (aba == 1 ? 'bg-slate-200' : '')}
                        onClick={() => setAba(1)}
                    >
                        Lista de Pasajero
                    </div>
                    <div className={"w-1/2 text-center cursor-pointer p-3 " + (aba == 2 ? 'bg-slate-200' : '')}
                        onClick={() => setAba(2)}
                    >
                        Ver Modelo del Autobus
                    </div>
                </section>
                <section className={(aba != 2 ? 'hidden' : 'flex') + " relative flex flex-col justify-center items-center bg-white"} >
                    {sillaElegido != null &&
                        <div className="absolute z-30 inset-0 grid place-content-center">
                            <div className="w-64 bg-slate-300 p-5">
                                <div className="flex items-center justify-between">
                                    <p className="font-semibold text-lg">
                                        Datos del pasajero
                                    </p>
                                    <button className="bg-red-500 h-8 w-8 text-white rounded flex items-center justify-center" onClick={() => setSillaElegido(null)}>
                                        <IoClose className="text-xl" />
                                    </button>
                                </div>
                                <p>
                                    Asiento: {sillaElegido.numero}
                                </p>
                                <p>
                                    Nombre: {sillaElegido.pasajero?.nombre}
                                </p>
                                <p>
                                    Carnet: {sillaElegido.pasajero?.carnet}
                                </p>
                                <p>
                                    Salida: {sillaElegido.pasajero?.salida.ciudad}
                                </p>
                                <p>
                                    Destino: {sillaElegido.pasajero?.destino.ciudad}
                                </p>
                                <div className="w-full text-center">
                                    <PrimaryButton className="rounded-none">
                                        DESCARGAR pasaje
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="lg:my-5 lg:h-72  lg:-rotate-90 p-5 rounded grid place-content-center">
                        <div className="p-2 h-14 bg-gray-500  text-white text-center rounded-t-3xl">
                        </div>
                        <div className="p-5 bg-gray-200 grid grid-cols-4 gap-3 place-content-center">
                            {pisoModel && <>
                                <div></div>
                                {(pisoModel.nColunas == 3 && pisoModel.distribuicaoFileira == 'DERECHA')
                                    ? <div style={{ gridRow: `span ${pisoModel.nLinhas + 1} / span ${pisoModel.nLinhas + 1}` }}></div>
                                    : <div></div>
                                }
                                {(pisoModel.nColunas == 3 && pisoModel.distribuicaoFileira == 'IZQUIERDA')
                                    ? <div style={{ gridRow: `span ${pisoModel.nLinhas + 1} / span ${pisoModel.nLinhas + 1}` }}></div>
                                    : <div></div>
                                }
                                <div></div>
                            </>}
                            {sillas.map((silla, index) =>
                                <div key={index} className={"lg:rotate-90 bg-white relative w-14 h-14 grid place-content-center font-semibold text-xl rounded border-2 border-gray-400"}>
                                    {silla.numero}
                                    {silla.ocupado &&
                                        <button disabled={!silla.ocupado} onClick={() => setSillaElegido(silla)} className="absolute text-center disabled:bg-yellow-300 top-0.5 right-0.5 bg-yellow-500 rounded">
                                            <IoInformation className="text-sm font-bold" />
                                        </button>
                                    }
                                </div>
                            )}
                        </div>
                        <div className="p-2 h-10 text-white bg-gray-500 text-center rounded-b">
                        </div>
                    </div>
                </section>
                <section hidden={aba != 1} className="px-5 py-3 bg-white">
                    <table className="w-full">
                        <thead>
                            <tr className="text-start">
                                <th className="text-start">Numero de Silla</th>
                                <th className="text-start">Carnet</th>
                                <th className="text-start">Nombre</th>
                                <th className="text-start">Fecha de Nascimiento</th>
                                <th className="text-start">Salida</th>
                                <th className="text-start">Destino</th>
                                <th>Actions</th>
                            </tr>
                        </thead>
                        <tbody>
                            {sillas.filter(sillaElemento => sillaElemento.ocupado).map((sillaElemento, index) => (
                                <tr className="hover:bg-slate-100" key={index}>
                                    <td className="pl-1.5 py-1.5">
                                        {sillaElemento.numero}
                                    </td>
                                    <td>
                                        {sillaElemento.pasajero!.carnet}
                                    </td>
                                    <td>
                                        {sillaElemento.pasajero!.nombre}
                                    </td>
                                    <td>
                                        {(new DataHora(sillaElemento.pasajero!.nascimento)).data.imprimir()}
                                    </td>
                                    <td>
                                        {sillaElemento.pasajero!.salida.ciudad} - {sillaElemento.pasajero!.salida.abreviacion}
                                    </td>
                                    <td>
                                        {sillaElemento.pasajero!.destino.ciudad} - {sillaElemento.pasajero!.destino.abreviacion}
                                    </td>
                                    <td className="text-center">
                                        <PrimaryButton className="rounded-none">descargar pasaje</PrimaryButton>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </section>
            </section>
        </div >
    )
}
export default PasajerosListaEmpresaPage