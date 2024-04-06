import { useEffect, useState } from "react"
import FormTemplate from "../../Components/FormTemplate"
import InputLabel from "../../Components/InputLabel"
import TextInput from "../../Components/TextInput"
import http from "../../http"
import IPage from "../../Types/IPage"
import ICiudad from "../../Types/ICiudad"
import InputError from "../../Components/InputError"
import { useNavigate } from "react-router-dom"

const Home = () => {
    const [ciudadSalida, setCiudadSalida] = useState('')
    const [ciudadDestino, setCiudadDestino] = useState('')
    const [fechaIda, setFechaIda] = useState('')
    const [fechaVuelta, setFechaVuelta] = useState('')
    const [ciudadesSalida, setCiudadesSalida] = useState<ICiudad[]>([])
    const [ciudadesDestino, setCiudadesDestino] = useState<ICiudad[]>([])
    const [salidaErro, setSalidaErro] = useState('')
    const [destinoErro, setDestinoErro] = useState('')

    const navigate = useNavigate()
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        setSalidaErro('')
        setDestinoErro('')
        if (ciudadSalida === ciudadDestino) {
            setSalidaErro('La salida es igual al destino')
            setDestinoErro('El destino es igual ala salida')
        }

        let idSalida = -1
        ciudadesSalida.forEach((ci) => {
            if (ci.nombre === ciudadSalida) {
                idSalida = ci.id
            }
        })

        let idDestino = -1
        ciudadesDestino.forEach((ci) => {
            if (ci.nombre === ciudadDestino) {
                idDestino = ci.id
            }
        })

        if (idSalida == -1) {
            setSalidaErro('Escribe una ciudad válido')
        }

        if (idDestino == -1) {
            setDestinoErro('Escribe una ciudad válido')
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
        if (ciudadSalida != '') {
            http.get<IPage<ICiudad>>(`ciudades/${ciudadSalida}/like`)
                .then(resposta => {
                    setCiudadesSalida(resposta.data.content)
                })
        }
    }, [ciudadSalida])

    useEffect(() => {
        if (ciudadDestino != '') {
            http.get<IPage<ICiudad>>(`ciudades/${ciudadDestino}/like`)
                .then(resposta => {
                    setCiudadesDestino(resposta.data.content)
                })
        }
    }, [ciudadDestino])

    return (
        <div className="flex items-center justify-center flex-col">
            <FormTemplate className="mt-10" onSubmit={enviar}>
                <h2>
                    Busca tu viaje
                </h2>
                <div className="w-full mt-2">
                    <InputLabel value="Origen" />
                    <TextInput list="salidas" placeholder="Santa Cruz" value={ciudadSalida} onChange={eve => setCiudadSalida(eve.target.value)} required />
                    <datalist id="salidas">
                        {!(ciudadesSalida.length == 1 && ciudadesSalida[0].nombre === ciudadSalida) &&
                            ciudadesSalida.map(
                                ciudad => <option key={ciudad.id} value={ciudad.nombre}></option>)}
                    </datalist>
                    <InputError message={salidaErro} />
                </div>
                <div className="w-full mt-2">
                    <InputLabel value="Destino" />
                    <TextInput list="destinos" placeholder="Cochabamba" value={ciudadDestino} onChange={eve => setCiudadDestino(eve.target.value)} required />
                    <datalist id="destinos">
                        {!(ciudadesDestino.length == 1 && ciudadesDestino[0].nombre === ciudadDestino) &&
                            ciudadesDestino.map(
                                ciudad => <option key={ciudad.id} value={ciudad.nombre}></option>)}
                    </datalist>
                    <InputError message={destinoErro} />
                </div>
                <div className="w-full mt-2 grid grid-cols-2 gap-3">
                    <div className="">
                        <InputLabel className="w-full" value="Fecha de Ida" />
                        <TextInput type="date" value={fechaIda} onChange={eve => setFechaIda(eve.target.value)} required />
                    </div>
                    <div className="">
                        <InputLabel className="w-full" value="Fecha de Ida" />
                        <TextInput type="date" value={fechaVuelta} onChange={eve => setFechaVuelta(eve.target.value)} required />
                    </div>
                </div>
            </FormTemplate>
        </div>
    )
}

export default Home