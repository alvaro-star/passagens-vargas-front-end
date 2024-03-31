import { useEffect, useState } from "react"
import FormTemplate from "../../Components/FormTemplate"
import InputLabel from "../../Components/InputLabel"
import TextInput from "../../Components/TextInput"
import http from "../../http"
import IPage from "../../Types/IPage"
import ICiudad from "../../Types/ICiudad"
import InputError from "../../Components/InputError"
import IViaje from "../../Types/IViaje"
import { Link } from "react-router-dom"

const Home = () => {
    const [ciudadSalida, setCiudadSalida] = useState('')
    const [ciudadDestino, setCiudadDestino] = useState('')
    const [fechaIda, setFechaIda] = useState('')
    const [fechaVuelta, setFechaVuelta] = useState('')
    const [ciudadesSalida, setCiudadesSalida] = useState<ICiudad[]>([])
    const [ciudadesDestino, setCiudadesDestino] = useState<ICiudad[]>([])
    const [salidaErro, setSalidaErro] = useState('')
    const [destinoErro, setDestinoErro] = useState('')

    const [viajes, setViajes] = useState<IViaje[]>([])
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
            const peticao = {
                idCiudadSalida: idSalida,
                idCiudadDestino: idDestino,
                fechaSalida: fechaIda
            }
            http.post<IViaje[]>("viajes", peticao)
                .then(resposta => {
                    setViajes(resposta.data)
                }).catch(() => {
                    alert("Um erro")
                })
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

            <div className="w-full mt-5">
                <h2 className="bg-red-100 text-2xl font-bold">Viajes</h2>
                <div className="w-full">
                    {viajes.map(viaje =>
                        <div className="bg-slate-100 m-5 p-5 rounded" key={viaje.id}>
                            <section className="flex items-center">
                                <img src={viaje.logo} className="w-14 mr-3 rounded-full" />
                                <section className="text-lg flex justify-between w-full items-center">
                                    <div>
                                        <p>{viaje.salida.lugar + ', ' + viaje.salida.ciudad} </p>
                                        <p className="mt-1">{viaje.destino.lugar + ', ' + viaje.destino.ciudad} </p>
                                    </div>
                                    <div className="text-xl">
                                        {viaje.salida.dataHora.split('T')[1].split('.')[0]} - {viaje.destino.dataHora.split('T')[1].split('.')[0]}
                                    </div>
                                </section>
                            </section>
                            <div className="flex flex-col border-t mt-2 pt-2">
                                {viaje.precios.map(
                                    precio => !precio.lleno &&
                                        <div className="w-full p-1 flex items-center justify-between">
                                            <p>
                                                <b className="font-semibold">Piso</b>: {precio.nPiso}
                                            </p>
                                            <p className="font-semibold">
                                                Precio: Bs. {precio.precio}
                                            </p>
                                            <Link className="py-1 px-2 bg-blue-500 rounded text-white" to={`/viaje/${precio.id}`}>ESCOJER</Link>
                                        </div>
                                )}
                            </div>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

export default Home