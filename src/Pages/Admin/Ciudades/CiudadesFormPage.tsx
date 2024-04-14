import FormTemplate from "@/Components/FormTemplate"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import ICampo from "@/Types/ICampo"
import ICiudad from "@/Types/ICiudad"
import IPage from "@/Types/IPage"
import http from "@/http"
import { useEffect, useState } from "react"



interface Props {
    openForm: boolean
    setOpenForm: (value: boolean) => void
    updateCiudades: (ciudad: ICiudad) => void
}

interface IDepartamento {
    id: 0,
    nombre: string,
    abreviacion: string
}

const CiudadesFormPage = ({ openForm, updateCiudades, setOpenForm }: Props) => {
    const construtorCampo = { value: '', erro: '' };
    const [departamentos, setDepartamentos] = useState<IDepartamento[]>([])
    const [nombre, setNombre] = useState<ICampo<string>>(construtorCampo)
    const [idDepartamento, setIdDepartamento] = useState<ICampo<string>>({ value: '1', erro: '' })
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        let aux = openForm
        let number = parseInt(idDepartamento.value)
        if (number) {
            const form = {
                nombre: nombre.value,
                idDepartamento: number
            }
            http.post<ICiudad>('ciudades', form).then(resposta => {
                if (resposta.status == 201 || resposta.status == 2010) {
                    setOpenForm(!aux)
                    updateCiudades(resposta.data)
                }
            })
        }
    }
    useEffect(() => {
        http.get<IPage<IDepartamento>>('departamentos')
            .then((resposta) => {
                setDepartamentos(resposta.data.content)
            })
        console.log('teste');

    }, [])
    return (
        <div>
            <FormTemplate onSubmit={enviar}>
                <h2 className="my-2 font-semibold text-xl">
                    Registrando una Ciudad
                </h2>
                <div className="w-full mt-2">
                    <InputLabel value='Nombre' />
                    <TextInput campo={nombre} placeholder="Escribe el nombre dela ciudad" setCampo={setNombre} />
                </div>
                <div className="w-full mt-2">
                    <InputLabel value='Departamento' />
                    <select value={idDepartamento.value}
                        onChange={eve => setIdDepartamento({ value: eve.target.value, erro: idDepartamento.erro })}
                        className="p-2 w-full border border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded shadow-sm">
                        {departamentos.map(departamento =>
                            <option key={departamento.id} value={departamento.id}>{departamento.nombre}</option>
                        )}
                    </select>
                </div>
            </FormTemplate>
        </div>
    )
}

export default CiudadesFormPage