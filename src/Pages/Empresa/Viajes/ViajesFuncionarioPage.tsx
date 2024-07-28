import DataHora from "@/Classes/DataHora"
import PrimaryButtonEmpresa from "@/Components/PrimaryButtonEmpresa"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import IPrecio2 from "@/Types/IViaje/IPrecio2"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import FormInlineTemplateFuncionario from "./Components/FormInlineTemplateFuncionario"
import IViaje from "./Types/IViajeIndex"

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
            alert("El viaje ya partio")
        sessionStorage.setItem("viajeSelectFuncionario", JSON.stringify(viaje))
        navigate(viaje.id + "/vender")
    }

    return <div className="p-5 w-full">
        <div className="max-w-7xl mx-auto">
            <section>
                <FormInlineTemplateFuncionario setViajes={setViajes} />
            </section>
            <section className="bg-white mt-6 py-5">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="pl-5 text-start">Salida</th>
                            <th className="text-start">Destino</th>
                            <th className="text-center">Pisos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viajes.map(viaje =>
                            <tr key={viaje.id} className="hover:bg-slate-100">
                                <td className="py-2 pl-5">
                                    {capitalizeFirstLetter(viaje.salida.ciudad)}, {viaje.salida.abreviacion} - {new DataHora(viaje.salida.dataHora).imprimir()}
                                </td>
                                <td>
                                    {capitalizeFirstLetter(viaje.destino.ciudad)}, {viaje.destino.abreviacion} - {new DataHora(viaje.destino.dataHora).imprimir()}
                                </td>
                                <td className="text-center">
                                    {ordenarPisos(viaje.precios).map(piso =>
                                        <p key={piso.id} className={piso.lleno ? "text-red-500" : "text-green-500"}>Piso {piso.nPiso} : Bs {piso.precio}</p>
                                    )}
                                </td>
                                <td className="text-center">
                                    <PrimaryButtonEmpresa disabled={new Date(viaje.salida.dataHora) < (new Date())} onClick={() => selectViaje(viaje)} className="py-1.5 px-2 text-white bg-blue-600">
                                        Escojer
                                    </PrimaryButtonEmpresa>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </section>
        </div>
    </div>
}

export default ViajesFuncionarioPage