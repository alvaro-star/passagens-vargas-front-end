import DataHora from "@/Classes/DataHora"
import PrimaryButton from "@/Components/PrimaryButton"
import IPrecio2 from "@/Types/IViaje/IPrecio2"
import { useState } from "react"
import { useNavigate } from "react-router-dom"
import FormInlineTemplateFuncionario from "./Components/FormInlineTemplateFuncionario"
import IViaje from "./Types/IViajeIndex"

const ViajesFuncionarioPage = () => {
    const [viajes, setViajes] = useState<IViaje[]>([])
    const navigate = useNavigate()
    const ordenarPisos = (pisos: IPrecio2[]) => {
        switch (pisos.length) {
            case 1:
                return pisos
            case 2:
                let indicePrimerPiso = pisos[0].nPiso == 1 ? 0 : 1
                let indiceSegundoPiso = pisos[1].nPiso == 2 ? 1 : 0
                return [pisos[indicePrimerPiso], pisos[indiceSegundoPiso]]
            default:
                return []
        }
    }

    const selectViaje = (viaje: IViaje) => {
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
                                    {viaje.salida.ciudad}, {viaje.salida.abreviacion} - {new DataHora(viaje.salida.dataHora).imprimir()}
                                </td>
                                <td>
                                    {viaje.destino.ciudad}, {viaje.destino.abreviacion} - {new DataHora(viaje.destino.dataHora).imprimir()}
                                </td>
                                <td className="text-center">
                                    {ordenarPisos(viaje.precios).map(piso =>
                                        <p key={piso.id} className={piso.lleno ? "text-red-500" : "text-green-500"}>Piso {piso.nPiso} : Bs {piso.precio}</p>
                                    )}
                                </td>
                                <td className="text-center">
                                    <PrimaryButton onClick={() => selectViaje(viaje)} className="uppercase py-1.5 px-2 text-white font-semibold bg-blue-600 rounded-none">Escojer</PrimaryButton>
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