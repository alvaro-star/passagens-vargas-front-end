import FormTemplate from "@/Components/FormTemplate"
import InputLabel from "@/Components/InputLabel"
import TextInput234 from "@/Components/TextInput234"
import ILugar from "@/Types/ILugar"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"


interface Props {
    closeModal?: () => void,
    setLugares?: (lugares: ILugar[]) => void,
    lugares?: ILugar[]
    idCiudadProp?: number
    create?: boolean
}

const LugaresFormPage = ({ closeModal, setLugares, lugares, idCiudadProp, create = false }: Props) => {
    const navigate = useNavigate()
    const [nombre, setNombre] = useState<string>('')
    const [idCiudad, setIdCiudad] = useState<number>(idCiudadProp ? idCiudadProp : 0)
    const parametros = useParams()

    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()

        const form = {
            nombre: nombre,
            idCiudad: idCiudad
        }

        const formUpdate = {
            nombre: nombre
        }

        if (create == false) {
            http.put<ILugar>(`lugares/${parametros.id}`, formUpdate)
                .then(() => {
                    navigate('/admin/ciudades/' + idCiudad)
                })
        } else {
            if (setLugares && lugares && closeModal) {
                http.post<ILugar>('lugares', form)
                    .then(resposta => {
                        setNombre('')
                        setLugares([...lugares, resposta.data])
                        closeModal()
                    })
            }
        }
    }

    useEffect(() => {
        if (create == false) {
            http.get<ILugar>(`lugares/${parametros.id}`)
                .then(resposta => {
                    setNombre(resposta.data.nombre)
                    setIdCiudad(resposta.data.idCiudad)
                })
        } else {
            setNombre('')
        }
    }, [parametros])

    return (
        <div className="w-full my-8 grid place-content-center">
            <FormTemplate onSubmit={enviar}>
                <h2 className="my-2 font-semibold text-xl">
                    {create == false ? 'Editando un Lugar' : 'Registrando una Lugar'}
                </h2>
                <div className="w-full mt-2">
                    <InputLabel value='Nombre' />
                    <TextInput234 value={nombre} setValue={setNombre} />
                </div>
            </FormTemplate>
        </div>
    )
}

export default LugaresFormPage