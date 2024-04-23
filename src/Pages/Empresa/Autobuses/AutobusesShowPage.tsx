import PrimaryButton from "@/Components/PrimaryButton"
import IAutobus from "@/Types/IAutobus"
import IPiso from "@/Types/IPiso"
import IVIaje from "@/Types/IViaje"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface IAutobusExtend extends IAutobus {
    pisos: IPiso[],
    viajes: IVIaje[]
}

const AutobusesShowPage = () => {
    const path = '/empresa/admin'

    const parametros = useParams()
    const navigate = useNavigate()
    const [autobus, setAutobus] = useState<IAutobusExtend | null>(null)
    const [openForm, setOpenForm] = useState(false)
    const showtrayecto = (id: string) => navigate(path + '/viajes/' + id)

    useEffect(() => {
        if (parametros.id) {
            http.get<IAutobusExtend>(`autobuses/${parametros.id}`)
                .then(resposta => {setAutobus(resposta.data)
                    console.log(resposta);
                })
        } else navigate(`/`)
    }, [parametros])

    return (
        <div className="p-10">

            {autobus &&
                <>
                    {openForm &&
                        <div className="absolute inset-0 m-0 grid place-content-center bg-white bg-opacity-50">
                            <div className="bg-white p-5 rounded">
                                Estas Seguro de criar un trayecto?
                                <div className="flex items-center justify-center gap-2 mt-2">
                                    <PrimaryButton className="bg-green-500">
                                        Si
                                    </PrimaryButton>
                                    <PrimaryButton className="bg-red-500" onClick={()=> setOpenForm(false)}>
                                        No
                                    </PrimaryButton>
                                </div>
                            </div>
                        </div>
                    }
                    <div className="w-full rounded-lg p-5 bg-slate-500 text-white font-semibold text-xl flex justify-between items-center">
                        <p>{autobus.placa}</p>
                        <div className="space-x-4 flex items-center">
                            <PrimaryButton disabled>ver modelo</PrimaryButton>
                            <PrimaryButton onClick={() => { setOpenForm(true) }}> criar viaje</PrimaryButton>
                        </div>
                    </div>
                    <div className="mt-5 space-y-3">
                        {autobus.viajes.map(viaje =>
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
        </div>
    )
}


export default AutobusesShowPage