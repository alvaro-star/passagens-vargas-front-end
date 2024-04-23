import React, { FormHTMLAttributes, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import http from "@/http"
import ICiudad from "@/Types/ICiudad"
import InputError from "@/Components/InputError"
import IFormViaje from "../Types/IFormViaje"
import TextInput234 from "@/Components/TextInput234";
import SelectCiudad from "./SelectCiudad";
import IType from "@/Types/IType"

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
    formData?: IFormViaje
}

interface Erros {
    ciudadSalida: string,
    ciudadDestino: string,
    fechaIda: string,
    fechaVuelta: string
}

const FormInlineTemplate = ({ formData, className = '', ...props }: Props) => {
    const navigate = useNavigate()
    const [ciudadSalida, setCiudadSalida] = useState<IType | null>(null);
    const [ciudadDestino, setCiudadDestino] = useState<IType | null>(null);
    const [fechaIda, setFechaIda] = useState<string>('')
    const [fechaVuelta, setFechaVuelta] = useState<string>('')

    const [errors, setErrors] = useState<Erros>({
        ciudadSalida: '',
        ciudadDestino: '',
        fechaIda: '',
        fechaVuelta: ''
    })

    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        let erros: Erros = {
            ciudadSalida: '',
            ciudadDestino: '',
            fechaIda: '',
            fechaVuelta: ''
        }

        if (fechaIda == '') {
            erros.fechaIda = 'Escoje una fecha válida'
        }
        if (!ciudadSalida)
            erros.ciudadSalida = 'Escoje una ciudad válida'

        if (!ciudadDestino)
            erros.ciudadDestino = 'Escoje una ciudad válida'

        if (ciudadSalida && ciudadDestino) {
            if (ciudadSalida.value === ciudadDestino.value) {
                erros.ciudadSalida = 'La salida es igual al destino'
                erros.ciudadSalida = 'El destino es igual ala salida'
            }

            if (erros.ciudadSalida == '' && erros.ciudadDestino == '' && erros.fechaIda == '') {
                const formViajes = {
                    idCiudadSalida: ciudadSalida.value,
                    idCiudadDestino: ciudadDestino.value,
                    fechaSalida: fechaIda,
                    fechaVuelta: fechaVuelta
                }

                sessionStorage.setItem("formViaje", JSON.stringify(formViajes))
                navigate('/viajes')
            }
        }

        setErrors(erros)
    }

    useEffect(() => {
        if (formData) {
            http.get<ICiudad>(`ciudades/${formData.idCiudadSalida}`)
                .then(resposta => {
                    setCiudadSalida({ value: resposta.data.id, label: resposta.data.nombre })
                })
            http.get<ICiudad>(`ciudades/${formData.idCiudadDestino}`)
                .then(resposta => {
                    setCiudadDestino({ value: resposta.data.id, label: resposta.data.nombre })
                })
            setFechaIda(formData.fechaSalida)
            setFechaVuelta(formData.fechaVuelta)
        }
    }, [formData])
    return (
        <form className={"max-w-5xl p-5 mx-auto shadow-xl bg-white flex items-center justify-between gap-5  rounded " + className}
            {...props}
            onSubmit={enviar}>
            <div className="w-full">
                <SelectCiudad option={ciudadSalida} setOption={setCiudadSalida} />
                <InputError message={errors.ciudadSalida} />
            </div>
            <div className="w-full">
                <SelectCiudad option={ciudadDestino} setOption={setCiudadDestino} />
                <InputError message={errors.ciudadDestino} />
            </div>
            <div>
                <TextInput234 type="date" value={fechaIda} setValue={setFechaIda} required />
                <InputError message={errors.fechaIda} />
            </div>
            <div>
                <TextInput234 type="date" value={fechaVuelta} setValue={setFechaVuelta} required />
                <InputError message={errors.fechaVuelta} />
            </div>
            <div className="flex items-center h-full justify-center">
                <button className="h-9 w-9 rounded bg-cyan-500 text-white">
                    B
                </button>
            </div>
        </form>
    )
}

export default FormInlineTemplate