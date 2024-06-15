import PrimaryButton from "@/Components/PrimaryButton"
import IFuncionario from "@/Pages/Empresa/Types/IFuncionario"
import IPage from "@/Types/IPage"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


const AdminEmpresaShowPage = () => {
    const { id } = useParams()
    const navigate = useNavigate()
    const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([])
    const [nextPage, setNextPage] = useState<number | null>(null)
    useEffect(() => {
        http.get<IPage<IFuncionario>>("funcionarios/" + id)
            .then(resposta => {
                setFuncionarios(resposta.data.content)
                if (resposta.data.totalPages > 1) {
                    setNextPage(1)
                } else {
                    setNextPage(null)
                }
            })
    }, [id])

    const verMais = () => {
        if (nextPage != null) {
            http.get<IPage<IFuncionario>>("funcionarios/" + id + `?page=${nextPage}`)
                .then(resposta => {
                    setFuncionarios(funcionarios.concat(resposta.data.content))
                    if (resposta.data.totalPages <= resposta.data.pageable.pageNumber + 1) {
                        setNextPage(null)
                    } else {
                        setNextPage(resposta.data.pageable.pageNumber + 1)
                    }
                })
        }
    }
    const eliminarAdmin = (email: string) => {
        http.delete("empresas/admin/" + email)
            .then(() => {
                let funcionariosNovo = funcionarios.filter(funcionario => funcionario.login != email)
                setFuncionarios(funcionariosNovo)
            })
            .catch((erro) => {
                if (erro.response.data.conteudo) {
                    alert(erro.response.data.conteudo)
                } else {
                    console.log(erro.response.data.conteudo);
                    alert("Hubo un error en el processo")
                }
            })
    }
    const tornarAdmin = (email: string, indexFuncionario: number) => {
        http.post("empresas/admin", { idEmpresa: id, email: email })
            .then(() => {
                let funcionariosNovo = [...funcionarios]
                funcionariosNovo[indexFuncionario].cargo = "ROLE_EMPRESA_ADMIN"
                setFuncionarios(funcionariosNovo)
            })
            .catch((erro) => {
                if (erro.response.data.conteudo) {
                    alert(erro.response.data.conteudo)
                } else {
                    console.log(erro);
                    alert("Hubo un error en el processo")
                }
            })
    }

    return (
        <div className="py-10 max-w-7xl mx-auto">
            <div className="p-5 bg-slate-700 text-white flex items-center justify-between">
                <h1 className="font-bold text-xl">Lista de Funcionarios dela Empresa</h1>
                <PrimaryButton onClick={() => navigate("create")}>+ Administrador</PrimaryButton>
            </div>
            <div className="p-5 bg-white">
                <table className="w-full ">
                    <thead>
                        <tr className="">
                            <th className="font-semibold text-start">Nombre</th>
                            <th className="font-semibold text-start">Cargo</th>
                            <th className="font-semibold text-start">E-mail</th>
                            <th className="font-semibold text-start">Telefono</th>
                            <th className="font-semibold text-center w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {funcionarios.map((funcionario, indexFuncionario) =>
                            <tr key={funcionario.login}>
                                <td className="py-1.5">{funcionario.nombre}</td>
                                <td>{funcionario.login}</td>
                                <td>{funcionario.cargo == "ROLE_EMPRESA_ADMIN" ? "Admin" : "Funcionario"}</td>
                                <td>{funcionario.telefono}</td>
                                <td className="text-center">
                                    <div className="flex items-center space-x-1">
                                        {funcionario.cargo === "ROLE_EMPRESA_ADMIN"
                                            ? <PrimaryButton
                                                className="bg-red-500 text-nowrap rounded-none hover:bg-green-600"
                                                onClick={() => eliminarAdmin(funcionario.login)}>
                                                Turn off Admin
                                            </PrimaryButton>
                                            : <PrimaryButton
                                                className="bg-green-500 text-nowrap rounded-none hover:bg-green-600"
                                                onClick={() => tornarAdmin(funcionario.login, indexFuncionario)}>
                                                Turn on Admin
                                            </PrimaryButton>
                                        }
                                    </div>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="w-full text-center mt-2">
                    {nextPage != null && <PrimaryButton onClick={verMais} className="bg-blue-500 rounded-none hover:bg-blue-600">Ver Mas</PrimaryButton>}
                </div>
            </div>
        </div>
    )
}


export default AdminEmpresaShowPage