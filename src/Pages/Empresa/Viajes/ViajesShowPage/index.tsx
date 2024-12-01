import IParada2 from "@/Types/IViaje/IParada2"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ParadaFormPage from "../../Paradas/ParadaFormPage"
import IParadaForm from "../Types/IParadaForm"
import IPrecio2 from "@/Types/IViaje/IPrecio2"
import ParadasTableComponent from "./Components/ParadasTableComponent"
import PrimaryButton from "@/Components/Buttons/PrimaryButton"
import PrimaryButtonEmpresa from "@/Components/Buttons/PrimaryButtonEmpresa"
import AutobusCreateCopyComponent from "../../Autobuses/AutobusesShowPage/Components/AutobusCreateCopyComponent"
import { FaBars, FaMapMarkerAlt } from "react-icons/fa"
import ButtonOptionsMenu from "@/Components/ButtonOptionsMenu"
import PasajerosTable from "./Components/PasajerosTable"
import ContainerShowTemplate from "@/Pages/Layout/ContainerShowTemplate"


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
    const [showCreateCopyViaje, setShowCreateCopyViaje] = useState(false)

    useEffect(() => {
        if (id) {
            http.get<IViajeExtends>(`viajes/${id}`)
                .then(({ data }) => {
                    const viajeApi = data;
                    viajeApi.paradas = ordenarParadas(viajeApi.paradas);
                    let dataAtual = new Date().getTime()
                    let dataViaje = new Date(viajeApi.paradas[viajeApi.paradas.length - 1].dataHora).getTime()
                    if (dataViaje <= dataAtual) setMostrarOptions(false)
                    else setMostrarOptions(true)
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
                    } else alert("No se puede eliminar esta parada");
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
            .catch(({ response }) => {
                if (response.data.conteudo) alert(response.data.conteudo)
                else alert("Hubo un error en el processo, notifique ala empresa...")
            })
    }
    const downloadPasajesList = () => {
        http.get(`empresa/viajes/${id}/pdf`, { responseType: 'blob' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            })
            .catch(() => console.error('Erro ao abrir o PDF...'));
    }
    const [mostrarParadas, setMostrarParadas] = useState(false)
    return (
        <ContainerShowTemplate
            header={<>
                <h2 className="md:text-white text-2xl font-semibold">
                    Datos del Viaje
                </h2>
                <div className="space-x-3 relative flex items-center">
                    <PrimaryButtonEmpresa onClick={() => setMostrarParadas(true)} className="space-x-2">
                        <FaMapMarkerAlt />
                        <p>Paradas</p>
                    </PrimaryButtonEmpresa>
                    <div>
                        <ButtonOptionsMenu
                            children={<FaBars className="h-5" />}
                            optionsMenu={<>
                                <PrimaryButtonEmpresa className="rounded-none w-full" onClick={() => setShowCreateCopyViaje(true)}>
                                    duplicar viaje
                                </PrimaryButtonEmpresa>
                                <PrimaryButtonEmpresa className="rounded-none w-full" onClick={downloadPasajesList}>
                                    imprimir lista
                                </PrimaryButtonEmpresa>
                                {mostrarOptions &&
                                    <PrimaryButton
                                        onClick={() => eliminarViaje()} className="bg-red-500 rounded-none"
                                    >
                                        ELIMINAR viaje
                                    </PrimaryButton>
                                }
                            </>}
                        />
                    </div>
                    <div className="hidden absolute right-0">
                    </div>
                </div>
            </>}>
            <>
                {viaje && <>
                    {showCreateCopyViaje &&
                        <div className="absolute inset-0 z-20 grid place-content-center bg-white bg-opacity-60">
                            <AutobusCreateCopyComponent idViajeProp={viaje.codigo} setShowForm={setShowCreateCopyViaje} />
                        </div>
                    }
                    <div hidden={!mostrarParadas} className="absolute bg-slate-200 inset-0 pt-10 md:pt-20 z-50 bg-opacity-75">
                        <ParadasTableComponent
                            mostrarOptions={mostrarOptions}
                            closeModal={() => setMostrarParadas(false)}
                            paradas={viaje.paradas}
                            eliminarParada={eliminarParada}
                            setOpenFormCreate={setOpenFormCreate}
                        />
                    </div>
                    <div className={"absolute inset-0 mt-36 z-30 " + (openFormCreate && viaje.paradas.length >= 2 ? '' : 'hidden')}>
                        <ParadaFormPage validarParada={validarParada} idViaje={viaje.codigo} setOpenForm={setOpenFormCreate} addParada={addParada} />
                    </div>
                    <div className="">
                        {viaje.precios.length != 0 &&
                            <PasajerosTable
                                setMostrarOptions={setMostrarOptions}
                                idsPrecio={viaje.precios.map(item => item.id.toString())}
                            />
                        }
                    </div>
                </>}
            </>
        </ContainerShowTemplate>
    )
}

export default ViajesShowPage;
