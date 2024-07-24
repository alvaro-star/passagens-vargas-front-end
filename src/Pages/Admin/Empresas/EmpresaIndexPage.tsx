import IEmpresa from "@/Types/IEmpresa"
import IPage from "@/Types/IPage"
import http from "@/http"
import { useEffect, useState } from "react"
import { Link } from "react-router-dom"
import PrimaryButtonEmpresa from "@/Components/PrimaryButtonEmpresa"


const EmpresaIndexPage = () => {
    const [empresas, setEmpresas] = useState<IEmpresa[]>([])
    const [nextPage, setNextPage] = useState<number | null>(null)
    useEffect(() => {
        http.get<IPage<IEmpresa>>('/empresas')
            .then(({ data }) => {
                setEmpresas(data.content)
                if (data.totalPages > 1) setNextPage(1)
                else setNextPage(null)
            })
    }, [])

    const bloquearEmpresa = (idEmpresa: string) => {
        http.get(`empresas/${idEmpresa}/bloquedCount`)
            .then(() => {
                setEmpresas(prevEmpresas => {
                    return prevEmpresas.map(empresa => {
                        if (empresa.id === idEmpresa)
                            return { ...empresa, isBloqueado: !empresa.isBloqueado };
                        return empresa;
                    });
                });
                alert("El bloqueo fue exitoso")
            }).catch(({ response }) => {
                if (response.data.conteudo) alert(response.data.conteudo)
                else alert("Hubo un error inesperado...")
            })
    }

    const verMais = () => {
        if (nextPage) {
            http.get<IPage<IEmpresa>>(`/empresas?page=${nextPage}`)
                .then(({ data }) => {
                    setEmpresas(empresas.concat(data.content))
                    if (data.totalPages <= data.pageable.pageNumber + 1) {
                        setNextPage(null)
                    } else setNextPage(data.pageable.pageNumber + 1)
                })
        }
    }
    return (
        <div className="max-w-7xl mx-auto">
            <div className="">
                <div className="flex items-center justify-between p-5">
                    <h2 className="text-2xl font-semibold ">
                        Lista de empresas
                    </h2>
                    <Link to='/admin/empresas/create'
                        className="bg-gray-500 text-white p-2  hover:bg-slate-500">
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
                                <th>Habilitado</th>
                                <th>Bloqueado</th>
                                <th>Mai Info</th>
                            </tr>
                        </thead>
                        <tbody>
                            {empresas.map(empresa =>
                                <tr key={empresa.id} className="bg-white  p-5">
                                    <td className="py-1.5">
                                        <img src={empresa.logo} alt="" className="h-10  mx-auto" />
                                    </td>
                                    <td className="text-start">{empresa.nombre}</td>
                                    <td>{empresa.numeroCuenta ? empresa.numeroCuenta : "nn"}</td>
                                    <td>{empresa.isEnabled ? "SIM" : "NAO"}</td>
                                    <td>{empresa.isBloqueado ? "SIM" : "NAO"}</td>
                                    <td>
                                        <div className="flex items-center justify-center gap-2">
                                            <Link
                                                to={empresa.id}
                                                className="bg-gray-500 text-sm font-semibold text-white p-2 "
                                            >
                                                VER MAS
                                            </Link>
                                            <button disabled
                                                className="bg-gray-300 text-sm font-semibold uppercase text-white p-2 "
                                            >
                                                Assumir papel
                                            </button>
                                            <button
                                                className="bg-gray-500 text-sm font-semibold uppercase text-white p-2 "
                                                onClick={() => bloquearEmpresa(empresa.id)}
                                            >
                                                BLOQUEAR
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                    <div>
                        {nextPage != null && <PrimaryButtonEmpresa onClick={verMais}>
                            ver mas
                        </PrimaryButtonEmpresa>}
                    </div>
                </div>
            </div>
        </div>
    )
}

export default EmpresaIndexPage