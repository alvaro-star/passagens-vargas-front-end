import PrimaryButton from "@/Components/Buttons/PrimaryButton"
import PrimaryButtonEmpresa from "@/Components/Buttons/PrimaryButtonEmpresa"
import http from "@/http"
import IPage from "@/Types/IPage/index"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import IFuncionario from "../Types/IFuncionario"
import TdComponent from "@/Components/Table/TdComponent"
import ThComponent from "@/Components/Table/ThComponent"
import TableComponent from "@/Components/Table/TableComponent"
import ContainerShowTemplate from "@/Pages/Layout/ContainerShowTemplate"
import CookieEmpresaId from "@/Helpers/CookieGenerate/CookieEmpresaId"

const FuncionariosListPage = () => {
    const path = "/empresa/admin/funcionarios"
    const navigate = useNavigate()
    const [funcionarios, setFuncionarios] = useState<IFuncionario[]>([])
    const idEmpresa = CookieEmpresaId.get()
    const [nextPage, setNextPage] = useState<number | null>(null)
    useEffect(() => {
        http.get<IPage<IFuncionario>>("funcionarios/" + idEmpresa)
            .then(({ data }) => {
                setFuncionarios(data.content)
                if (data.totalPages > 1) setNextPage(1)
                else setNextPage(null)
            })
    }, [])

    const verMais = () => {
        if (nextPage != null) {
            http.get<IPage<IFuncionario>>("funcionarios/" + idEmpresa + `?page=${nextPage}`)
                .then(({ data }) => {
                    setFuncionarios(funcionarios.concat(data.content))
                    if (data.totalPages <= data.pageable.pageNumber + 1)
                        setNextPage(null)
                    else setNextPage(data.pageable.pageNumber + 1)
                })
        }
    }

    const eliminar = (email: string) => {
        const idEmpresa = CookieEmpresaId.get()
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
        <ContainerShowTemplate header={<>
            <div className="md:text-white font-semibold text-2xl">
                <p>Lista de los funcionarios dela empresa</p>
            </div>
            <PrimaryButtonEmpresa onClick={() => navigate(path + "/create")}>Agregar un Funcionario</PrimaryButtonEmpresa>
        </>}>
            <TableComponent
                header={
                    <div className="py-2 flex items-center justify-between">
                        <p>Resultado dela busqueda</p>
                        {nextPage != null && <PrimaryButton onClick={verMais} className="bg-blue-500 rounded-none hover:bg-blue-600">Ver Mas</PrimaryButton>}
                    </div>}
                thead={<>
                    <ThComponent text="Salida" />
                    <ThComponent text="Destino" />
                    <ThComponent text="Pisos" />
                    <ThComponent text="" />
                </>}
                tbody={<>
                    {funcionarios.map((funcionario, index) =>
                        <tr key={funcionario.login} className={`${(index % 2 ? "" : "bg-gray-100")} hover:bg-slate-200`}>
                            <TdComponent>
                                {funcionario.nombre}
                            </TdComponent>
                            <TdComponent>
                                {funcionario.login}
                            </TdComponent>
                            <TdComponent>
                                {funcionario.telefono}
                            </TdComponent>
                            <TdComponent className="text-right">
                                <PrimaryButton
                                    className="bg-red-500 rounded-none hover:bg-red-600"
                                    onClick={() => eliminar(funcionario.login)}
                                >
                                    Despedir
                                </PrimaryButton>
                            </TdComponent>
                        </tr>
                    )}
                </>}
            />
        </ContainerShowTemplate >
    )
}


export default FuncionariosListPage