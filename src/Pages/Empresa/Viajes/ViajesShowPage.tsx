
import DataHora from "@/Classes/DataHora"
import PrimaryButton from "@/Components/PrimaryButton"
import IViaje from "@/Types/IViaje"
import IParada2 from "@/Types/IViaje/IParada2"
import http from "@/http"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import ParadaFormPage from "../Paradas/ParadaFormPage"
import IParadaForm from "./Types/IParadaForm"

interface IViajeExtends extends IViaje {
    paradas: IParada2[]
}

const ViajesShowPage = () => {
    const { id } = useParams()
    const [viaje, setViaje] = useState<IViajeExtends>()
    const [openFormCreate, setOpenFormCreate] = useState(false)

    useEffect(() => {
        if (id) {
            http.get<IViajeExtends>(`viajes/${id}`)
                .then(({ data }) => {
                    const viaje = data;
                    viaje.paradas = ordenarParadas(viaje.paradas);
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

    const addParada = (newParada: IParada2) => {
        if (viaje) {
            viaje.paradas.push(newParada);
            viaje.paradas = ordenarParadas(viaje.paradas);
            setViaje({ ...viaje });
        }
    };

    return (
        <div className="p-10">
            {viaje &&
                <>
                    <div className="mt-5 flex items-center justify-between px-5 py-2 bg-slate-700 text-white">
                        <h2>Paradas</h2>
                        <PrimaryButton onClick={() => setOpenFormCreate(true)}>+ Parada</PrimaryButton>
                        <div className={"absolute inset-0 grid place-content-center " + (openFormCreate && viaje.paradas.length >= 2 ? '' : 'hidden')}>
                            <ParadaFormPage validarParada={validarParada} idViaje={viaje.codigo} setOpenForm={setOpenFormCreate} addParada={addParada} />
                        </div>
                    </div>

                    <div className="py-5 bg-white">
                        <table className="w-full text-center">
                            <thead>
                                <tr>
                                    <th className="text-start pl-5">Ciudad</th>
                                    <th>Plataforma</th>
                                    <th>Fecha y Hora</th>
                                    <th>Acciones</th>
                                </tr>
                            </thead>
                            <tbody>
                                {viaje.paradas.map(parada =>
                                    <tr className=" hover:bg-slate-300" key={parada.id}>
                                        <td className="pl-5 py-2 text-start">{parada.ciudad}, {parada.abreviacion} - {parada.lugar}</td>
                                        <td className="">{parada.plataforma}</td>
                                        <td className="">{new DataHora(parada.dataHora).imprimir()}</td>
                                        <td className="">
                                            <div className="space-x-1 text-white">
                                                <button disabled className="bg-yellow-400 rounded p-1.5 px-3 uppercase">
                                                    Editar
                                                </button>
                                                <button disabled className="bg-red-500 rounded p-1.5 px-3 uppercase">
                                                    Eliminar
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                )}
                            </tbody>
                        </table>
                    </div>
                </>
            }
        </div>
    )
}

export default ViajesShowPage;
