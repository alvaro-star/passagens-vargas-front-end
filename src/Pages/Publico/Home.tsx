import { useEffect, useState } from "react"
import TextInput from "../../Components/TextInput"
import http from "../../http"
import IPage from "../../Types/IPage"
import ICiudad from "../../Types/ICiudad"
import InputError from "../../Components/InputError"
import { Link, useNavigate } from "react-router-dom"

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
        <div className="w-full relative flex items-center justify-center flex-col">
            <div className="w-full ">
                <div className="m-10 text-white absolute right-0 left-0 flex justify-between">
                    <div className="text-2xl font-semibold">
                        Logo
                    </div>
                    <div className="flex items-center gap-4">
                        <Link to='/registrar' className="rounded px-3 py-1.5 hover:bg-white hover:text-black">REGISTRAR</Link>
                        <Link to='/login' className="rounded bg-white text-black px-3 py-1.5">ENTRAR</Link>
                    </div>
                </div>
                <header className="w-full text-white h-96 bg-gray-500 grid place-content-center">
                    <div className="text-center">
                        <p className="text-2xl">Lorem ipsum idolor</p>
                        <p className="uppercase font-bold text-6xl">Viaje fácil</p>
                        <p className="text-2xl">Seu Portal de Passagens de Ônibus Online</p>
                    </div>
                </header>
                <section className="w-full h-16 -mt-9 absolute text-black bg-white bg-opacity-0">
                    <form className="mx-auto bg-white flex items-center justify-between gap-5 shadow-xl max-w-5xl p-5 rounded " onSubmit={enviar}>
                        <div className="w-full">
                            <TextInput list="salidas" placeholder="Santa Cruz" value={ciudadSalida} onChange={eve => setCiudadSalida(eve.target.value)} required />
                            <datalist id="salidas">
                                {!(ciudadesSalida.length == 1 && ciudadesSalida[0].nombre === ciudadSalida) &&
                                    ciudadesSalida.map(
                                        ciudad => <option key={ciudad.id} value={ciudad.nombre}></option>)}
                            </datalist>
                            <InputError message={salidaErro} />
                        </div>
                        <div className="w-full">
                            <TextInput list="destinos" placeholder="Cochabamba" value={ciudadDestino} onChange={eve => setCiudadDestino(eve.target.value)} required />
                            <datalist id="destinos">
                                {!(ciudadesDestino.length == 1 && ciudadesDestino[0].nombre === ciudadDestino) &&
                                    ciudadesDestino.map(
                                        ciudad => <option key={ciudad.id} value={ciudad.nombre}></option>)}
                            </datalist>
                            <InputError message={destinoErro} />
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
                </section>

                <section className="w-full mt-24 mx-24">
                    <h2 className="text-2xl font-bold">Principais Rotas</h2>
                    <div className="mt-2">
                        <div className="w-64 rounded shadow-xl">
                            <div className="rounded-t flex flex-col px-5 py-4">
                                <p>Santa Cruz</p>
                                <p>Potosi</p>
                            </div>
                            <div className="bg-gray-300 h-64 p-5 relative">
                                <div className="absolute bottom-0 mb-5">
                                    <p className="text-sm">A partir de </p>
                                    <p className="text-2xl font-bold">Bs 66</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer className="bg-gray-500 mt-96 w-full p-16 flex justify-between items-center gap-10">
                    <section className="w-96">
                        Redes Sociais
                    </section>
                    <div className="flex gap-16">
                        <section>
                            <h2>
                                About US
                            </h2>
                            <Link to='/sobre'>Sobre</Link>
                        </section>
                        <section>
                            <h2>
                                Contact Us
                            </h2>
                        </section>
                    </div>
                </footer>
            </div>

        </div>
    )
}

export default Home