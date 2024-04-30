import { useEffect, useState } from "react"
import IPage from "@/Types/IPage"
import http from "@/http"
import PrimaryButton from "@/Components/PrimaryButton"
import IEmpresa from "@/Types/IEmpresa"
import { useNavigate } from "react-router-dom"

interface IAutobus {
    id: number,
    placa: string,
    idEmpresa: string
    valorViajes: number
}

const AutobusesIndexPage = () => {
    const path = '/empresa/admin/autobuses'
    const navigate = useNavigate()
    const idEmpresa = sessionStorage.getItem('idEmpresa')
    const [empresa, setEmpresa] = useState<IEmpresa>()
    const [autobuses, setAutobuses] = useState<IAutobus[]>([])

    const create = () => navigate(path + '/create')
    const verTrayectos = (idAutobus: number) => navigate(path + '/' + idAutobus)

    useEffect(() => {
        http.get<IEmpresa>(`empresas/${idEmpresa}`)
            .then(resposta => {
                setEmpresa(resposta.data)
            })
        http.get<IPage<IAutobus>>(`autobuses/from/${idEmpresa}`)
            .then(resposta => {
                setAutobuses(resposta.data.content)
                console.log(resposta.data.content);
                
            })
    }, [])

    return (
        <>
            <div className="py-10">
                <div className="mx-10 mb-10 p-5 bg-gray-400 text-white rounded flex items-center justify-between">
                    <div className="flex items-center">
                        <img src={empresa?.logo} alt="logo da empresa" className="h-14 rounded-lg" />
                        <p className="text-xl ml-2 font-semibold w-full">
                            {empresa?.nombre}
                        </p>
                    </div>
                    <PrimaryButton onClick={create}>+ Autobus</PrimaryButton>
                </div>
                <div className="mx-10 grid gap-4">
                    {autobuses.map(autobus =>
                        <div key={autobus.id} className="p-5 bg-white rounded-lg flex justify-between items-center">
                            <p>Placa: {autobus.placa}</p>
                            <p>Valor: Bs {autobus.valorViajes} </p>
                            <PrimaryButton onClick={() => verTrayectos(autobus.id)} className="bg-blue-500">Ver viajes</PrimaryButton>
                        </div>
                    )}
                </div>
            </div>
        </>
    )
}


export default AutobusesIndexPage