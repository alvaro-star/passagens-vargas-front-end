import InputLabel from "@/Components/InputLabel"
import PrimaryButton from "@/Components/PrimaryButton"
import IPiso from "@/Types/IPiso"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextInput234 from "@/Components/TextInput234"
import IVIajeResponse from "./Types/IViajeResponse"
import TextInputObject from "./Components/TextInputObject"

interface IPasaje {
    carnet: string
    nombre: string
    nascimento: string
    nSilla: number
}

interface IPrecio {
    id: string,
    precio: number,
    nPiso: number,
    lleno: boolean,
    nSillasDisponibles: number,
    piso: IPiso
    sillasOcupadas: number[],
    idViaje: number
}

interface Erros {
    email: string
    nombre: string
    telefono: string
    confirmarEmail: string
}

const PassagensList = () => {
    const parametros = useParams()
    const metodos = ['QR', 'DEB', 'CRE']
    const [viaje, setViaje] = useState<IVIajeResponse>()
    const [pasajes, setPasajes] = useState<IPasaje[]>([])
    const [precio, setPrecio] = useState<IPrecio>()

    const [email, setEmail] = useState<string>('')
    const [nombre, setNombre] = useState<string>('')
    const [telefono, setTelefono] = useState<string>('')
    const [confirmarEmail, setConfirmarEmail] = useState<string>('')
    const navigate = useNavigate()
    const editar = (indexPasaje: number, campo: string, value: string) => {
        let achei = 1
        let pasajesF = [...pasajes]
        switch (campo) {
            case "carnet":
                pasajesF[indexPasaje].carnet = value
                break
            case "nombre":
                pasajesF[indexPasaje].nombre = value
                break
            case "nascimento":
                pasajesF[indexPasaje].nascimento = value
                break
            default:
                achei = 0
                break
        }
        if (achei) {
            setPasajes(pasajesF)
        }
    }

    const getDataHora = (dataHora: string) => {
        let hora = dataHora.split('T')[1];
        let partes = hora.split(':')
        return `${partes[0]}:${partes[1]}`
    }

    useEffect(() => {
        let cookie2 = sessionStorage.getItem("sillasFromViaje")
        let cookie1 = sessionStorage.getItem("viajeData")
        let sillasEscogidas = cookie2 ? cookie2 : ''
        let cookieJSON = cookie1 ? cookie1 : ''
        if (cookie1 === '') {
            navigate('/')
        }

        const viajeS = JSON.parse(cookieJSON)
        setViaje(viajeS)


        if (sillasEscogidas == '') {
            navigate('/')
        }
        else {
            let pasajesF: IPasaje[] = []
            sillasEscogidas.split(',').forEach(nSilla => {
                pasajesF.push({
                    carnet: '',
                    nombre: '',
                    nascimento: '',
                    nSilla: parseInt(nSilla)
                })
            })

            setPasajes(pasajesF)
            if (parametros.id) {
                http.get<IPrecio>(`precios/${parametros.id}/vender`)
                    .then(resposta => {
                        setPrecio(resposta.data)
                    })
            } else {
                navigate('/')
            }
        }
    }, [])

    const enviar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        const pasaje = {
            idPrecio: precio?.id,
            descuento: 0,
            contacto: {
                email,
                telefono
            },
            idLugarSalida: viaje?.salida.idLugar,
            idLugarDestino: viaje?.destino.idLugar,
            pasajes: pasajes
        }
        http.post('pasajes', pasaje).then(response => {
            if (response.status == 200 || response.status == 201) {
                sessionStorage.removeItem('sillasFromViaje')
                sessionStorage.removeItem('viajeData')
                console.log(response.data);
                alert("Registrado con exito")
            }
        }).catch(erro => {
            console.log(erro);
        })
    }
    return (
        <div className="text-gray-900 flex justify-center px-20 py-10 bg-gray-100 gap-4">
            <section className="w-3/4 flex flex-col items-center gap-10">
                {pasajes.map((pasaje, index) =>
                    <section
                        key={index}
                        className="w-full border-2 border-gray-300 rounded-lg p-5">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-2xl font-semibold">Pasagero</p>
                            <div className="p-2 bg-blue-300 w-10 h-10 grid place-content-center rounded border border-blue-500">
                                {pasaje.nSilla}
                            </div>
                        </div>
                        <div className="mt-2">
                            <InputLabel>Nombre</InputLabel>
                            <TextInputObject className="rounded-lg" placeholder="Nombre del pasajero..." value={pasaje.nombre} onChange={eve => editar(index, 'nombre', eve.target.value)} />
                        </div>
                        <div className="w-full mt-2 grid grid-cols-2 gap-5">
                            <div>
                                <InputLabel>N°Carnet</InputLabel>
                                <TextInputObject placeholder="N° de carnet" value={pasaje.carnet} onChange={eve => editar(index, 'carnet', eve.target.value)} />
                            </div>
                            <div>
                                <InputLabel>Nascimento</InputLabel>
                                <TextInputObject type="date" value={pasaje.nascimento} onChange={eve => editar(index, 'nascimento', eve.target.value)} />
                            </div>
                        </div>
                    </section>
                )}

                <section className="w-full">
                    <div className="border-2 border-gray-300 rounded-lg p-5">
                        <p className="text-2xl font-semibold mb-2">
                            Detalhes del contacto
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="w-full">
                                <InputLabel value="Nombre" />
                                <TextInput234 value={nombre} setValue={setNombre} placeholder="Escribe el nombre del comprador (inecessario)..." />
                            </div>
                            <div className="w-full">
                                <InputLabel value="Telefono" />
                                <TextInput234 value={telefono} setValue={setTelefono} placeholder="Escribe el telefono del comprador..." />
                            </div>
                            <div className="w-full">
                                <InputLabel value="E-mail" />
                                <TextInput234 value={email} setValue={setEmail} placeholder="Escribe el email del comprador..." />
                            </div>
                            <div className="w-full">
                                <InputLabel value="Confirmar Email" />
                                <TextInput234 value={confirmarEmail} setValue={setConfirmarEmail} placeholder="Escribe nuevamente el email" />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="my-5">
                    <PrimaryButton onClick={enviar}>
                        Mandar Dados
                    </PrimaryButton>
                </section>
            </section>
            <section className="w-96 ">
                <div className="w-full p-5 text-2xl font-semibold rounded-t-lg border-2 border-gray-300">Datos del Viaje</div>
                {viaje &&
                    <section className="px-6 py-4 border-x-2 border-gray-300">
                        <div className="w-full flex flex-col">
                            <div className="flex items-center">
                                <p className="w-20 text-black text-3xl font-bold">{getDataHora(viaje?.salida.dataHora)}</p>
                                <div className="w-10 flex justify-center">
                                    <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
                                </div>
                                <td className="text-2xl font-semibold">{viaje?.salida.ciudad}</td>
                            </div>
                            <div className="flex">
                                <p className="w-20"></p>
                                <div className="w-10 flex justify-center">
                                    <div className="border-r-2 border-black h-24">
                                    </div>
                                </div>
                                <div>
                                    <p>{viaje?.salida.departamento}, {viaje?.salida.abreviacion}</p>
                                    <p>{viaje?.salida.lugar}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <p className="w-20 text-black text-3xl font-bold">{getDataHora(viaje?.destino.dataHora)}</p>
                                <div className="w-10 flex justify-center">
                                    <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
                                </div>
                                <td className="text-2xl font-semibold">{viaje?.destino.ciudad}</td>
                            </div>
                            <div className="flex items-center">
                                <p className="w-20 text-3xl font-bold"></p>
                                <div className="w-10 flex justify-center">
                                </div>
                                <div>
                                    <p>{viaje?.destino.departamento}, {viaje?.destino.abreviacion}</p>
                                    <p>{viaje?.destino.lugar}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                }
                <div className="w-full p-5 text-2xl font-semibold border-2 border-gray-300">
                    Resumen de Factura
                </div>
                {precio &&
                    <>
                        <section className="border-x-2 px-5 py-3 border-gray-300">
                            <p className="text-2xl font-semibold">
                                {viaje?.salida.ciudad + ' -> ' + viaje?.destino.ciudad}
                            </p>
                            <div className="border-b-2 border-gray-300 text-lg py-2">
                                {pasajes.map((pasajero, index) => <div className="font-semibold flex justify-between">
                                    <p>
                                        Pasajero {index + 1} - Silla {pasajero.nSilla}
                                    </p>
                                    <p>Bs {precio.precio.toFixed(2)}</p>
                                </div>)}
                            </div>
                            <div className="text-lg font-semibold flex justify-between">
                                <p>
                                    Tasa de Servicio
                                </p>
                                <p>
                                    Bs {(precio.precio * pasajes.length * 0.1).toFixed(2)}
                                </p>
                            </div>
                        </section>
                        <div className="px-5 py-3 border-2 border-gray-300 flex items-center justify-between text-2xl font-semibold">
                            <p>
                                Total:
                            </p>
                            <p className="font-semibold">
                                Bs {(precio.precio * pasajes.length * 1.1).toFixed(2)}
                            </p>
                        </div>
                        <div className="px-5 py-3 border-2 border-t-0 rounded-b-lg border-gray-300 text-center">
                            <p className="text-lg font-semibold mb-2">
                                Método de Pago
                            </p>
                            <div className="flex justify-center gap-2">
                                {metodos.map((metodo, index) =>
                                    <div key={index} className="w-10 h-10 bg-white rounded font-bold flex items-center justify-center hover:bg-black hover:text-white">
                                        {metodo}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                }
            </section>
        </div>
    )
}

export default PassagensList