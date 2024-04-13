import Button from "@/Components/Button"
import ICiudad from "@/Types/ICiudad"
import IPage from "@/Types/IPage"
import http from "@/http"
import { useEffect, useState } from "react"
import CiudadesFormPage from "./CiudadesFormPage"


const CiudadesIndexPage = () => {
    const [ciudades, setCiudades] = useState<ICiudad[]>([])

    const [openForm, setOpenForm] = useState(false)

    const updateCiudades = (ciudad: ICiudad) => {
        setCiudades([...ciudades, ciudad])
    }
    useEffect(() => {
        http.get<IPage<ICiudad>>('ciudades')
            .then(resposta => {
                setCiudades(resposta.data.content)
            })
    }, [])


    return (
        <div className="w-full flex justify-center flex-col items-center">
            <div className="my-5 w-full px-28 flex items-center justify-between">
                <h2 className="text-2xl font-semibold">
                    Ciudades
                </h2>
                <Button onClick={() => setOpenForm(true)}>Registrar Nuevo</Button>
                {openForm &&
                    <div className="absolute top-0 right-0  left-0 bottom-0 h-full bg-white bg-opacity-65 grid place-content-center">
                        <CiudadesFormPage updateCiudades={updateCiudades} openForm={openForm} setOpenForm={setOpenForm} />
                    </div>
                }
            </div>
            <div className="mb-10 grid place-content-center bg-slate-500 rounded text-white p-5">
                <table className="border-t border-x">
                    <thead>
                        <tr className="border-b">
                            <th className="border-r w-8">Id</th>
                            <th className="border-r w-40">Nombre</th>
                            <th className="border-r w-16">IdDep</th>
                            <th colSpan={2} className="w-40"> Action</th>
                        </tr>
                    </thead>
                    <tbody>
                        {ciudades.map(ciudad =>
                            <tr className="border-b" key={ciudad.id}>
                                <td className="p-1 text-center border-r">{ciudad.id}</td>
                                <td className="p-1 border-r">{ciudad.nombre}</td>
                                <td className="p-1 text-center border-r">{ciudad.idDepartamento}</td>
                                <td className="p-1 font-semibold text-center border-r bg-yellow-400">
                                    EDITAR
                                </td>
                                <td className="p-1 font-semibold text-center bg-red-500">
                                    ELIMINAR
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    )

}


export default CiudadesIndexPage