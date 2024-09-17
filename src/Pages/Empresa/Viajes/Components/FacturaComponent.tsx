import { useState } from "react"
import { FaAngleDown, FaArrowRight, FaCreditCard } from "react-icons/fa"
import { PiMoney } from "react-icons/pi";
import IFactura from "../Types/IFactura"
import IViaje from "../Types/IViajeIndex"
import MetodoPagoBox from "./MetodoPagoBox"
import { IoQrCode } from "react-icons/io5";
interface Props {
    viaje: IViaje
    factura: IFactura
    metodo: string
    setMetodo: (metodo: string) => void
    className?: string
}
const FacturaComponent = ({ viaje, metodo, setMetodo, factura, className = "" }: Props) => {
    const getDataHora = (dataHora: string) => {
        let hora = dataHora.split('T')[1];
        let partes = hora.split(':')
        return `${partes[0]}:${partes[1]}`
    }
    const [mostrarViaje, setMostrarViaje] = useState(true)
    const [mostrarPrecio, setMostrarPrecio] = useState(true)
    return <section className={className}>
        <div className="w-full flex justify-between items-center bg-white p-5 text-2xl font-semibold border-t border-x border-gray-700">
            <p>Datos del Viaje</p>
            <p>
                <FaAngleDown
                    onClick={() => setMostrarViaje(!mostrarViaje)}
                    fontSize={28}
                    className={(!mostrarViaje ? "rotate-90" : "") + " cursor-pointer"}
                />
            </p>
        </div>
        <section hidden={!mostrarViaje} className="px-6 py-4 bg-white border-x border-t border-gray-700">
            <div className="w-full flex flex-col">
                <div className="flex items-center">
                    <p className="w-20 text-black text-3xl font-bold">{getDataHora(viaje.salida.dataHora)}</p>
                    <div className="w-10 flex justify-center">
                        <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
                    </div>
                    <p className="text-2xl font-semibold">{viaje?.salida.ciudad}</p>
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
                    <p className="text-2xl font-semibold">{viaje?.destino.ciudad}</p>
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
        <div className="w-full p-5 bg-white flex items-center justify-between text-2xl font-semibold border-x border-t border-gray-700">
            <p>Resumen de Factura</p>
            <p>
                <FaAngleDown
                    onClick={() => setMostrarPrecio(!mostrarPrecio)}
                    fontSize={28}
                    className={(!mostrarPrecio ? "rotate-90" : "") + " cursor-pointer"}
                />
            </p>
        </div>
        <section hidden={!mostrarPrecio} className="border-x border-t px-5 py-3 border-gray-700 bg-white">
            <div className="text-2xl font-semibold flex items-center space-x-3">
                <p>{viaje?.salida.ciudad}</p>
                <FaArrowRight />
                <p>{viaje?.destino.ciudad}</p>
            </div>
            <div className="border-b-2 border-gray-700 text-lg py-2">
                {factura.pasajes.map((pasajero, index) => <div key={index} className="font-semibold flex justify-between">
                    <p>Pasagero {index + 1} - Asiento {pasajero.nSilla}</p>
                    <p>Bs {pasajero.precio}</p>
                </div>)}
            </div>
            <div className="text-lg font-semibold flex justify-between">
                <p>Tasa de Servicio</p>
                <p>Bs {(factura.tasaServicio).toFixed(2)}</p>
            </div>
        </section>
        <div className="px-5 py-3 bg-white border border-gray-700 flex items-center justify-between text-2xl font-semibold">
            <p>
                Total:
            </p>
            <p className="font-semibold">
                Bs {(factura.tasaServicio + factura.total).toFixed(2)}
            </p>
        </div>
        <div className="px-5 py-3 bg-white border border-t-0 border-gray-700 text-center">
            <p className="text-start text-xl font-semibold mb-2">
                Elije el metodo de pago
            </p>
            <div className="grid grid-cols-1 gap-2">
                <MetodoPagoBox checked={"EFECTIVO" === metodo} clickFunction={() => setMetodo("EFECTIVO")}>
                    <PiMoney className="mx-2" />
                    <span>Efectivo</span>
                </MetodoPagoBox>
                <MetodoPagoBox checked={"DEBITO" === metodo} clickFunction={() => setMetodo("DEBITO")}>
                    <FaCreditCard className="mx-2" />
                    <span>Debito</span>
                </MetodoPagoBox>
                <MetodoPagoBox checked={"CREDITO" === metodo} clickFunction={() => setMetodo("CREDITO")}>
                    <FaCreditCard className="mx-2" />
                    <span>Credito</span>
                </MetodoPagoBox>
                <MetodoPagoBox checked={"QR" === metodo} clickFunction={() => setMetodo("QR")}>
                    <IoQrCode className="mx-2" />
                    <span>QR</span>
                </MetodoPagoBox>
            </div>
        </div>
    </section>
}

export default FacturaComponent