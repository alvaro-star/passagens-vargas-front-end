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
        <div className="w-full bg-slate-100 p-5">
            <div className="">
                <div className="flex items-center justify-between">
                    <h2 className="text-2xl font-semibold ">
                        Lista de empresas
                    </h2>
                    <Link to='/admin/empresas/create'
                        className="bg-gray-500 text-white p-2 rounded hover:bg-slate-500">
                        Criar Empresa
                    </Link>
                </div>
                <div className="flex flex-col gap-5 mt-5">
                    <div className="bg-white rounded p-5 flex items-center justify-between">
                        <p>Logo</p>
                        <p> Nombre</p>
                        <p>NCuenta</p>
                        <p className="pr-3">Mai Info</p>
                    </div>
                    {empresas.map(empresa =>
                        <div key={empresa.id} className="bg-white rounded p-5 flex items-center justify-between">
                            <img src={empresa.logo} alt="" className="h-10 rounded-full" />
                            <h2 className="font-semibold text-lg">
                                {empresa.nombre}
                            </h2>
                            <h2>
                                {empresa.numeroCuenta}
                            </h2>
                            <Link
                                to={`/admin/empresas/${empresa.id}`}
                                className="bg-gray-500 text-white p-2 rounded"
                            >
                                VER MAS
                            </Link>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default EmpresaIndexPage