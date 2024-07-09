import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter";
import { useState } from "react";
import { FaAngleDown } from "react-icons/fa";
import IVIajeResponse from "../../Types/IViajeResponse"
import IPasajeList from "../Types/IPasajeList";
import IPrecio from "../Types/IPrecio";

interface Props {
    viaje: IVIajeResponse
    precio: IPrecio
    pasajes: IPasajeList[]
    metodos: string[]
}

const FacturaComponent = ({ viaje, precio, pasajes, metodos }: Props) => {
    const formatDate = (dateTime: string) => {
        const [hora, minutos] = dateTime.split('T')[1].split(':');
        return `${hora}:${minutos}`;
    };
    const [mostrarViaje, setMostrarViaje] = useState(true)
    const [mostrarPrecio, setMostrarPrecio] = useState(true)
    return <section className="w-full">
        <div className="w-full p-5 text-2xl flex items-center justify-between font-semibold rounded-t-lg border-2 border-b-0  border-gray-300">
            <p>Datos del Viaje</p>
            <p>
                <FaAngleDown
                    onClick={() => setMostrarViaje(!mostrarViaje)}
                    fontSize={28}
                    className={(!mostrarViaje ? "rotate-90" : "") + " cursor-pointer"}
                />
            </p>
        </div>
        <section hidden={!mostrarViaje} className="px-6 py-4 border-x-2 border-t-2 border-gray-300">
            <div className="w-full flex flex-col">
                <div className="flex items-center">
                    <p className="w-20 text-black text-3xl font-bold">{formatDate(viaje.salida.dataHora)}</p>
                    <div className="w-10 flex justify-center">
                        <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
                    </div>
                    <p className="text-2xl font-semibold">{capitalizeFirstLetter(viaje.salida.ciudad)}</p>
                </div>
                <div className="flex">
                    <p className="w-20"></p>
                    <div className="w-10 flex justify-center">
                        <div className="border-r-2 border-black h-24"></div>
                    </div>
                    <div>
                        <p>{capitalizeFirstLetter(viaje.salida.departamento)}, {viaje.salida.abreviacion}</p>
                        <p>{capitalizeFirstLetter(viaje.salida.lugar)}</p>
                    </div>
                </div>
                <div className="flex items-center">
                    <p className="w-20 text-black text-3xl font-bold">{formatDate(viaje.destino.dataHora)}</p>
                    <div className="w-10 flex justify-center">
                        <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
                    </div>
                    <p className="text-2xl font-semibold">{capitalizeFirstLetter(viaje.destino.ciudad)}</p>
                </div>
                <div className="flex items-center">
                    <p className="w-20 text-3xl font-bold"></p>
                    <div className="w-10 flex justify-center">
                    </div>
                    <div>
                        <p>{capitalizeFirstLetter(viaje.destino.departamento)}, {viaje.destino.abreviacion}</p>
                        <p>{capitalizeFirstLetter(viaje.destino.lugar)}</p>
                    </div>
                </div>
            </div>
        </section>
        <div className="w-full flex items-center justify-between p-5 text-2xl font-semibold border-2 border-b-0 border-gray-300">
            <p>Resumen de Factura</p>
            <p>
                <FaAngleDown
                    onClick={() => setMostrarPrecio(!mostrarPrecio)}
                    fontSize={28}
                    className={(!mostrarPrecio ? "rotate-90" : "") + " cursor-pointer"}
                />
            </p>
        </div>
        <section hidden={!mostrarPrecio} className="border-x-2 border-t-2 px-5 py-3 border-gray-300">
            <div className="border-b-2 border-gray-300 text-lg py-2">
                {pasajes.map((pasajero, index) => <div key={index} className="font-semibold flex justify-between">
                    <p>
                        Pasajero {index + 1} - Silla {pasajero.values.nSilla}
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

    </section>
}

export default FacturaComponent