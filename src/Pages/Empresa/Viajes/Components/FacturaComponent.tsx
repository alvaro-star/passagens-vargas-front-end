import { FaArrowRight } from "react-icons/fa"
import IFactura from "../Types/IFactura"
import IViaje from "../Types/IViajeIndex"
interface Props {
    viaje: IViaje
    factura: IFactura
    metodos: string[]
    className?: string
}
const FacturaComponent = ({ viaje, metodos, factura, className = "" }: Props) => {
    const getDataHora = (dataHora: string) => {
        let hora = dataHora.split('T')[1];
        let partes = hora.split(':')
        return `${partes[0]}:${partes[1]}`
    }
    return <section className={className}>
        <div className="w-full bg-white p-5 text-2xl font-semibold border border-gray-700">Datos del Viaje</div>
        <section className="px-6 py-4 bg-white border-x border-gray-700">
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
        <div className="w-full p-5 bg-white text-2xl font-semibold border border-gray-700">
            Resumen de Factura
        </div>

        <section className="border-x px-5 py-3 border-gray-700 bg-white">
            <div className="text-2xl font-semibold flex items-center space-x-3">
                <p>{viaje?.salida.ciudad}</p>
                <FaArrowRight />
                <p>{viaje?.destino.ciudad}</p>
            </div>
            <div className="border-b-2 border-gray-700 text-lg py-2">
                {factura.pasajes.map((pasajero, index) => <div key={index} className="font-semibold flex justify-between">
                    <p>
                        Pasajero {index + 1} - Silla {pasajero.nSilla}
                    </p>
                    <p>
                        Bs {pasajero.precio}
                    </p>
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
            <p className="text-lg font-semibold mb-2">
                Método de Pago
            </p>
            <div className="flex justify-center gap-2">
                {metodos.map((metodo, index) =>
                    <div key={index} className="w-10 h-10 cursor-pointer bg-slate-300 rounded  font-bold flex items-center justify-center hover:bg-black hover:text-white">
                        {metodo}
                    </div>
                )}
            </div>
        </div>
    </section>
}

export default FacturaComponent