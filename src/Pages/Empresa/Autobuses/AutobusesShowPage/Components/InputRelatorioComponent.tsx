import PrimaryButton from "@/Components/PrimaryButton"
import http from "@/http"
import IPage from "@/Types/IPage"
import { useEffect, useState } from "react"
import { IoSearch } from "react-icons/io5"
import { useNavigate } from "react-router-dom"
import IViajeEmpresa from "../../../Types/IViajeEmpresa"
import IAutobusExtends from "../Types/IAutobusExtends"

interface Props {
    idAutobus: undefined | string | number
    viajes: IViajeEmpresa[]
    setViajes: (viaje: IViajeEmpresa[]) => void
    setAutobus: (autobs: IAutobusExtends) => void
}
const InputRelatorioComponent = ({ idAutobus, viajes, setViajes, setAutobus }: Props) => {
    const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const [anos, setAnos] = useState<number[]>([])
    const [mes, setMes] = useState("")
    const [ano, setAno] = useState("")
    const [nextPage, setNextPage] = useState<number | null>(null)
    const navigate = useNavigate()
    useEffect(() => {
        if (idAutobus) {
            let anosTemp: number[] = []
            let dateNow = new Date()

            setMes((dateNow.getMonth() + 1).toString())
            setAno(dateNow.getFullYear().toString())
            http.get<IAutobusExtends>(`autobuses/${idAutobus}`)
                .then(resposta => { setAutobus(resposta.data) })
            http.post<IPage<IViajeEmpresa>>(`empresa/viajes/from/autobus`, {
                dataAnalise: dateNow,
                idAutobus: idAutobus
            }).then(resposta => {
                setViajes(resposta.data.content)
                if (resposta.data.totalPages > 1) setNextPage(1)
                else setNextPage(null)
            })

            anosTemp.push(dateNow.getFullYear() + 1)
            for (let i = 0; i < 5; i++)
                anosTemp.push(dateNow.getFullYear() - i)
            setAnos(anosTemp)
        } else navigate("/")
    }, [idAutobus])
    const verMais = () => {
        if (nextPage) {
            http.get<IPage<IViajeEmpresa>>(`empresa/viajes/from/autobus?page=${nextPage}`)
                .then(resposta => {
                    setViajes(viajes.concat(resposta.data.content))
                    if (resposta.data.totalPages <= resposta.data.pageable.pageNumber + 1) {
                        setNextPage(null)
                    } else setNextPage(resposta.data.pageable.pageNumber + 1)
                })
        }
    }

    const buscar = () => {
        const mesInt = parseInt(mes) - 1;
        const anoInt = parseInt(ano);
        const dataAnalise = new Date(anoInt, mesInt, 2);
        if (idAutobus != null) {
            http.post<IPage<IViajeEmpresa>>(`empresa/viajes/from/autobus`, {
                dataAnalise: dataAnalise,
                idAutobus: idAutobus
            }).then(resposta => { setViajes(resposta.data.content) });
        }
    }
    return <div className="w-full flex justify-between items-center py-2 px-2">
        <section className="flex items-center">
            <p className="mr-2">
                Fecha del relatorio
            </p>
            <select value={mes} onChange={e => setMes(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                {meses.map(mes => <option key={mes} value={mes}>{mes}</option>)}
            </select>
            <select value={ano} onChange={e => setAno(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-2.5">
                {anos.map(ano => <option key={ano} value={ano}>{ano}</option>)}
            </select>
            <button
                onClick={buscar}
                className="bg-blue-500 hover:bg-blue-600 h-full rounded-r p-2.5 border border-blue-500 text-white grid place-content-center">
                <IoSearch style={{ fontWeight: "bold" }} className="text-xl" />
            </button>
        </section>
        <section>
            {nextPage && <PrimaryButton onClick={verMais} className="rounded-none"> ver mas viajes </PrimaryButton>}
        </section>
    </div>
}
export default InputRelatorioComponent