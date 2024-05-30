import { useState } from "react"
import { useNavigate } from "react-router-dom"
import ViajeTable from "./Components/ViajeTable"

const ViajesIndexPage = () => {
    const [aba, setAba] = useState(0)
    const navigate = useNavigate()
    const abas = ['Todos los Viajes', 'Viajes Pasados', 'Viajes disponíbles']

    const idEmpresa = sessionStorage.getItem('idEmpresa')
    const showViaje = (codigo: string) => navigate('/empresa/viajes/' + codigo)

    return (
        <div className="max-w-7xl m-auto py-10">
            <header className="flex space-x-1">
                {abas.map((abafor, index) => {
                    let classSelect = (index === aba) ? 'bg-slate-300' : ''
                    return <nav
                        onClick={() => setAba(index)}
                        className={`bg-slate-200 cursor-pointer rounded-t-lg py-1.5 px-3 ${classSelect}`}
                        key={index}>
                        {abafor}
                    </nav>
                })}
            </header>
            <ViajeTable numeroAbaAtual={aba} numeroAbaJanela={0} path={'empresa/viajes/from/' + idEmpresa + "/all"} order={"desc"} showViaje={showViaje} />
            <ViajeTable numeroAbaAtual={aba} numeroAbaJanela={1} path={'empresa/viajes/from/' + idEmpresa + "/before"} order={"desc"} showViaje={showViaje} />
            <ViajeTable numeroAbaAtual={aba} numeroAbaJanela={2} path={'empresa/viajes/from/' + idEmpresa + "/after"} order={"asc"} showViaje={showViaje} />
        </div>
    )
}

export default ViajesIndexPage