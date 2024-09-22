import { useEffect, useState } from "react"
import IPage from "@/Types/IPage"
import http from "@/http"
import PrimaryButton from "@/Components/PrimaryButton"
import { useNavigate } from "react-router-dom"
import TdComponent from "@/Components/Table/TdComponent"
import ThComponent from "@/Components/Table/ThComponent"
import TableComponent from "@/Components/Table/TableComponent"
import PrimaryButtonEmpresa from "@/Components/PrimaryButtonEmpresa"

interface IAutobus {
    id: number,
    placa: string,
    enabled: boolean,
    valorViajesEfectivo: number
    valorViajesWeb: number
    idEmpresa: string
    valorViajes: number
}

const AutobusesIndexPage = () => {
    const pathFuncionario = '/empresa/autobuses'
    const tipoUsuario = sessionStorage.getItem("role")
    const navigate = useNavigate()
    const idEmpresa = sessionStorage.getItem('idEmpresa')
    const [autobuses, setAutobuses] = useState<IAutobus[]>([])
    const [nextPage, setNextPage] = useState<number | null>(null)

    const create = () => navigate('/empresa/admin/autobuses/create')
    const verViajes = (idAutobus: number) => navigate(pathFuncionario + '/' + idAutobus)

    useEffect(() => {
        if (!idEmpresa) return;
        const fetchData = async () => {
            const [autobusesResposta] = await Promise.all([
                http.get<IPage<IAutobus>>(`autobuses/from/${idEmpresa}`)
            ]);
            setAutobuses(autobusesResposta.data.content);
            if (autobusesResposta.data.totalPages > 1) {
                setNextPage(1)
            } else {
                setNextPage(null)
            }
        }

        fetchData();
    }, [idEmpresa]);

    const verMais = () => {
        if (nextPage != null) {
            http.get<IPage<IAutobus>>(`autobuses/from/${idEmpresa}?page=${nextPage}`)
                .then(resposta => {
                    setAutobuses(autobuses.concat(resposta.data.content))
                    if (resposta.data.totalPages <= resposta.data.pageable.pageNumber + 1) {
                        setNextPage(null)
                    } else {
                        setNextPage(resposta.data.pageable.pageNumber + 1)
                    }

                })
        }
    }
    return (<>
        <div className="pt-10 pb-5 max-w-7xl mx-auto">
            <div className="px-5 text-white flex items-center justify-between">
                <div className="flex items-center">
                    <p className="text-2xl ml-2 font-semibold w-full">
                        Lista de autobuses
                    </p>
                </div>
                {tipoUsuario === "ROLE_EMPRESA_ADMIN" &&
                    <PrimaryButtonEmpresa onClick={create} className="">registrar un Autobus</PrimaryButtonEmpresa>
                }
            </div>
        </div>
        <TableComponent
            header={<div className="flex items-center justify-between py-2">
                <p>Autobuses</p>
                {nextPage != null &&
                    <div className="w-full text-center mt-2">
                        <PrimaryButton onClick={verMais} className="rounded-none bg-blue-500 hover:bg-blue-600">Ver Mas</PrimaryButton>
                    </div>
                }
            </div>}
            thead={<>
                <ThComponent text="Placa" />
                <ThComponent text="" />
            </>}
            tbody={<>
                {autobuses.map(autobus =>
                    <tr key={autobus.id}>
                        <TdComponent>
                            {autobus.placa}
                        </TdComponent>
                        <TdComponent className="text-right">
                            <PrimaryButton disabled={!autobus.enabled} onClick={() => verViajes(autobus.id)} className="bg-blue-500 rounded-none">Ver viajes</PrimaryButton>
                        </TdComponent>
                    </tr>
                )}
            </>}
        />
    </>
    )
}


export default AutobusesIndexPage