import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import PrimaryButton from "@/Components/PrimaryButton"
import IAutobus from "@/Types/IAutobus"
import IPage from "@/Types/IPage"
import IEmpresa from "@/Types/IEmpresa"
import http from "@/http"

const EmpresaShowPage = () => {
    const params = useParams()
    const [empresa, setEmpresa] = useState<IEmpresa>()
    const [autobuses, setAutobuses] = useState<IAutobus[]>([])
    useEffect(() => {
        http.get<IEmpresa>(`empresas/${params.id}`)
            .then(resposta => {
                setEmpresa(resposta.data)
            })
        http.get<IPage<IAutobus>>(`autobuses/from/${params.id}`)
            .then(resposta => setAutobuses(resposta.data.content))
    }, [])
    return (
        <div className="">
            <div className="m-10 p-5 bg-gray-400 text-white rounded flex items-center justify-between">
                <div className="flex items-center">
                    <img src={empresa?.logo} alt="logo da empresa" className="h-14 rounded-lg" />
                    <p className="text-xl ml-2 font-semibold w-full">
                        {empresa?.nombre}
                    </p>
                </div>
                <PrimaryButton>+ Autobus</PrimaryButton>
            </div>
            <div className="mx-10 grid gap-4">
                {autobuses.map(autobus =>
                    <div key={autobus.id} className="p-5 bg-white rounded-lg flex justify-between items-center">
                        {autobus.placa}
                        <PrimaryButton className="bg-blue-500">Ver</PrimaryButton>
                    </div>
                )}
            </div>
        </div>
    )
}

export default EmpresaShowPage