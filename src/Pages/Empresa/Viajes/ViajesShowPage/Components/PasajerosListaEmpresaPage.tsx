import DataHora from "@/Classes/DataHora";
import PrimaryButton from "@/Components/PrimaryButton";
import IPiso from "@/Types/IPiso";
import http from "@/http";
import { useEffect, useState } from "react";
import { IoInformation } from "react-icons/io5";
import ISillaType from "../Types/ISillaType";
import IPasajeComplete from "../Types/IPasajeComplete";
import PasajeroCard from "./PasajeroCard";
import IPrecio from "@/Pages/Publico/PassagensList/Types/IPrecio";
import PrecioEditComponent from "./PrecioEditComponent";
interface Props {
    idPrecio: number | string
    setMostrarOptions: (value: boolean) => void
}
const PasajerosListaEmpresaPage = ({ idPrecio, setMostrarOptions }: Props) => {
    const [sillas, setSillas] = useState<ISillaType[]>([])
    const [pisoModel, setPisoModel] = useState<IPiso | null>(null)
    const [precioModel, setPrecioModel] = useState<IPrecio | null>(null)
    const [pasajeros, setPasajeros] = useState<IPasajeComplete[]>([])
    const downloadPasaje = (id: string | number) => {
        http.get(`pasajes/${id}/download`, { responseType: 'blob' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            })
            .catch(() => console.error('Erro ao abrir o PDF...'));
    }

    useEffect(() => {
        http.get(`precios/${idPrecio}/vender`).then(({ data }) => {
            let posicionesString: string = data.piso.posicoesBloqueadas
            let posicionesBloqueadas: number[] = []
            if (posicionesString != '') {
                posicionesBloqueadas = posicionesString.split(',').map(numeroString => parseInt(numeroString))
            }
            console.log(data);

            data.piso.posicoesBloqueadas = posicionesBloqueadas
            setPisoModel(data.piso)
            setPrecioModel(data)
        })
        http.get(`pasajes/from/${idPrecio}`).then(({ data }) => {
            setPasajeros(data)
            if (data.length > 0)
                setMostrarOptions(false)
        })
    }, [idPrecio])

    useEffect(() => {
        if (!pisoModel) return
        if (!pisoModel.nLinhas || !pisoModel.nColunas) return;
        let SillasDisponibles: ISillaType[] = []
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
    const editPrecio = (valor: number) => {
        if (precioModel) {
            setPrecioModel({ ...precioModel, precio: valor })
        }
    }
    const [showEditComponent, setShowEditComponent] = useState(false)
    const [mostrarLista, setMostrarLista] = useState(true)
    const [aba, setAba] = useState(2)
    const [sillaElegido, setSillaElegido] = useState<ISillaType | null>(null)
    return (
        <div className="mt-3">
            <div className="bg-gray-700 text-white px-5 p-3 flex items-center justify-between">
                <p>Piso {pisoModel?.nPiso} Precio: {precioModel?.precio} Bs</p>
                <div className="flex items-center space-x-2">
                    {mostrarLista &&
                        <PrimaryButton
                            className="bg-yellow-400 rounded-none"
                            onClick={() => setShowEditComponent(true)}
                        >
                            editar
                        </PrimaryButton>
                    }
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
                        <PasajeroCard downloadPasaje={downloadPasaje} className="absolute z-30" silla={sillaElegido} setSillaElegido={setSillaElegido} />
                    }
                    {precioModel && showEditComponent &&
                        <div className="absolute inset-0 grid z-10 place-content-center">
                            <PrecioEditComponent
                                setShowForm={setShowEditComponent}
                                nPiso={precioModel.nPiso}
                                idPrecio={precioModel.id}
                                setPrecioProp={editPrecio}
                                precioProp={precioModel.precio}
                            />
                        </div>}
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
                                <div key={index} className={silla.numero != -1 ? "lg:rotate-90 bg-white relative w-12 h-12 grid place-content-center font-bold text-xl rounded border-2 border-gray-400" : ''}>
                                    {silla.numero != -1 && silla.numero}
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
                            {pasajeros.map(pasajero => (
                                <tr className="hover:bg-slate-100" key={pasajero.id}>
                                    <td className="pl-1.5 py-1.5">
                                        {pasajero.nSilla}
                                    </td>
                                    <td>{pasajero.carnet}</td>
                                    <td>{pasajero.nombre}</td>
                                    <td>
                                        {(new DataHora(pasajero.nascimento)).data.imprimir()}
                                    </td>
                                    <td>
                                        {pasajero.salida.ciudad} - {pasajero.salida.abreviacion}
                                    </td>
                                    <td>
                                        {pasajero.destino.ciudad} - {pasajero.destino.abreviacion}
                                    </td>
                                    <td className="text-center">
                                        <PrimaryButton className="rounded-none" onClick={() => downloadPasaje(pasajero.id)}>descargar pasaje</PrimaryButton>
                                    </td>
                                </tr>
                            ))}
                            {pasajeros.length == 0 &&
                                <tr>
                                    <td colSpan={7} className="py-1 text-center">
                                        No hay Pasajeros Registrados
                                    </td>
                                </tr>
                            }
                        </tbody>
                    </table>
                </section>
            </section>
        </div >
    )
}
export default PasajerosListaEmpresaPage