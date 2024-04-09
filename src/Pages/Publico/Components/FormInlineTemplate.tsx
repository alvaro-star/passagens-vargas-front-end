import React, { FormHTMLAttributes, useEffect, useState } from "react"
import InputError from "../../../Components/InputError"
import TextInput from "../../../Components/TextInput"
import ICiudad from "../../../Types/ICiudad"
import { useNavigate } from "react-router-dom"
import http from "../../../http"
import IPage from "../../../Types/IPage"
import ICampo from "../../../Types/ICampo"
import IFormViaje from "../IFormViaje"

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
    formData?: IFormViaje
}



const FormInlineTemplate = ({ formData, className = '', ...props }: Props) => {

    const [ciudadSalida, setCiudadSalida] = useState<ICampo<string>>({ value: '', erro: '' })
    const [ciudadDestino, setCiudadDestino] = useState<ICampo<string>>({ value: '', erro: '' })
    const [fechaIda, setFechaIda] = useState('')
    const [fechaVuelta, setFechaVuelta] = useState('')

    const [ciudadesSalida, setCiudadesSalida] = useState<ICiudad[]>([])
    const [ciudadesDestino, setCiudadesDestino] = useState<ICiudad[]>([])

    const navigate = useNavigate()
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        setCiudadSalida({ value: ciudadSalida.value, erro: '' })
        setCiudadDestino({ value: ciudadDestino.value, erro: '' })
        if (ciudadSalida === ciudadDestino) {
            setCiudadSalida({ value: ciudadSalida.value, erro: 'La salida es igual al destino' })
            setCiudadDestino({ value: ciudadDestino.value, erro: 'El destino es igual ala salida' })
        }

        let idSalida = -1
        ciudadesSalida.forEach((ci) => {
            if (ci.nombre === ciudadSalida.value) {
                idSalida = ci.id
            }
        })

        let idDestino = -1
        ciudadesDestino.forEach((ci) => {
            if (ci.nombre === ciudadDestino.value) {
                idDestino = ci.id
            }
        })

        if (idSalida == -1) {
            setCiudadSalida({ value: ciudadSalida.value, erro: 'Escribe una ciudad válido' })
        }

        if (idDestino == -1) {
            setCiudadDestino({ value: ciudadDestino.value, erro: 'Escribe una ciudad válido' })
        }

        if (idDestino != -1 && idSalida != -1 && fechaIda != '') {
            const formViajes = {
                idCiudadSalida: idSalida,
                idCiudadDestino: idDestino,
                fechaSalida: fechaIda,
                fechaVuelta: fechaVuelta
            }

            sessionStorage.setItem("formViaje", JSON.stringify(formViajes))
            navigate('/viajes')
        }

    }

    useEffect(() => {
        if (ciudadSalida.value != '') {
            http.get<IPage<ICiudad>>(`ciudades/${ciudadSalida.value}/like`)
                .then(resposta => {
                    setCiudadesSalida(resposta.data.content)
                })
        }
    }, [ciudadSalida])

    useEffect(() => {
        if (ciudadDestino.value != '') {
            http.get<IPage<ICiudad>>(`ciudades/${ciudadDestino.value}/like`)
                .then(resposta => {
                    setCiudadesDestino(resposta.data.content)
                })
        }
    }, [ciudadDestino])

    useEffect(() => {
        console.log('Componente form');
        console.log(formData);
        
        
        if (formData) {
            http.get<ICiudad>(`ciudades/${formData.idCiudadSalida}`)
                .then(resposta => {
                    setCiudadSalida({ value: resposta.data.nombre, erro: '' })
                })
            http.get<ICiudad>(`ciudades/${formData.idCiudadDestino}`)
                .then(resposta => {
                    setCiudadDestino({ value: resposta.data.nombre, erro: '' })
                })
            setFechaIda(formData.fechaSalida)
            setFechaVuelta(formData.fechaVuelta)

        }
    }, [])
    return (
        <form className={"max-w-5xl p-5 mx-auto shadow-xl bg-white flex items-center justify-between gap-5  rounded " + className}
            {...props}
            onSubmit={enviar}>
            <div className="w-full">
                <TextInput list="salidas" placeholder="Santa Cruz" value={ciudadSalida.value}
                    onChange={eve => setCiudadSalida({ value: eve.target.value, erro: ciudadSalida.erro })}
                    required />
                <datalist id="salidas">
                    {!(ciudadesSalida.length == 1 && ciudadesSalida[0].nombre === ciudadSalida.value) &&
                        ciudadesSalida.map(
                            ciudad => <option key={ciudad.id} value={ciudad.nombre}></option>)}
                </datalist>
                <InputError message={ciudadSalida.erro} />
            </div>
            <div className="w-full">
                <TextInput list="destinos" placeholder="Cochabamba" value={ciudadDestino.value}
                    onChange={eve => setCiudadDestino({ value: eve.target.value, erro: ciudadDestino.erro })}
                    required />
                <datalist id="destinos">
                    {!(ciudadesDestino.length == 1 && ciudadesDestino[0].nombre === ciudadDestino.value) &&
                        ciudadesDestino.map(
                            ciudad => <option key={ciudad.id} value={ciudad.nombre}></option>)}
                </datalist>
                <InputError message={ciudadDestino.erro} />
            </div>
            <div>
                <TextInput type="date" value={fechaIda} onChange={eve => setFechaIda(eve.target.value)} required />
            </div>
            <div>
                <TextInput type="date" value={fechaVuelta} onChange={eve => setFechaVuelta(eve.target.value)} required />
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