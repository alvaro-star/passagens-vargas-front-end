import IEmpresa from "@/Types/IEmpresa"
import IPage from "@/Types/IPage"
import http from "@/http"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"


const EmpresaIndexPage = () => {
    const [empresas, setEmpresas] = useState<IEmpresa[]>([])
    useEffect(() => {
        http.get<IPage<IEmpresa>>('/empresas')
            .then(resposta => {
                setEmpresas(resposta.data.content)
            })
    }, [])
    return (
        <div className="max-w-7xl mx-auto">
            <div className="">
                <div className="flex items-center justify-between p-5">
                    <h2 className="text-2xl font-semibold ">
                        Lista de empresas
                    </h2>
                    <Link to='/admin/empresas/create'
                        className="bg-gray-500 text-white p-2 rounded hover:bg-slate-500">
                        Criar Empresa
                    </Link>
                </div>
                <div className="w-full">
                    <table className="w-full text-center">
                        <thead>
                            <tr>
                                <th>Logo</th>
                                <th className="text-start">Nombre</th>
                                <th>NCuenta</th>
                                <th>Mai Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empresas.map(empresa =>
                                <tr key={empresa.id} className="bg-white rounded p-5">
                                    <td className="py-1.5">
                                        <img src={empresa.logo} alt="" className="h-10  mx-auto" />
                                    </td>
                                    <td className="text-start">{empresa.nombre}</td>
                                    <td>{empresa.numeroCuenta ? empresa.numeroCuenta : "nn"}</td>
                                    <td>
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                to={empresa.id}
                                                className="bg-gray-500 text-sm font-semibold text-white p-2 rounded"
                                            >
                                                VER MAS
                                            </Link>
                                            <button disabled
                                                className="bg-gray-500 text-sm font-semibold uppercase text-white p-2 rounded"
                                            >
                                                Assumir papel
                                            </button>
                                            <button disabled
                                                className="bg-gray-500 text-sm font-semibold uppercase text-white p-2 rounded"
                                            >
                                                ANULAR SUSCRIPCION
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    )
}

export default EmpresaIndexPage