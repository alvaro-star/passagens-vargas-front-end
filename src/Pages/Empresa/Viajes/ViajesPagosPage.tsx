import PrimaryButton from "@/Components/PrimaryButton"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextInputObject from "@/Pages/Publico/Components/TextInputObject"
import ISillaFromViajeFuncionario from "./Types/ISillaFromViajeFuncionario"
import IViaje from "./Types/IViajeIndex"
import IFactura from "./Types/IFactura";
import FacturaComponent from "./Components/FacturaComponent";
import http from "@/http"
import IErrorList from "@/Types/IErrors/IErrorList"
import InputError from "@/Components/InputError"


interface IPasaje {
    carnet: string;
    nombre: string;
    nascimento: string;
    nSilla: number;
    [key: string]: string | number;
}

interface IPasajeError {
    carnet: string;
    nombre: string;
    nascimento: string;
    nSilla: string;
    [key: string]: string;
}

interface IPasajeList {
    values: IPasaje
    errors: IPasajeError
}

const tasaServicio = 0

const PassagensList = () => {
    const { id } = useParams()
    const metodos = ['EFEC']
    const [viaje, setViaje] = useState<IViaje>()
    const [pasajes, setPasajes] = useState<IPasajeList[]>([])

    const [metodo, setMetodo] = useState('EFEC')
    const [factura, setFactura] = useState<IFactura>()
    const navigate = useNavigate()

    const editar = (indexPasaje: number, campo: string, value: string) => {
        const updatedPasajes = [...pasajes];
        updatedPasajes[indexPasaje].values[campo] = value;
        setPasajes(updatedPasajes);
    }

    useEffect(() => {
        let cookie2 = sessionStorage.getItem("sillaFromViajeFuncionario")
        let cookie1 = sessionStorage.getItem("viajeSelectFuncionario")
        if (!cookie1 || !cookie2) {
            navigate(-1)
        }

        const viajeSelectFuncionario: IViaje = JSON.parse(cookie1!)
        setViaje(viajeSelectFuncionario)

        const sillasFromViajeFuncionario: ISillaFromViajeFuncionario = JSON.parse(cookie2!)

        if (sillasFromViajeFuncionario.sillas.length == 0) {
            navigate('/empresa/' + viajeSelectFuncionario.id + "/vender")
            return;
        }

        let pasajesF: IPasajeList[] = []

        let factura: IFactura = {
            total: 0, tasaServicio: 0, pasajes: []
        }

        sillasFromViajeFuncionario.sillas.forEach(nSilla => {
            pasajesF.push({
                values: {
                    carnet: '', nombre: '', nascimento: '', nSilla: nSilla
                },
                errors: {
                    carnet: '', nombre: '', nascimento: '', nSilla: ''
                }
            })
            if (sillasFromViajeFuncionario.nSillaMedio != -1 && nSilla >= sillasFromViajeFuncionario.nSillaMedio) {
                factura.pasajes.push({ nSilla: nSilla, precio: sillasFromViajeFuncionario.precio2 })
                factura.total += sillasFromViajeFuncionario.precio2
            } else {
                factura.pasajes.push({ nSilla: nSilla, precio: sillasFromViajeFuncionario.precio1 })
                factura.total += sillasFromViajeFuncionario.precio1
            }
        })
        factura.tasaServicio = factura.total * tasaServicio
        setFactura(factura)
        setPasajes(pasajesF)
    }, [id])
    const primeiraLetraMayuscula = (palavra: string) => palavra.charAt(0).toUpperCase() + palavra.slice(1);

    const enviar = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault()
        if (!viaje) {
            alert("Hubo un error en el processo")
            return;
        }
        let hasErro = 0
        let pasajeError: IPasajeError
        let updatedPasajes: IPasajeList[] = pasajes.map(pasaje => {
            pasajeError = { carnet: '', nombre: '', nascimento: '', nSilla: '' }
            if (pasaje.values.carnet === '') {
                pasajeError.carnet = 'El carnet no puede ser nulo'
                hasErro = 1
            }
            if (pasaje.values.nombre === '') {
                pasajeError.nombre = 'El nombre no puede ser nulo'
                hasErro = 1
            }
            if (pasaje.values.nascimento === '') {
                pasajeError.nascimento = 'La fecha no puede ser nulo'
                hasErro = 1
            }
            if (!pasaje.values.nSilla) {
                pasajeError.carnet = 'Hubo un error con el numero del asiento'
                hasErro = 1
            }
            return ({
                ...pasaje, errors: pasajeError
            })
        });
        if (hasErro) {
            setPasajes(updatedPasajes)
            return;
        }
        const pedido = {
            idViaje: viaje.id,
            descuento: 0,
            idLugarSalida: viaje.salida.idLugar,
            idLugarDestino: viaje.destino.idLugar,
            pasajes: pasajes.map(p => p.values),
            metodo: "EFECTIVO"//Cambiara de forma dinamica
        }

        http.post('pasajes/vender', pedido).then(response => {
            http.get(`pagos/${response.data.idFactura}/download`, { responseType: 'blob' }).then(({ data }) => {
                const blob = new Blob([data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            })
            sessionStorage.removeItem('sillaFromViajeFuncionario')
            navigate(`/empresa/viajes/${id}/vender`)
        }).catch(({ response }) => {
            if (response.data.conteudo) {
                alert(response.data.conteudo)
            } else if (response.data.errorsList.length != 0) {
                const errorsList: IErrorList = response.data.errorsList[0];
                if (errorsList.name === 'pasajes') {
                    errorsList.itens.forEach(item => {
                        item.errors.forEach(errInItem => {
                            updatedPasajes[item.index].errors[errInItem.name] = primeiraLetraMayuscula(errInItem.message);
                        });
                    });
                }
                setPasajes(updatedPasajes);
            }
        })
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
                                {pasaje.values.nSilla}
                            </div>
                        </div>
                        <div className="mt-2 relative">
                            <TextInputObject className="rounded" value={pasaje.values.nombre} onChange={e => editar(index, 'nombre', e.target.value.toUpperCase())} labelValue="Nombre" required />
                            <InputError className="absolute" message={pasaje.errors.nombre} />
                        </div>
                        <div className="w-full mt-5 grid grid-cols-2 gap-5">
                            <div className="relative">
                                <TextInputObject className="rounded" placeholder="N° de carnet" value={pasaje.values.carnet} onChange={e => editar(index, 'carnet', e.target.value)} labelValue="N° Carnet" required />
                                <InputError className="absolute" message={pasaje.errors.carnet} />
                            </div>
                            <div className="relative">
                                <TextInputObject className="rounded" type="date" value={pasaje.values.nascimento} onChange={e => editar(index, 'nascimento', e.target.value)} labelValue="Fecha de Nacimiento" required />
                                <InputError className="absolute" message={pasaje.errors.nascimento} />
                            </div>
                        </div>
                    </section>
                )}
                <section className="hidden lg:block my-5">
                    <PrimaryButton onClick={enviar} className="rounded-none">
                        Comprar Viajes
                    </PrimaryButton>
                </section>
            </section>
            {viaje && factura && <FacturaComponent viaje={viaje} metodos={metodos} metodo={metodo} setMetodo={setMetodo} factura={factura} className="w-full lg:w-96" />}
            <section className="lg:hidden mt-5 text-center">
                <PrimaryButton onClick={enviar} className="rounded-none">
                    VENDER viaje
                </PrimaryButton>
            </section>
        </div>
    )
}

export default PassagensList