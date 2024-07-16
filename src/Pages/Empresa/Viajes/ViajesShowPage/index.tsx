import IParada2 from "@/Types/IViaje/IParada2"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ParadaFormPage from "../../Paradas/ParadaFormPage"
import IParadaForm from "../Types/IParadaForm"
import IPrecio2 from "@/Types/IViaje/IPrecio2"
import PasajerosListaEmpresaPage from "./Components/PasajerosListaEmpresaPage"
import ParadasTableComponent from "./Components/ParadasTableComponent"
import PrimaryButton from "@/Components/PrimaryButton"


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
    const navigate = useNavigate()
    const [viaje, setViaje] = useState<IViajeExtends>()
    const [openFormCreate, setOpenFormCreate] = useState(false)
    const [mostrarOptions, setMostrarOptions] = useState(true)

    useEffect(() => {
        if (id) {
            http.get<IViajeExtends>(`viajes/${id}`)
                .then(({ data }) => {
                    console.log(data);

                    const viajeApi = data;
                    viajeApi.paradas = ordenarParadas(viajeApi.paradas);
                    let dataAtual = new Date().getTime()
                    let dataViaje = new Date(viajeApi.paradas[viajeApi.paradas.length - 1].dataHora).getTime()
                    if (dataViaje <= dataAtual) {
                        setMostrarOptions(false)
                    } else {
                        setMostrarOptions(true)
                    }
                    setViaje(viajeApi);
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
            return [...paradas].sort((a: IParada2, b: IParada2) =>
                new Date(a.dataHora).getTime() - new Date(b.dataHora).getTime()
            );
        } else return [];

    };

    const eliminarParada = (idParada: number) => {
        if (viaje) {
            http.delete(`paradas/${idParada}`)
                .then(() => {
                    const viajeParadas = viaje.paradas.filter((elemento) => elemento.id !== idParada);
                    setViaje({ ...viaje, paradas: viajeParadas });
                })
                .catch((erro) => {
                    if (erro.response?.data?.conteudo) {
                        alert(erro.response.data.conteudo);
                    } else {
                        alert("No se puede eliminar esta parada");
                    }
                });
        }
    };
    const addParada = (newParada: IParada2) => {
        if (viaje) {
            const updatedParadas = [...viaje.paradas, newParada];
            setViaje({ ...viaje, paradas: ordenarParadas(updatedParadas) });
        }
    };

    const eliminarViaje = () => {
        http.delete(`empresa/viajes/${id}`).then(() => navigate(-1))
            .catch(erro => {
                console.log(erro);
                if (erro.response.data.conteudo)
                    alert(erro.response.data.conteudo)
                else
                    alert("Hubo un error en el processo, notifique ala empresa...")

            })
    }

    const [mostrarParadas, setMostrarParadas] = useState(false)
    return (
        <div className="p-10">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-semibold">
                    Datos del Viaje
                </h2>
                <div>
                    <PrimaryButton
                        onClick={() => eliminarViaje()}
                        className="bg-red-500 rounded-none"
                    >
                        ELIMINAR
                    </PrimaryButton>
                </div>
            </div>
            {viaje && <>
                <div className="mt-5 flex items-center justify-between px-5 py-3 bg-slate-700 text-white">
                    <h2>Paradas</h2>
                    <div className="flex items-center space-x-2">
                        <p>Mostrar Lista</p>
                        <input checked={mostrarParadas} onChange={() => setMostrarParadas(!mostrarParadas)} type="checkbox" className="rounded" />
                    </div>
                </div>

                <ParadasTableComponent
                    mostrarParadas={mostrarParadas}
                    mostrarOptions={mostrarOptions}
                    paradas={viaje.paradas}
                    eliminarParada={eliminarParada}
                    setOpenFormCreate={setOpenFormCreate}
                />
                <div className={"absolute inset-0 mt-36 " + (openFormCreate && viaje.paradas.length >= 2 ? '' : 'hidden')}>
                    <ParadaFormPage validarParada={validarParada} idViaje={viaje.codigo} setOpenForm={setOpenFormCreate} addParada={addParada} />
                </div>
                <div className="">
                    {viaje.precios.length == 0
                        ? <div>Carregando</div>
                        : viaje.precios.map(precioItem =>
                            <PasajerosListaEmpresaPage setMostrarOptions={setMostrarOptions} idPrecio={precioItem.id} key={precioItem.id} />
                        )
                    }
                </div>
            </>}
        </div>
    )
}

export default ViajesShowPage;
