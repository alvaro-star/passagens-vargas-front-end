
import DataHora from "@/Classes/DataHora"
import PrimaryButton from "@/Components/PrimaryButton"
import IParada2 from "@/Types/IViaje/IParada2"
import http from "@/http"
import { useEffect, useState } from "react"
import { Link, useParams } from "react-router-dom"
import ParadaFormPage from "../../Paradas/ParadaFormPage"
import IParadaForm from "../Types/IParadaForm"
import IPrecio2 from "@/Types/IViaje/IPrecio2"
import PasajerosListaEmpresaPage from "./Components/PasajerosListaEmpresaPage"


interface IViajeExtends {
    codigo: string
    idAutobus: number
    valorArrecadadoEfectivo: number
    valorArrecadadoWeb: number
    isCobrado: boolean
    precios: IPrecio2[]
    paradas: IParada2[]
}


const ViajesShowPage = () => {
    const { id } = useParams()
    const [viaje, setViaje] = useState<IViajeExtends>()
    const [openFormCreate, setOpenFormCreate] = useState(false)
    const [mostrarOptions, setMostrarOptions] = useState(true)

    useEffect(() => {
        if (id) {
            http.get<IViajeExtends>(`viajes/${id}`)
                .then(({ data }) => {
                    console.log(data);

                    const viaje = data;
                    viaje.paradas = ordenarParadas(viaje.paradas);
                    let dataAtual = new Date().getTime()
                    let dataViaje = new Date(viaje.paradas[viaje.paradas.length - 1].dataHora).getTime()
                    if (dataViaje <= dataAtual) {
                        setMostrarOptions(false)
                    } else {
                        setMostrarOptions(true)
                    }
                    setViaje(viaje);
                });
        }
    }, [id]);

    const validarParada = (newParada: IParadaForm) => {
        if (viaje && viaje.paradas.length >= 2) {
            const dataHoraInicio = new Date(viaje.paradas[0].dataHora);
            const ultimoIndice = viaje.paradas.length - 1;
            const dataHoraFim = new Date(viaje.paradas[ultimoIndice].dataHora);
            const dataHoraNovaParada = new Date(newParada.dataHora);
            return dataHoraInicio < dataHoraNovaParada && dataHoraNovaParada < dataHoraFim;
        }
        return false;
    };

    const ordenarParadas = (paradas: IParada2[]) => {
        if (paradas.length > 0) {
            return [...paradas].sort((a: IParada2, b: IParada2) => new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime());
        } else {
            return [];
        }
    };

    const eliminarParada = (idParada: number) => {
        http.delete("paradas/" + idParada)
            .then(() => {
                if (viaje) {
                    let viajeParadas = viaje.paradas.filter(elemento => elemento.id != idParada)
                    viaje.paradas = viajeParadas
                    setViaje({
                        ...viaje, paradas: viajeParadas
                    });
                }
            })
            .catch(erro => {
                console.log(erro);
                alert(erro.response.data.conteudo)
            })
    }

    const addParada = (newParada: IParada2) => {
        if (viaje) {
            viaje.paradas.push(newParada);
            viaje.paradas = ordenarParadas(viaje.paradas);
            setViaje({ ...viaje });
        }
    };
    const [mostrarParadas, setMostrarParadas] = useState(false)
    return (
        <div className="p-10">
            <h2 className="text-2xl font-semibold">
                Datos del Viaje
            </h2>
            {viaje && <>
                <div className="mt-5 flex items-center justify-between px-5 py-3 bg-slate-700 text-white">
                    <h2>Paradas</h2>
                    <div className="flex items-center space-x-2">
                        <p>
                            Mostrar Lista
                        </p>
                        <input checked={mostrarParadas} onChange={() => setMostrarParadas(!mostrarParadas)} type="checkbox" className="rounded" />
                    </div>
                </div>

                <div hidden={!mostrarParadas} className="py-5 bg-white">
                    <table className="w-full text-center">
                        <thead>
                            <tr>
                                <th className="text-start pl-5">Ciudad</th>
                                <th>Plataforma</th>
                                <th>Fecha y Hora</th>
                                {mostrarOptions && <th>Acciones</th>}

                            </tr>
                        </thead>
                        <tbody>
                            {viaje.paradas.map(parada =>
                                <tr className=" hover:bg-slate-300" key={parada.id}>
                                    <td className="pl-5 py-2 text-start">{parada.ciudad}, {parada.abreviacion} - {parada.lugar}</td>
                                    <td className="">{parada.plataforma}</td>
                                    <td className="">{new DataHora(parada.dataHora).imprimir()}</td>
                                    {mostrarOptions &&
                                        <td className="">
                                            <div className="text-white flex items-center justify-center">
                                                <Link to={"/empresa/paradas/" + parada.id + "/edit"} className="bg-yellow-400 p-1.5 px-3 uppercase">
                                                    Editar
                                                </Link>
                                                <button onClick={() => eliminarParada(parada.id)} className="bg-red-500 p-1.5 px-3 uppercase">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    }
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div className="pt-2 text-center">
                        <PrimaryButton className="rounded-none" onClick={() => setOpenFormCreate(true)}>registrar una parada</PrimaryButton>
                    </div>
                    <div className={"absolute inset-0 mt-36 " + (openFormCreate && viaje.paradas.length >= 2 ? '' : 'hidden')}>
                        <ParadaFormPage validarParada={validarParada} idViaje={viaje.codigo} setOpenForm={setOpenFormCreate} addParada={addParada} />
                    </div>
                </div>
                <div className="">
                    {viaje.precios.length == 0
                        ? <div>Carregando</div>
                        : viaje.precios.map(precioItem =>
                            <PasajerosListaEmpresaPage idPrecio={precioItem.id} key={precioItem.id} />
                        )
                    }
                </div>
            </>}
        </div>
    )
}

export default ViajesShowPage;
