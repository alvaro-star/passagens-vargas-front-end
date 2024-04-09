import { useEffect, useState } from "react"
import http from "../../../http"
import IPage from "../../../Types/IPage"
import { Link } from "react-router-dom"

interface IAutobus {
    id: number
    placa: string,
    idEmpresa: string
}

const AutobusesIndexPage = (() => {

    const [autobuses, setAutobuses] = useState<IAutobus[]>([])

    useEffect(() => {
        http.get<IPage<IAutobus>>('autobuses')
            .then(resposta => {
                setAutobuses(resposta.data.content)
            })
    }, [])

    return (
        <div className="w-full p-5 grid place-content-center">
            <div className="p-5 bg-slate-100 rounded">
                <div className="w-full flex items-center justify-between">
                    <h2 className="font-semibold text-lg">
                        Empresas
                    </h2>
                    <Link to='/admin/autobuses/create' className="bg-gray-500 text-center p-2 rounded text-white">
                        Criar Autobus
                    </Link>
                </div>
                <table className="text-center mt-5">
                    <thead className="w-full">
                        <tr className="border border-black">
                            <th className="border-r border-black w-28">Placa</th>
                            <th className="">idEmpresa</th>
                            <th className="">Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {autobuses.map(autobus =>
                            <tr className="border border-black" key={autobus.id}>
                                <td className="border-r border-black">{autobus.placa}</td>
                                <td className="p-1 border-r border-black">{autobus.idEmpresa}</td>
                                <td className="p-1 border-r border-black bg-yellow-300 text-white ">EDITAR</td>
                                <td className="p-1  bg-red-500 text-white">EXCLUIR</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
})


export default AutobusesIndexPage