import FormTemplate from "@/Components/FormTemplate"
import InputLabel from "@/Components/InputLabel"
import TextInput234 from "@/Components/TextInput234"
import ILugar from "@/Types/ILugar"
import http from "@/http"
import { useEffect, useState } from "react"


interface Props {
    closeModal: () => void,
    setLugares: (lugares: ILugar[]) => void,
    lugares: ILugar[]
    idLugar: number | null
    idCiudad: number
}
const LugaresFormPage = ({ closeModal, setLugares, lugares, idLugar, idCiudad }: Props) => {

    const [nombre, setNombre] = useState<string>('')

    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()

        const form = {
            nombre: nombre,
            idCiudad: idCiudad
        }

        const formUpdate = {
            nombre: nombre
        }

        if (idLugar != null) {
            http.put<ILugar>(`lugares/${idLugar}`, formUpdate)
                .then(resposta => {
                    let lugaresAux = lugares
                    let index = -1
                    index = lugaresAux.findIndex(lugarAux => lugarAux.id == idLugar)
                    if (index != -1) {
                        lugaresAux[index] = resposta.data
                        setLugares(lugaresAux)
                    }
                    setNombre('')
                    closeModal()
                })
        } else {
            http.post<ILugar>('lugares', form)
                .then(resposta => {
                    setNombre('')
                    setLugares([...lugares, resposta.data])
                    closeModal()
                })
        }
    }
    useEffect(() => {
        if (idLugar != null) {
            let lugar = lugares.find(lugar => lugar.id == idCiudad)
            if (lugar) {
                setNombre(lugar.nombre)
            }
        } else {
            setNombre('')
        }
    }, [idLugar])

    return (
        <div className="w-full my-8 grid place-content-center">
            <FormTemplate onSubmit={enviar}>
                <h2 className="my-2 font-semibold text-xl">
                    {idLugar != null ? 'Editando un Lugar' : 'Registrando una Lugar'}
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