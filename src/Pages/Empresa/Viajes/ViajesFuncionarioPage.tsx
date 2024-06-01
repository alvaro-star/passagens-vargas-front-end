import DataHora from "@/Classes/DataHora"
import { useState } from "react"
import { Link } from "react-router-dom"
import FormInlineTemplateFuncionario from "./Components/FormInlineTemplateFuncionario"
import IViaje from "./Types/IViajeIndex"

const ViajesFuncionarioPage = () => {
    const [viajes, setViajes] = useState<IViaje[]>([])

    return <div className="p-5 w-full">
        <div className="max-w-7xl mx-auto">
            <section>
                <FormInlineTemplateFuncionario setViajes={setViajes} />
            </section>
            <section className="bg-white mt-6 p-5">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th className="text-start">Salida</th>
                            <th className="text-start">Destino</th>
                            <th className="text-center">N Pisos</th>
                            <th>Acciones</th>
                        </tr>
                    </thead>
                    <tbody>

                        {viajes.map(viaje =>
                            <tr key={viaje.id}>
                                <td className="py-2">
                                    {viaje.salida.ciudad}, {viaje.salida.abreviacion} - {new DataHora(viaje.salida.dataHora).imprimir()}
                                </td>
                                <td>
                                    {viaje.destino.ciudad}, {viaje.destino.abreviacion} - {new DataHora(viaje.destino.dataHora).imprimir()}
                                </td>
                                <td className="text-center">
                                    {viaje.precios[0].precio}{viaje.precios[1] ? " - " + viaje.precios[1].precio : ""}
                                </td>
                                <td className="text-center">
                                    <Link to="" className="uppercase py-1.5 px-2 text-white font-semibold bg-blue-600">Escojer</Link>
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