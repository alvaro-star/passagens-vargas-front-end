import { useState } from "react"
import IViajeEmpresa from "../../Types/IViajeEmpresa"
import InputRelatorioComponent from "./Components/InputRelatorioComponent"
import PrimaryButton from "@/Components/Buttons/PrimaryButton"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import DataHora from "@/Classes/DataHora"
import { useNavigate } from "react-router-dom"
import TableComponent from "@/Components/Table/TableComponent"
import ThComponent from "@/Components/Table/ThComponent"
import TdComponent from "@/Components/Table/TdComponent"
import ContainerShowTemplate from "@/Pages/Layout/ContainerShowTemplate"
import CookieEmpresaId from "@/Helpers/CookieGenerate/CookieEmpresaId"

const ViajesIndexPage = () => {
    const idEmpresa = CookieEmpresaId.get()
    const [viajes, setViajes] = useState<IViajeEmpresa[]>([])

    const navigate = useNavigate()
    const showViaje = (codigo: string) => navigate('/empresa/viajes/' + codigo)

    return <ContainerShowTemplate
        header={
            <h2 className="text-2xl md:text-white font-semibold">
                Lista de Viajes dela Empresa
            </h2>
        }>

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
    </ContainerShowTemplate>
}

export default ViajesIndexPage