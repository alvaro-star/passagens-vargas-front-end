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
                    <InputLabel value='Nombre' />
                    <TextInput234 value={nombre} setValue={setNombre} />
                </div>
                {!(parametros.id) &&
                    <div className="w-full mt-2">
                        <InputLabel value='Departamento' />
                        <select value={idDepartamento}
                            onChange={eve => setIdDepartamento(parseInt(eve.target.value))}
                            className="p-2 w-full border border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded shadow-sm">
                            {departamentos.map(departamento => <option key={departamento.id} value={departamento.id}>{departamento.nombre}</option>)}
                        </select>
                    </div>
                }
            </FormTemplate>
        </div>
    )
}

export default CiudadesFormPage