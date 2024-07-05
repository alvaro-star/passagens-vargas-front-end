import PrimaryButton from "@/Components/PrimaryButton"
import IAutobus from "@/Types/IAutobus"
import IPiso from "@/Types/IPiso"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import ViajesFormPage from "../Viajes/ViajesFormPage"
import IViaje from "@/Types/IViaje"
import IPage from "@/Types/IPage"
import { IoSearch } from "react-icons/io5"
import IParada2 from "@/Types/IViaje/IParada2"

interface IAutobusExtend extends IAutobus {
    pisos: IPiso[],
    //viajes: IViaje[]
}
interface IVIajeExtends extends IViaje {
    salida: IParada2
    destino: IParada2
}

const AutobusesShowPage = () => {
    const path = '/empresa'

    const { id } = useParams()
    const navigate = useNavigate()

    const [autobus, setAutobus] = useState<IAutobusExtend | null>(null)
    const [viajes, setViajes] = useState<IVIajeExtends[]>([])
    const [openForm, setOpenForm] = useState(false)

    const [mes, setMes] = useState("")
    const [ano, setAno] = useState("")

    const meses = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12]
    const [anos, setAnos] = useState<number[]>([])

    const showViaje = (id: string) => navigate(path + '/viajes/' + id)

    const criarViaje = (viaje: IViaje) => {
        alert("Os tipos do typescript da funcao eh incompativel")
        //setViajes(viajesPrev => [...viajesPrev, viaje]);
        setOpenForm(false);
    };

    const buscar = () => {
        const mesInt = parseInt(mes) - 1;
        const anoInt = parseInt(ano);
        const dataAnalise = new Date(anoInt, mesInt, 2);

        http.post<IPage<IVIajeExtends>>(`empresa/viajes/from/autobus`, {
            dataAnalise: dataAnalise,
            idAutobus: id
        }).then(resposta => {
            setViajes(resposta.data.content);
            console.log(resposta.data.content);

        });
    }

    useEffect(() => {
        if (id) {
            let anosTemp: number[] = [];
            let dateNow = new Date()
            setMes((dateNow.getMonth() + 1).toString())
            setAno(dateNow.getFullYear().toString())

            http.get<IAutobusExtend>(`autobuses/${id}`)
                .then(resposta => {
                    setAutobus(resposta.data)
                })
            http.post<IPage<IVIajeExtends>>(`empresa/viajes/from/autobus`, {
                dataAnalise: dateNow,
                idAutobus: id
            }).then(resposta => {
                setViajes(resposta.data.content)
            })

            anosTemp.push(dateNow.getFullYear() + 1)
            for (let i = 0; i < 5; i++)
                anosTemp.push(dateNow.getFullYear() - i)
            setAnos(anosTemp)
        } else navigate(`/`)
    }, [id, navigate])

    return (
        <div className="mx-auto max-w-7xl py-10">
            {autobus &&
                <>
                    {openForm && <div className="absolute top-0 bottom-0 left-0 right-0 grid place-content-center m-0 bg-white bg-opacity-50">
                        <ViajesFormPage setOpenForm={setOpenForm} addViaje={criarViaje} idAutobus={autobus.id} nPisos={autobus.pisos.length} />
                    </div>}
                    <div className="w-full p-5 bg-slate-700 text-white font-semibold text-xl flex justify-between items-center">
                        <p>Lista de viajes del autobus {autobus.placa}</p>
                        <div className="space-x-4 flex items-center">
                            <PrimaryButton className="hidden">ver modelo</PrimaryButton>
                            <PrimaryButton onClick={() => { setOpenForm(true) }}> registrar un viaje</PrimaryButton>
                        </div>
                    </div>
                    <div className="w-full flex justify-end items-center">
                        <p className="mr-2">
                            Mes del relatorio
                        </p>
                        <select value={mes} onChange={e => setMes(e.target.value)} className="rounded p-2">
                            {meses.map(mes =>
                                <option key={mes} value={mes}>{mes}</option>
                            )}
                        </select>
                        <select value={ano} onChange={e => setAno(e.target.value)} className="rounded p-2">
                            {anos.map(ano =>
                                <option key={ano} value={ano}>{ano}</option>
                            )}
                        </select>
                        <button
                            onClick={buscar}
                            className="bg-blue-500 mr-2 rounded p-2 text-white font-bold grid place-content-center">
                            <IoSearch />
                        </button>
                    </div>
                    <div className="space-y-3 bg-white py-3">
                        {viajes.map(viaje =>
                            <div className="px-5 flex items-center justify-between" key={viaje.id}>
                                <p>{viaje.salida.ciudad}, {viaje.salida.abreviacion}</p>
                                <p>{viaje.destino.ciudad}, {viaje.destino.abreviacion}</p>
                                <p>Dinero Arrecadado en Efectivo Bs {viaje.valorArrecadadoEfectivo}</p>
                                <p>Dinero disponible en la Web: Bs {viaje.valorArrecadadoWeb}</p>
                                <PrimaryButton onClick={() => showViaje(viaje.id)} className="bg-blue-500 rounded-none">Ver viaje</PrimaryButton>
                            </div>
                        )}
                        {viajes.length == 0 &&
                            <div className="px-5 py-3 bg-gray-300 flex items-center justify-between">
                                No hay Viajes Registrados
                            </div>
                        }
                    </div>
                </>
            }
        </div >
    )
}


export default AutobusesShowPage