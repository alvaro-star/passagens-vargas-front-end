import FormTemplate from "@/Components/FormTemplate"
import InputLabel from "@/Components/InputLabel"
import TextInput234 from "@/Components/TextInput234"
import ICiudad from "@/Types/ICiudad"
import IPage from "@/Types/IPage"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"

interface IDepartamento {
    id: 0,
    nombre: string,
    abreviacion: string,
}

const CiudadesFormPage = () => {
    const parametros = useParams()
    const navigate = useNavigate()

    const [departamentos, setDepartamentos] = useState<IDepartamento[]>([])
    const [nombre, setNombre] = useState<string>('')
    const [idDepartamento, setIdDepartamento] = useState<number>(1)

    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()

        const form = {
            nombre: nombre,
            idDepartamento: idDepartamento
        }

        const formUpdate = {
            nombre: nombre
        }

        if (parametros.id) {
            http.put<ICiudad>(`ciudades/${parametros.id}`, formUpdate)
                .then(() => {
                    setNombre('')
                    navigate('/admin/ciudades')
                })
        } else {
            http.post<ICiudad>('ciudades', form)
                .then(() => {
                    setNombre('')
                    navigate('/admin/ciudades')
                })
        }
    }
    useEffect(() => {
        http.get<ICiudad>(`ciudades/${parametros.id}`)
            .then(resposta => {
                setNombre(resposta.data.nombre)
                setIdDepartamento(resposta.data.idDepartamento)
            })
    }, [parametros])

    useEffect(() => {
        if (!(parametros.id)) {
            http.get<IPage<IDepartamento>>('departamentos')
                .then((resposta) => {
                    setDepartamentos(resposta.data.content)
                })
        }
    }, [])

    return (
        <div className="w-full my-8 grid place-content-center">
            <FormTemplate onSubmit={enviar}>
                <h2 className="my-2 font-semibold text-xl">
                    {parametros.id ? 'Editando una Ciudad' : 'Registrando una Ciudad'}
                </h2>
                <div className="w-full mt-2">
                    <TextInput234 value={nombre} setValue={setNombre} labelValue="Nombre" />
                </div>
                {!(parametros.id) &&
                    <div className="w-full mt-2 relative">
                        <select value={idDepartamento}
                            onChange={eve => setIdDepartamento(parseInt(eve.target.value))}
                            className="block px-2.5 pb-2.5 pt-4 w-full text-sm text-gray-900 bg-white rounded border border-gray-400 appearance-none focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 peer">
                            {departamentos.map(departamento => <option key={departamento.id} value={departamento.id}>{departamento.nombre}</option>)}
                        </select>
                        <label className="absolute text-sm text-gray-500 rounded-t bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Departamento</label>
                    </div>
                }
            </FormTemplate>
        </div>
    )
}

export default CiudadesFormPage