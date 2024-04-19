import ICiudad from "@/Types/ICiudad"
import ILugar from "@/Types/ILugar"
import http from "@/http"
import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import LugaresFormPage from "../Lugares/LugaresFormPage"

const CiudadesShowPage = () => {
    const parametros = useParams()
    const [ciudad, setCiudad] = useState<ICiudad | null>(null)
    const [lugares, setLugares] = useState<ILugar[]>([])
    const [openForm, setOpenForm] = useState(false)

    const [idLugarUpdate, setIdLugarUpdate] = useState<number | null>(null)

    const create = () => {
        setIdLugarUpdate(null)
        setOpenForm(true)
    }
    const editar = (id: number) => {
        setIdLugarUpdate(id)
        setOpenForm(true)
    }
    const eliminar = (id: number) => {
        http.delete(`lugares/${id}`)
            .then(() => {
                let lugaresAux = lugares.filter(lugar => lugar.id != id)
                setLugares(lugaresAux)
            }).catch(() => alert("No es posible eliminar la ciudad"))
    }

    const closeForm = () => {
        setOpenForm(false)
    }

    useEffect(() => {
        http.get<ICiudad>(`ciudades/${parametros.id}`)
            .then(resposta => {
                setCiudad(resposta.data)
            })

        http.get<ILugar[]>(`ciudades/${parametros.id}/lugares`)
            .then(resposta => {
                setLugares(resposta.data)
            })
    }, [parametros])
    return (
        <div className="w-full flex justify-center flex-col items-center">
            <div className="my-5 w-full px-28 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                    {ciudad?.nombre}
                </h2>
                <button className="bg-black rounded-lg uppercase text-white py-2 px-3 font-medium"
                    onClick={create} >Registrar Nuevo</button>
                {openForm && ciudad &&
                    <div className="absolute inset-0 grid place-content-center bg-white bg-opacity-35">
                        <LugaresFormPage idLugar={idLugarUpdate} idCiudad={ciudad.id} closeModal={closeForm} setLugares={setLugares} lugares={lugares} />
                    </div>
                }
            </div>
            <div className="w-full rounded text-white space-y-2">
                {lugares.map(lugar => <div className="mx-5 rounded px-5 py-2 justify-between flex bg-slate-500 border-b" key={lugar.id}>
                    <div className="p-1 text-center">{lugar.id}</div>
                    <div className="p-1">{lugar.nombre}</div>
                    <div className="flex items-center gap-2">
                        <div className="p-1 font-semibold rounded text-center bg-yellow-400 hover:bg-yellow-500 cursor-pointer"
                            onClick={() => editar(lugar.id)} >
                            EDITAR
                        </div>
                        <div className="p-1 font-semibold rounded text-center bg-red-500 cursor-pointer hover:bg-red-600"
                            onClick={() => eliminar(lugar.id)} >
                            ELIMINAR
                        </div>
                    </div>
                </div>
                )}
            </div>
        </div>
    )
}


export default CiudadesShowPage