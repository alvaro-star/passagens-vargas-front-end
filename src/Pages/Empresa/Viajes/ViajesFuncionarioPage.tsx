import DataHora from "@/Classes/DataHora"
import PrimaryButtonEmpresa from "@/Components/PrimaryButtonEmpresa"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import IPrecio2 from "@/Types/IViaje/IPrecio2"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import FormInlineTemplateFuncionario from "./Components/FormInlineTemplateFuncionario"
import IViaje from "./Types/IViajeIndex"
import TdComponent from "@/Components/Table/TdComponent"
import ThComponent from "@/Components/Table/ThComponent"
import TableComponent from "@/Components/Table/TableComponent"

const ViajesFuncionarioPage = () => {
    const timeBeforeMili = 2000
    const [viajes, setViajes] = useState<IViaje[]>([])
    const navigate = useNavigate()
    const ordenarPisos = (pisos: IPrecio2[]) => {
        switch (pisos.length) {
            case 1: return pisos
            case 2:
                let indicePrimerPiso = pisos[0].nPiso == 1 ? 0 : 1
                let indiceSegundoPiso = pisos[1].nPiso == 2 ? 1 : 0
                return [pisos[indicePrimerPiso], pisos[indiceSegundoPiso]]
            default: return []
        }
    }

    const selectViaje = (viaje: IViaje) => {
        if (new Date(viaje.salida.dataHora).getTime() < new Date().getTime() - timeBeforeMili)
            alert("El autobus ya partio")
        sessionStorage.setItem("viajeSelectFuncionario", JSON.stringify(viaje))
        navigate(viaje.id + "/vender")
    }

    return <div className="p-5 w-full">
        <div className="max-w-7xl mx-auto">
            <div className="md:text-white py-5 font-semibold text-2xl">
                Busque los viajes que necesite
            </div>
            <section>
                <FormInlineTemplateFuncionario setViajes={setViajes} />
            </section>
            <section className="bg-white mt-6 pt-5 rounded">
                <TableComponent
                    header={<div className="pb-2 -mt-2">Resultado dela busqueda</div>}
                    thead={<>
                        <ThComponent text="Salida" />
                        <ThComponent text="Destino" />
                        <ThComponent text="Pisos" />
                        <ThComponent text="" />
                    </>}
                    tbody={<>
                        {viajes.map(viaje =>
                            <tr key={viaje.id}>
                                <TdComponent>
                                    {capitalizeFirstLetter(viaje.salida.ciudad) + ", " + viaje.salida.abreviacion} - {new DataHora(viaje.salida.dataHora).imprimir()}
                                </TdComponent>
                                <TdComponent>
                                    {capitalizeFirstLetter(viaje.destino.ciudad) + ", " + viaje.destino.abreviacion} - {new DataHora(viaje.destino.dataHora).imprimir()}
                                </TdComponent>
                                <TdComponent>
                                    {ordenarPisos(viaje.precios).map(piso =>
                                        <p key={piso.id} className={piso.lleno ? "text-red-500" : "text-green-500"}>Piso {piso.nPiso} : Bs {piso.precio}</p>
                                    )}
                                </TdComponent>
                                <TdComponent className="text-right">
                                    {new Date(viaje.salida.dataHora) < (new Date())
                                        ? <PrimaryButtonEmpresa onClick={() => navigate("/empresa/viajes/" + viaje.id)} className="py-1.5 px-2 text-white bg-yellow-500">
                                            ver viaje
                                        </PrimaryButtonEmpresa>
                                        : <PrimaryButtonEmpresa disabled={new Date(viaje.salida.dataHora) < (new Date())} onClick={() => selectViaje(viaje)} className="py-1.5 px-2 text-white bg-green-700">
                                            vender
                                        </PrimaryButtonEmpresa>
                                    }
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
            </section>
        </div>
    </div>
}

export default ViajesFuncionarioPage