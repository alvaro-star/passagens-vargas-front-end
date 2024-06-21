import PrimaryButton from "@/Components/PrimaryButton"
import IAutobus from "@/Types/IAutobus"
import IPiso from "@/Types/IPiso"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ViajesFormPage from "../Viajes/ViajesFormPage"
import IViaje from "@/Types/IViaje"

interface IAutobusExtend extends IAutobus {
    pisos: IPiso[],
    viajes: IViaje[]
}

const AutobusesShowPage = () => {
    const path = '/empresa'

    const { id } = useParams()
    const navigate = useNavigate()

    const [autobus, setAutobus] = useState<IAutobusExtend | null>(null)
    const [openForm, setOpenForm] = useState(false)

    const showViaje = (id: string) => navigate(path + '/viajes/' + id)

    const criarViaje = (viaje: IViaje) => {
        setAutobus(prevAutobus => ({
            ...prevAutobus!,
            viajes: [...prevAutobus!.viajes, viaje]
        }));
        setOpenForm(false);
    };

    useEffect(() => {
        if (id) {
            http.get<IAutobusExtend>(`autobuses/${id}`)
                .then(resposta => {
                    setAutobus(resposta.data)
                })
        } else navigate(`/`)
    }, [id, navigate])

    return (
        <div className="mx-auto max-w-7xl py-10">
            {autobus &&
                <>
                    {openForm &&
                        <div className="absolute top-0 bottom-0 left-0 right-0 grid place-content-center m-0 bg-white bg-opacity-50">
                            <ViajesFormPage setOpenForm={setOpenForm} addViaje={criarViaje} idAutobus={autobus.id} nPisos={autobus.pisos.length} />
                        </div>
                    }
                    <div className="w-full p-5 bg-slate-700 text-white font-semibold text-xl flex justify-between items-center">
                        <p>Lista de viajes del autobus {autobus.placa}</p>
                        <div className="space-x-4 flex items-center">
                            <PrimaryButton className="hidden">ver modelo</PrimaryButton>
                            <PrimaryButton onClick={() => { setOpenForm(true) }}> registrar un viaje</PrimaryButton>
                        </div>
                    </div>
                    <div className="space-y-3 bg-white py-3">
                        {autobus.viajes.map(viaje =>
                            <div className="px-5 flex items-center justify-between" key={viaje.codigo}>
                                <p className="font-mono">{viaje.codigo}</p>
                                <p>Dinero Arrecadado en Efectivo Bs {viaje.valorArrecadadoEfectivo}</p>
                                <p>Dinero disponible en la Web: Bs {viaje.valorArrecadadoWeb}</p>
                                <PrimaryButton onClick={() => showViaje(viaje.codigo)} className="bg-blue-500 rounded-none">Ver viaje</PrimaryButton>
                            </div>
                        )}
                        {autobus.viajes.length == 0 &&
                            <div className="px-5 py-3 bg-gray-300 flex items-center justify-between">
                                No hay Viajes Registrados
                            </div>
                        }
                    </div>
                </>
            }
        </div >
    )
}


export default AutobusesShowPage