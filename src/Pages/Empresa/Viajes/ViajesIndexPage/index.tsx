import { useState } from "react"
import IViajeEmpresa from "../../Types/IViajeEmpresa"
import InputRelatorioComponent from "./Components/InputRelatorioComponent"
import ViajesTableComponent from "./Components/ViajesTableComponent"

const ViajesIndexPage = () => {
    const idEmpresa = sessionStorage.getItem('idEmpresa')

    const [viajes, setViajes] = useState<IViajeEmpresa[]>([])
    return (
        <div className="max-w-7xl m-auto py-3">
            <h2 className="ml-5 text-2xl font-semibold py-2">
                Lista de Viajes dela Empresa
            </h2>
            {idEmpresa && <InputRelatorioComponent
                idEmpresa={idEmpresa} viajes={viajes} setViajes={setViajes}
            />}
            <ViajesTableComponent viajes={viajes} />
        </div>
    )
}

export default ViajesIndexPage