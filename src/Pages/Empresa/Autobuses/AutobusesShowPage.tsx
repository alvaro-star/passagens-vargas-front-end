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

    const parametros = useParams()
    const navigate = useNavigate()

    const [autobus, setAutobus] = useState<IAutobus | null>(null)
    const [viajes, setViajes] = useState<IViaje[]>([])
    const [pisos, setPisos] = useState<IPiso[]>([])
    const [openForm, setOpenForm] = useState(false)

    const showtrayecto = (id: string) => navigate(path + '/viajes/' + id)

    const criarViaje = (viaje: IViaje) => {
        setViajes([...viajes, viaje])
        setOpenForm(false)
    }

    useEffect(() => {
        if (parametros.id) {
            http.get<IAutobusExtend>(`autobuses/${parametros.id}`)
                .then(resposta => {
                    setAutobus(resposta.data)
                    setPisos(resposta.data.pisos)
                    setViajes(resposta.data.viajes)
                })
        } else navigate(`/`)
    }, [parametros])

    return (
        <div className="p-10">

            {autobus &&
                <>
                    {openForm &&
                        <div className="absolute top-0 bottom-0 left-0 right-0 grid place-content-center m-0 bg-white bg-opacity-50">
                            <ViajesFormPage setOpenForm={setOpenForm} addViaje={criarViaje} idAutobus={autobus.id} nPisos={pisos.length} />
                        </div>
                    }
                    <div className="w-full rounded-lg p-5 bg-slate-500 text-white font-semibold text-xl flex justify-between items-center">
                        <p>{autobus.placa}</p>
                        <div className="space-x-4 flex items-center">
                            <PrimaryButton>ver modelo</PrimaryButton>
                            <PrimaryButton onClick={() => { setOpenForm(true) }}> criar viaje</PrimaryButton>
                        </div>
                    </div>
                    <div className="mt-5 space-y-3">
                        {viajes.map(viaje =>
                            <div className="px-5 py-3 bg-gray-300 rounded flex items-center justify-between" key={viaje.codigo}>
                                <p className="font-mono">
                                    {viaje.codigo}
                                </p>
                                <PrimaryButton onClick={() => showtrayecto(viaje.codigo)} className="bg-blue-500">Ver viaje</PrimaryButton>
                            </div>
                        )}
                    </div>
                </>
            }
        </div >
    )
}


export default AutobusesShowPage