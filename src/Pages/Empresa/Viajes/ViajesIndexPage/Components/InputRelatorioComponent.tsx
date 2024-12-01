import PrimaryButton from "@/Components/Buttons/PrimaryButton"
import http from "@/http"
import IPage from "@/Types/IPage"
import { useEffect, useState } from "react"
import { IoSearch } from "react-icons/io5"
import IViajeEmpresa from "../../../Types/IViajeEmpresa"

interface Props {
    idEmpresa: string | number
    viajes: IViajeEmpresa[]
    setViajes: (viaje: IViajeEmpresa[]) => void
}
const InputRelatorioComponent = ({ idEmpresa, viajes, setViajes }: Props) => {
    const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const [anos, setAnos] = useState<number[]>([])
    const [mes, setMes] = useState("")
    const [ano, setAno] = useState("")
    const [nextPage, setNextPage] = useState<number | null>(null)

    useEffect(() => {
        let anosTemp: number[] = []
        let dateNow = new Date()

        setMes((dateNow.getMonth() + 1).toString())
        setAno(dateNow.getFullYear().toString())
        http.post<IPage<IViajeEmpresa>>(`empresa/viajes/from/empresa`, {
            dataAnalise: dateNow,
            idEmpresa: idEmpresa
        }).then(({ data }) => {
            setViajes(data.content)
            if (data.totalPages > 1) setNextPage(1)
            else setNextPage(null)
        })

        anosTemp.push(dateNow.getFullYear() + 1)
        for (let i = 0; i < 5; i++)
            anosTemp.push(dateNow.getFullYear() - i)
        setAnos(anosTemp)
    }, [idEmpresa])

    const buscar = () => {
        const mesInt = parseInt(mes) - 1;
        const anoInt = parseInt(ano);
        const dataAnalise = new Date(anoInt, mesInt, 2);

        http.post<IPage<IViajeEmpresa>>(`empresa/viajes/from/empresa`, {
            dataAnalise: dataAnalise,
            idEmpresa: idEmpresa
        }).then(({ data }) => {
            setViajes(data.content)
            if (data.totalPages > 1) setNextPage(1)
            else setNextPage(null)
        })
    }

    const verMais = () => {
        if (nextPage) {
            const mesInt = parseInt(mes) - 1;
            const anoInt = parseInt(ano);
            const dataAnalise = new Date(anoInt, mesInt, 2);
            http.post<IPage<IViajeEmpresa>>(`empresa/viajes/from/empresa?page=${nextPage}`, {
                dataAnalise: dataAnalise,
                idEmpresa: idEmpresa
            }).then(({ data }) => {
                setViajes(viajes.concat(data.content))
                if (data.totalPages <= data.pageable.pageNumber + 1) {
                    setNextPage(null)
                } else setNextPage(data.pageable.pageNumber + 1)
            })
        }
    }


    return <div className="w-full flex justify-between items-center py-2 px-2">
        <section className="flex items-center">
            <p className="mr-2">
                Viajes del mes
            </p>
            <select value={mes} onChange={e => setMes(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-l focus:ring-blue-500 focus:border-blue-500 block p-1">
                {meses.map(mes => <option key={mes} value={mes}>{mes}</option>)}
            </select>
            <select value={ano} onChange={e => setAno(e.target.value)}
                className="bg-gray-50 border border-gray-300 text-gray-900 text-sm focus:ring-blue-500 focus:border-blue-500 block p-1">
                {anos.map(ano => <option key={ano} value={ano}>{ano}</option>)}
            </select>
            <button
                onClick={buscar}
                className="bg-blue-500 hover:bg-blue-600 h-full rounded-r p-1 border border-blue-500 text-white grid place-content-center">
                <IoSearch style={{ fontWeight: "bold" }} className="text-xl" />
            </button>
        </section>
        <section>
            {nextPage && <PrimaryButton onClick={verMais}> ver mas viajes </PrimaryButton>}
        </section>
    </div>
}
export default InputRelatorioComponent