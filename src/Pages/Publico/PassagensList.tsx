import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextInput from "../../Components/TextInput"
import InputLabel from "../../Components/InputLabel"
import PrimaryButton from "../../Components/PrimaryButton"
import http from "../../http"
import IPiso from "../../Types/IPiso"
import CardViaje from "./Components/CardViaje"
import IViaje from "../../Types/IViaje"

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
const PassagensList = () => {
    const parametros = useParams()
    const metodos = ['QR', 'DEB', 'CRE']
    const [viaje, setViaje] = useState<IViaje>()
    const [pasajes, setPasajes] = useState<IPasaje[]>([])
    const [precio, setPrecio] = useState<IPrecio>()

    const [email, setEmail] = useState('')
    const [nombre, setNombre] = useState('')
    const [telefono, setTelefono] = useState('')
    const [confirmarEmail, setConfirmarEmail] = useState('')
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
        <div className="flex justify-center items-center flex-col">
            <section className="w-full mt-5">
                {viaje && <CardViaje className="m-8" viaje={viaje} />}
            </section>
            <section className="w-full mt-8
             flex flex-col gap-5 ">
                {pasajes.map((pasaje, index) =>
                    <section key={index} className="bg-slate-200 p-5 mx-10">
                        <div className="p-2 bg-blue-300 w-10 h-10 grid place-content-center rounded border border-blue-500">
                            {pasaje.nSilla}
                        </div>
                        <div className="mt-2">
                            <InputLabel>Nombre</InputLabel>
                            <TextInput placeholder="Nombre del pasajero..." value={pasaje.nombre} onChange={eve => editar(index, 'nombre', eve.target.value)} />
                        </div>
                        <TextInput hidden></TextInput>
                        <div className="w-full mt-2 grid grid-cols-2 gap-5">
                            <div>
                                <InputLabel>Carnet</InputLabel>
                                <TextInput placeholder="N° de carnet" value={pasaje.carnet} onChange={eve => editar(index, 'carnet', eve.target.value)} />
                            </div>
                            <div>
                                <InputLabel>Nascimento</InputLabel>
                                <TextInput type="date" value={pasaje.nascimento} onChange={eve => editar(index, 'nascimento', eve.target.value)} />
                            </div>
                        </div>
                    </section>
                )}
            </section>
            <section className="w-full mt-8">
                <div className="mx-10 bg-slate-200 rounded p-5">
                    <p className="text-xl font-semibold mb-2">
                        Detalhes del contacto
                    </p>
                    <div className="">
                        <div className="mt-2 w-full">
                            <InputLabel value="Nombre" />
                            <TextInput value={nombre} onChange={e => setNombre(e.target.value)} placeholder="Escribe el nombre del comprador (inecessario)..." />
                        </div>
                        <div className="mt-2 w-full">
                            <InputLabel value="Emial" />
                            <TextInput value={email} onChange={e => setEmail(e.target.value)} placeholder="Escribe el email del comprador..." />
                        </div>
                        <div className="mt-2 w-full">
                            <InputLabel value="Confirmar Email" />
                            <TextInput value={confirmarEmail} onChange={e => setConfirmarEmail(e.target.value)} placeholder="Escribe nuevamente el email" />
                        </div>
                        <div className="mt-2 w-full">
                            <InputLabel value="Telefono" />
                            <TextInput value={telefono} onChange={e => setTelefono(e.target.value)} placeholder="Escribe el telefono del comprador..." />
                        </div>
                    </div>
                </div>
            </section>
            <section className="my-5">
                <PrimaryButton onClick={enviar}>
                    Mandar Dados
                </PrimaryButton>
            </section>
            {precio && <section className="w-full">
                <div className="bg-slate-300 rounded p-5 m-5">
                    <div className="flex items-center justify-between">
                        <p>
                            Metodo de pago
                        </p>
                        <p className="font-semibold text-lg">
                            Total: Bs {precio.precio * pasajes.length}
                        </p>
                    </div>
                    <div className="flex justify-center gap-2 mt-2">
                        {metodos.map((metodo, index) =>
                            <div key={index} className="w-10 h-10 bg-white rounded font-bold flex items-center justify-center
                            hover:bg-black hover:text-white">
                                {metodo}
                            </div>
                        )}
                    </div>
                </div>
            </section>}
        </div>
    )
}

export default PassagensList