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

const AutobusesShowPage = () => {
    const path = '/empresa'

    const { id } = useParams()
    const navigate = useNavigate()

    const [autobus, setAutobus] = useState<IAutobusExtends | null>(null)
    const [viajes, setViajes] = useState<IViajeEmpresa[]>([])

    const showViaje = (id: string) => navigate(path + '/viajes/' + id)

    const [showModel, setShowModel] = useState(false)
    const [showEditForm, setShowEditForm] = useState(false)
    const [showOptionsExtras, setShowOptionsExtras] = useState(false)
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
                <div className="w-full px-5 py-3 bg-slate-700 text-white font-semibold flex justify-between items-center">
                    <p className="text-xl">Lista de viajes del autobus {autobus.placa}</p>
                    <div className="space-x-4">
                        <button className="p-1.5" onClick={()=> setShowOptionsExtras(!showOptionsExtras)}>
                            OPCIONES
                        </button>
                        <div hidden={!showOptionsExtras} className="relative">
                            <div className="absolute w-40 right-0 top-0 flex flex-col">
                                {GetUserType() === "ROLE_EMPRESA_ADMIN" &&
                                    <>
                                        <PrimaryButton className="bg-yellow-500 rounded-none" onClick={() => setShowEditForm(true)}>editar</PrimaryButton>
                                        <PrimaryButton className="bg-red-500 rounded-none" onClick={eliminarAutobus}>eliminar</PrimaryButton>
                                    </>
                                }
                                <PrimaryButton className={showModel ? "rounded-none bg-blue-900" : "rounded-none"} onClick={() => setShowModel(!showModel)}>ver modelo</PrimaryButton>
                                <PrimaryButton className="rounded-none" onClick={() => navigate('viaje/create')}> nuevo viaje</PrimaryButton>
                            </div>
                        </div>
                    </div>
                </div>
                {showEditForm && <div className="absolute inset-0 grid place-content-center">
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

            <InputRelatorioComponent idAutobus={id} viajes={viajes} setViajes={setViajes} setAutobus={setAutobus} />

            <div className="w-full px-5 py-2 bg-white">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-start">Origen</th>
                            <th className="text-start">Destino</th>
                            <th>Dinero en Efectivo</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody className="">
                        {viajes.map(viaje =>
                            <tr className="hover:bg-slate-200" key={viaje.id}>
                                <td className="py-2">{capitalizeFirstLetter(viaje.salida.ciudad)}, {viaje.salida.abreviacion} - {new DataHora(viaje.salida.dataHora).imprimir()}</td>
                                <td className="text-start">{capitalizeFirstLetter(viaje.destino.ciudad)}, {viaje.destino.abreviacion} - {new DataHora(viaje.destino.dataHora).imprimir()}</td>
                                <td className="text-center">Bs {viaje.valorArrecadadoEfectivo}</td>
                                <td className="text-center">
                                    <PrimaryButton onClick={() => showViaje(viaje.id)} className="bg-blue-500 rounded-none">Ver viaje</PrimaryButton>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
                {viajes.length == 0 &&
                    <div className="my-2 w-full px-5 py-2 bg-gray-300 text-center">
                        No hay Viajes Registrados
                    </div>
                }
            </div>

        </div >
    )
}


export default AutobusesShowPage