import PrimaryButton from "@/Components/PrimaryButton"
import IAutobus from "@/Types/IAutobus"
import IPiso from "@/Types/IPiso"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface ITrayecto {
    codigo: string
    idAutobus: number
}
interface IAutobusExtend extends IAutobus {
    pisos: IPiso[],
    trayectos: ITrayecto[]
}

const AutobusesShowPage = () => {
    const parametros = useParams()
    const [autobus, setAutobus] = useState<IAutobusExtend | null>(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (parametros.id) {
            http.get<IAutobusExtend>(`autobuses/${parametros.id}`)
                .then(resposta => setAutobus(resposta.data))
        } else navigate(`/`)
    }, [parametros])

    return (
        <div className="p-10">
            {autobus &&
                <>
                    <div className="w-full rounded-lg p-5 bg-slate-500 text-white font-semibold text-xl flex justify-between items-center">
                        <p>{autobus.placa}</p>
                        <div className="space-x-4 flex items-center">
                            <PrimaryButton disabled> ver modelo</PrimaryButton>
                            <PrimaryButton disabled> criar trayecto</PrimaryButton>
                        </div>
                    </div>
                    <div className="mt-5 space-y-3">
                        {autobus.trayectos.map(trayecto =>
                            <div className="px-5 py-3 bg-gray-300 rounded flex items-center justify-between">
                                <p className="font-mono">
                                    {trayecto.codigo}
                                </p>
                                <PrimaryButton>VER trayecto</PrimaryButton>
                            </div>
                        )}
                    </div>
                </>
            }
        </div>
    )
}


export default AutobusesShowPage