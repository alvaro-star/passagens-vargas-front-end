import { useState } from "react"
import IViajeEmpresa from "../../Types/IViajeEmpresa"
import InputRelatorioComponent from "./Components/InputRelatorioComponent"
import PrimaryButton from "@/Components/PrimaryButton"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import DataHora from "@/Classes/DataHora"
import { useNavigate } from "react-router-dom"
import TableComponent from "@/Components/Table/TableComponent"
import ThComponent from "@/Components/Table/ThComponent"
import TdComponent from "@/Components/Table/TdComponent"

const ViajesIndexPage = () => {
    const idEmpresa = sessionStorage.getItem('idEmpresa')
    const [viajes, setViajes] = useState<IViajeEmpresa[]>([])

    const navigate = useNavigate()
    const showViaje = (codigo: string) => navigate('/empresa/viajes/' + codigo)

    return <div className="max-w-7xl m-auto py-10">
        <h2 className="ml-5 text-2xl md:text-white font-semibold pb-5">
            Lista de Viajes dela Empresa
        </h2>
        {idEmpresa && <TableComponent
            header={<InputRelatorioComponent idEmpresa={idEmpresa} viajes={viajes} setViajes={setViajes} />}
            thead={
                <>
                    <ThComponent text="Salida" />
                    <ThComponent text="Destino" />
                    <ThComponent text="Saldo en Efectivo" />
                    <ThComponent text="" />
                </>
            }
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
                            Bs {viaje.valorArrecadadoEfectivo} - En desarrollo
                        </TdComponent>
                        <TdComponent className="text-right">
                            <PrimaryButton className="rounded-none" onClick={() => showViaje(viaje.id)}>ver mas</PrimaryButton>
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
        />}
    </div>
}

export default ViajesIndexPage