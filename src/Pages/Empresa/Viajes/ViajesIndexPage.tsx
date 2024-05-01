import PrimaryButton from "@/Components/PrimaryButton"
import IPage from "@/Types/IPage"
import IViaje from "@/Types/IViaje"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"

const ViajesIndexPage = () => {
    const [aba, setAba] = useState(0)
    const navigate = useNavigate()
    const abas = ['Todos los Viajes', 'Viajes Pasados', 'Viajes disponíbles']
    const idEmpresa = sessionStorage.getItem('idEmpresa')
    const [viajes, setViajes] = useState<IViaje[]>([])

    const showViaje = (codigo: string) => navigate('/empresa/viajes/' + codigo)

    useEffect(() => {
        http.get<IPage<IViaje>>('empresa/viajes/from/' + idEmpresa)
            .then(resposta => {
                setViajes(resposta.data.content)
            })
    }, [])
    return (
        <div className="max-w-7xl m-auto py-10">
            <header className="flex space-x-1">
                {abas.map((abafor, index) => {
                    let classSelect = (index === aba) ? 'bg-slate-300' : ''
                    return <nav
                        onClick={() => setAba(index)}
                        className={`bg-slate-200 cursor-pointer rounded-t-lg py-1.5 px-3 ${classSelect}`} key={index}>
                        {abafor}
                    </nav>
                }
                )}
            </header>
            <div className="bg-slate-300 p-5">
                <table className="w-full">
                    <thead>
                        <tr>
                            <th>Codigo</th>
                            <th>Saldo en Efectivo</th>
                            <th>Saldo en Web</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {viajes.map(viaje =>
                            <tr key={viaje.codigo} className="">
                                <td className="py-2">{viaje.codigo}</td>
                                <td className="text-center">Bs {viaje.valorArrecadadoEfectivo}</td>
                                <td className="text-center">Bs {viaje.valorArrecadadoWeb}</td>
                                <td className="text-center">
                                    <PrimaryButton onClick={() => showViaje(viaje.codigo)}>ver mais</PrimaryButton>
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )
}

export default ViajesIndexPage