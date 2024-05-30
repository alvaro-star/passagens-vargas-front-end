import PrimaryButton from "@/Components/PrimaryButton"
import http from "@/http"
import IPage from "@/Types/IPage/index"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import IFuncionario from "../Types/IFuncionario"

const FuncionariosListPage = () => {
    const path = "/empresa/admin/funcionarios"
    const navigate = useNavigate()
    const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([])
    const idEmpresa = sessionStorage.getItem("idEmpresa")
    const [nextPage, setNextPage] = useState<number | null>(null)
    useEffect(() => {
        http.get<IPage<IFuncionario>>("funcionarios/" + idEmpresa)
            .then(resposta => {
                setFuncionarios(resposta.data.content)
                if (resposta.data.totalPages > 1) {
                    setNextPage(1)
                } else {
                    setNextPage(null)
                }
            })
    }, [])

    const verMais = () => {
        if (nextPage != null) {
            http.get<IPage<IFuncionario>>("funcionarios/" + idEmpresa + `?page=${nextPage}`)
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

    const eliminar = (email: string) => {
        const idEmpresa = sessionStorage.getItem("idEmpresa")
        http.delete("funcionarios/" + idEmpresa + "/" + email)
            .then(() => {
                const updateFuncionarios = [...funcionarios]
                const indexToRemove = updateFuncionarios.findIndex(funcionario => funcionario.login === email);
                updateFuncionarios.splice(indexToRemove, 1)
                setFuncionarios(updateFuncionarios)
            })
            .catch(erro => {
                if (erro.response.data.conteudo) {
                    alert(erro.response.data.conteudo)
                } else {
                    alert("Hubo un error en el envio")
                }
            })
    }
    return (
        <div className="py-10 max-w-7xl mx-auto">
            <div className="p-5 bg-slate-700 text-white flex items-center justify-between">
                <h1 className="font-bold text-xl">Lista de Funcionarios dela Empresa</h1>
                <PrimaryButton onClick={() => navigate(path + "/create")}>+ Funcionario</PrimaryButton>
            </div>
            <div className="p-5 bg-white">
                <table className="w-full ">
                    <thead>
                        <tr className="">
                            <th className="font-semibold text-start">Nombre</th>
                            <th className="font-semibold text-start">E-mail</th>
                            <th className="font-semibold text-start">Telefono</th>
                            <th className="font-semibold text-center w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {funcionarios.map(funcionario =>
                            <tr key={funcionario.login}>
                                <td className="py-1.5">{funcionario.nombre}</td>
                                <td>{funcionario.login}</td>
                                <td>{funcionario.telefono}</td>
                                <td className="text-center">
                                    <PrimaryButton
                                        className="bg-red-500 rounded-none hover:bg-red-600"
                                        onClick={() => eliminar(funcionario.login)}
                                    >
                                        Despedir
                                    </PrimaryButton>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                <div className="w-full text-center mt-2">
                    {
                        nextPage != null && <PrimaryButton onClick={verMais} className="bg-blue-500 rounded-none hover:bg-blue-600">Ver Mas</PrimaryButton>
                    }
                </div>
            </div>
        </div>
    )
}


export default FuncionariosListPage