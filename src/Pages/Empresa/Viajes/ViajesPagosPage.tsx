import PrimaryButton from "@/Components/PrimaryButton"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextInput234 from "@/Components/TextInput234"
import TextInputObject from "@/Pages/Publico/Components/TextInputObject"
import ISillaFromViajeFuncionario from "./Types/ISillaFromViajeFuncionario"
import IViaje from "./Types/IViajeIndex"
import IFactura from "./Types/IFactura";
import FacturaComponent from "./Components/FacturaComponent";

interface IPasaje {
    carnet: string;
    nombre: string;
    nascimento: string;
    nSilla: number;
    [key: string]: string | number;
}
const tasaServicio = 0.1

const PassagensList = () => {
    const { id } = useParams()
    const metodos = ['QR', 'EFEC']
    const [viaje, setViaje] = useState<IViaje>()
    const [pasajes, setPasajes] = useState<IPasaje[]>([])

    const [factura, setFactura] = useState<IFactura>()
    const [email, setEmail] = useState<string>('')
    const [nombre, setNombre] = useState<string>('')
    const [telefono, setTelefono] = useState<string>('')
    const [confirmarEmail, setConfirmarEmail] = useState<string>('')
    const navigate = useNavigate()

    const editar = (indexPasaje: number, campo: string, value: string) => {
        let pasajesF = [...pasajes]
        pasajesF[indexPasaje][campo] = value
        setPasajes(pasajesF)

    }

    useEffect(() => {
        let cookie2 = sessionStorage.getItem("sillaFromViajeFuncionario")
        console.log(cookie2);

        let cookie1 = sessionStorage.getItem("viajeSelectFuncionario")
        if (!cookie1 || !cookie2) {
            console.log("Nao ha nada");

        }

        const viajeSelectFuncionario: IViaje = JSON.parse(cookie1!)
        setViaje(viajeSelectFuncionario)

        const sillasFromViajeFuncionario: ISillaFromViajeFuncionario = JSON.parse(cookie2!)

        if (sillasFromViajeFuncionario.sillas.length == 0)
            navigate('/empresa/' + viajeSelectFuncionario.id + "/vender")

        let pasajesF: IPasaje[] = []

        let factura: IFactura = {
            total: 0,
            tasaServicio: 0,
            pasajes: []
        }

        console.log(sillasFromViajeFuncionario);

        sillasFromViajeFuncionario.sillas.forEach(nSilla => {
            pasajesF.push({
                carnet: '',
                nombre: '',
                nascimento: '',
                nSilla: nSilla
            })
            if (sillasFromViajeFuncionario.nSillaMedio != -1 && nSilla >= sillasFromViajeFuncionario.nSillaMedio) {
                factura.pasajes.push({
                    nSilla: nSilla,
                    precio: sillasFromViajeFuncionario.precio2
                })
                factura.total += sillasFromViajeFuncionario.precio2
            } else {
                factura.pasajes.push({
                    nSilla: nSilla,
                    precio: sillasFromViajeFuncionario.precio1
                })
                factura.total += sillasFromViajeFuncionario.precio1
            }
        })
        factura.tasaServicio = factura.total * tasaServicio

        setFactura(factura)
        setPasajes(pasajesF)
    }, [id])

    const enviar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        console.log("Ainda nao configurado ");

        return/*
        const pasaje = {
            idPrecio: precio?.id,
            descuento: 0,
            contacto: {
                nombre,
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
        })*/
    }
    return (
        <div className="text-gray-900 flex flex-col max-w-7xl mx-auto lg:flex-row justify-center py-10 bg-gray-100 gap-4">
            <section className="w-full lg:w-3/4 flex flex-col items-center space-y-5">
                {pasajes.map((pasaje, index) =>
                    <section
                        key={index}
                        className="w-full bg-white border border-gray-700 p-5">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-2xl font-semibold">Pasagero {index + 1}</p>
                            <div className="p-2 bg-blue-300 w-10 h-10 grid place-content-center rounded border border-blue-500">
                                {pasaje.nSilla}
                            </div>
                        </div>
                        <div className="mt-2">
                            <TextInputObject className="rounded-lg" value={pasaje.nombre} onChange={eve => editar(index, 'nombre', eve.target.value)} labelValue="Nombre" />
                        </div>
                        <div className="w-full mt-2 grid grid-cols-2 gap-5">
                            <TextInputObject className="rounded-lg" placeholder="N° de carnet" value={pasaje.carnet} onChange={eve => editar(index, 'carnet', eve.target.value)} labelValue="N° Carnet" />
                            <TextInputObject className="rounded-lg" type="text" value={pasaje.nascimento} onChange={eve => editar(index, 'nascimento', eve.target.value)} labelValue="Nascimiento dd/mm/aaaa" />
                        </div>
                    </section>
                )}

                <section className="w-full bg-white">
                    <div className="border border-gray-700 p-5">
                        <p className="text-2xl font-semibold mb-2">
                            Detalhes del contacto
                        </p>
                        <div className="grid grid-cols-2 gap-4">
                            <TextInput234 value={nombre} setValue={setNombre} labelValue="Nombre" />
                            <TextInput234 value={telefono} setValue={setTelefono} labelValue="Telefono" />
                            <TextInput234 value={email} setValue={setEmail} labelValue="E-mail" />
                            <TextInput234 value={confirmarEmail} setValue={setConfirmarEmail} labelValue="Confirmar Email" />
                        </div>
                    </div>
                </section>
                <section className="hidden lg:block my-5">
                    <PrimaryButton onClick={enviar} className="rounded-none">
                        Comprar Viajes
                    </PrimaryButton>
                </section>
            </section>
            {viaje && factura && <FacturaComponent viaje={viaje} metodos={metodos} factura={factura} className="w-full lg:w-96" />}
            <section className="lg:hidden mt-5 text-center">
                <PrimaryButton onClick={enviar} className="rounded-none">
                    Comprar Viajes
                </PrimaryButton>
            </section>
        </div>
    )
}

export default PassagensList