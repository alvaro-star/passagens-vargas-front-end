import React, { FormHTMLAttributes, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import Select, { StylesConfig } from 'react-select';
import http from "@/http"
import IPage from "@/Types/IPage"
import ICiudad from "@/Types/ICiudad"
import InputError from "@/Components/InputError"
import IFormViaje from "../Types/IFormViaje"
import TextInput234 from "@/Components/TextInput234";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
    formData?: IFormViaje
}

interface OptionType {
    value: string | number;
    label: string;
}

const customStyles: StylesConfig<OptionType, false> = {
    control: (provided, state) => ({
        ...provided,
        border: state.isFocused ? '1px solid blue' : '1px solid #ccc',
        padding: '2px'
    })
};

interface Erros {
    ciudadSalida: string,
    ciudadDestino: string,
    fechaIda: string,
    fechaVuelta: string
}

const FormInlineTemplate = ({ formData, className = '', ...props }: Props) => {
    const navigate = useNavigate()
    const [ciudadSalida123, setCiudadSalida123] = useState<OptionType | null>(null);
    const [ciudadDestino123, setCiudadDestino123] = useState<OptionType | null>(null);
    const [fechaIda, setFechaIda] = useState<string>('')
    const [fechaVuelta, setFechaVuelta] = useState<string>('')

    const [ciudadesSalida, setCiudadesSalida] = useState<OptionType[]>([])
    const [ciudadesDestino, setCiudadesDestino] = useState<OptionType[]>([])
    const [errors, setErrors] = useState<Erros>({
        ciudadSalida: '',
        ciudadDestino: '',
        fechaIda: '',
        fechaVuelta: ''
    })

    const handleChangeCiudadSalida = (selectedOption: OptionType | null) => {
        setCiudadSalida123(selectedOption);
    };

    const handleInputChangeCiudadSalida = (inputValue: string) => {
        if (inputValue.length > 2) {
            http.get<IPage<ICiudad>>(`ciudades/${inputValue}/like`)
                .then(resposta => {
                    setCiudadesSalida(resposta.data.content.map(ciudad => ({ value: ciudad.id, label: ciudad.nombre })))
                })
        }
    };

    const handleChangeCiudadDestino = (selectedOption: OptionType | null) => {
        setCiudadDestino123(selectedOption);
    };

    const handleInputChangeCiudadDestino = (inputValue: string) => {
        if (inputValue.length > 2) {
            http.get<IPage<ICiudad>>(`ciudades/${inputValue}/like`)
                .then(resposta => {
                    setCiudadesDestino(resposta.data.content.map(ciudad => ({ value: ciudad.id, label: ciudad.nombre })))
                })
        }
    };

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
        if (!ciudadSalida123)
            erros.ciudadSalida = 'Escoje una ciudad válida'

        if (!ciudadDestino123)
            erros.ciudadDestino = 'Escoje una ciudad válida'

        if (ciudadSalida123 && ciudadDestino123) {
            if (ciudadSalida123.value === ciudadDestino123.value) {
                erros.ciudadSalida = 'La salida es igual al destino'
                erros.ciudadSalida = 'El destino es igual ala salida'
            }

            if (erros.ciudadSalida == '' && erros.ciudadDestino == '' && erros.fechaIda == '') {
                const formViajes = {
                    idCiudadSalida: ciudadSalida123.value,
                    idCiudadDestino: ciudadDestino123.value,
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
                    setCiudadSalida123({ value: resposta.data.id, label: resposta.data.nombre })
                })
            http.get<ICiudad>(`ciudades/${formData.idCiudadDestino}`)
                .then(resposta => {
                    setCiudadDestino123({ value: resposta.data.id, label: resposta.data.nombre })
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
                <Select
                    styles={customStyles}
                    value={ciudadSalida123}
                    onChange={handleChangeCiudadSalida}
                    options={ciudadesSalida}
                    onInputChange={handleInputChangeCiudadSalida}
                />
                <InputError message={errors.ciudadSalida} />
            </div>
            <div className="w-full">
                <Select
                    styles={customStyles}
                    value={ciudadDestino123}
                    onChange={handleChangeCiudadDestino}
                    options={ciudadesDestino}
                    onInputChange={handleInputChangeCiudadDestino}
                />
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