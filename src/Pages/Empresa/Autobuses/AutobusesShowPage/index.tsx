import PrimaryButton from "@/Components/PrimaryButton"
import { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import IAutobusExtends from "./Types/IAutobusExtends"
import IViajeEmpresa from "../../Types/IViajeEmpresa"
import InputRelatorioComponent from "./Components/InputRelatorioComponent"
import DataHora from "@/Classes/DataHora"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import AutobusModelShowPage from "./Components/AutobusModelShowPage"
import http from "@/http"
import AutobusEditComponent from "./Components/AutobusEditComponent"
import GetUserType from "@/Helpers/GetUserType"
import TdComponent from "@/Components/Table/TdComponent"
import ThComponent from "@/Components/Table/ThComponent"
import TableComponent from "@/Components/Table/TableComponent"
import { FaBars } from "react-icons/fa"
import ButtonOptionsMenu from "@/Components/ButtonOptionsMenu"

const AutobusesShowPage = () => {
    const path = '/empresa'

    const { id } = useParams()
    const navigate = useNavigate()

    const [autobus, setAutobus] = useState<IAutobusExtends | null>(null)
    const [viajes, setViajes] = useState<IViajeEmpresa[]>([])

    const showViaje = (id: string) => navigate(path + '/viajes/' + id)

    const [showModel, setShowModel] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const eliminarAutobus = () => {
        if (id) {
            http.delete(`autobuses/${id}`)
                .then(() => navigate(-1))
                .catch((erro) => {
                    if (erro.response.data.conteudo)
                        alert(erro.response.data.conteudo);
                    else
                        alert("Hubo un error en el processo")
                })
        }
    }
    const editarAutobus = (valor: string) => {
        if (autobus) {
            setAutobus({ ...autobus, placa: valor });
        }
    };


    return (
        <div className="mx-auto max-w-7xl py-10">
            {autobus && <>
                <div className="w-full px-5 py-3 text-white font-semibold flex justify-between items-center">
                    <p className="text-2xl pb-3">Lista de Viajes del autobus {autobus.placa}</p>
                    <ButtonOptionsMenu
                        children={<FaBars className="h-5" />}
                        optionsMenu={<>
                            {GetUserType() === "ROLE_EMPRESA_ADMIN" &&
                                <>
                                    <PrimaryButton className="bg-yellow-500 rounded-none" onClick={() => setShowEditForm(true)}>editar</PrimaryButton>
                                    <PrimaryButton className="bg-red-500 rounded-none" onClick={eliminarAutobus}>eliminar</PrimaryButton>
                                </>
                            }
                            <PrimaryButton className={showModel ? "rounded-none bg-blue-900" : "rounded-none"} onClick={() => setShowModel(!showModel)}>ver modelo</PrimaryButton>
                            <PrimaryButton className="rounded-none" onClick={() => navigate('viaje/create')}> nuevo viaje</PrimaryButton>
                        </>}
                    />
                </div>
                {showEditForm && <div className="absolute inset-0 z-20 grid place-content-center">
                    <AutobusEditComponent
                        idAutobus={id!}
                        setShowForm={setShowEditForm}
                        placaProp={autobus.placa}
                        setPlacaProp={editarAutobus}
                    />
                </div>}
            </>}
            <div hidden={!showModel} className="bg-white p-5">
                <div className="ml-4">
                    Modelo
                </div>
                {autobus && <AutobusModelShowPage autobus={autobus} />}
            </div>

            <TableComponent
                header={
                    <InputRelatorioComponent idAutobus={id} viajes={viajes} setViajes={setViajes} setAutobus={setAutobus} />
                }
                thead={
                    <>
                        <ThComponent text="Salida" />
                        <ThComponent text="Destino" />
                        <ThComponent text="Saldo en Efectivo" />
                        <ThComponent text="" />
                    </>
                }
                tbody={<>
                    {viajes.map((viaje, index) =>
                        <tr key={viaje.id} className={`${(index % 2 ? "" : "bg-gray-100")} hover:bg-slate-200`}>
                            <TdComponent>
                                {capitalizeFirstLetter(viaje.salida.ciudad) + ", " + viaje.salida.abreviacion} - {new DataHora(viaje.salida.dataHora).imprimir()}
                            </TdComponent>
                            <TdComponent>
                                {capitalizeFirstLetter(viaje.destino.ciudad) + ", " + viaje.destino.abreviacion} - {new DataHora(viaje.destino.dataHora).imprimir()}
                            </TdComponent>
                            <TdComponent>
                                Bs {viaje.valorArrecadadoEfectivo} - En desarrollo
                            </TdComponent>
                            <TdComponent className="text-right">
                                <PrimaryButton className="rounded-none" onClick={() => showViaje(viaje.id)}>ver mais</PrimaryButton>
                            </TdComponent>
                        </tr>
                    )}
                    {viajes.length == 0 &&
                        <tr>
                            <td colSpan={5} className="py-2 text-center font-semibold">
                                No hay Viajes Registrados
                            </td>
                        </tr>
                    }
                </>}
            />
        </div >
    )
}


export default AutobusesShowPage