import PrimaryButton from "@/Components/Buttons/PrimaryButton"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import { IoClose } from "react-icons/io5"
import ISillaType from "../Types/ISillaType"


interface Props {
    className?: string
    silla: ISillaType
    downloadPasaje: (id: string | number) => void
    setSillaElegido: (pasajero: null | ISillaType) => void
}
const PasajeroCard = ({ silla, className = "", setSillaElegido, downloadPasaje }: Props) => {
    const clickButton = (silla: ISillaType) => {
        if (silla.pasajero) {
            downloadPasaje(silla.pasajero.id)
        }
    }
    return <div className={"w-96 bg-slate-300 p-5 " + className}>
        <div className="flex items-center justify-between">
            <p className="font-semibold text-lg">
                Datos del pasajero
            </p>
            <button className="bg-red-500 h-8 w-8 text-white rounded flex items-center justify-center" onClick={() => setSillaElegido(null)}>
                <IoClose className="text-xl" />
            </button>
        </div>

        <table className="w-full p-2">
            <tbody>
                <tr>
                    <td>N Asiento:</td>
                    <td className="text-end">{silla.numero}</td>
                </tr>
                <tr>
                    <td>Nombre:</td>
                    <td className="text-end">{silla.pasajero?.nombre}</td>
                </tr>
                <tr>
                    <td>Carnet:</td>
                    <td className="text-end"> {silla.pasajero?.carnet}</td>
                </tr>
                <tr>
                    <td>Salida:</td>
                    <td className="text-end"> {capitalizeFirstLetter(silla.pasajero!.salida.ciudad)}</td>
                </tr>
                <tr>
                    <td>Destino:</td>
                    <td className="text-end"> {capitalizeFirstLetter(silla.pasajero!.destino.ciudad)}</td>
                </tr>
            </tbody>
        </table>
        <p>

        </p>
        <div className="w-full text-center mt-2">
            <PrimaryButton className="rounded-none" onClick={() => clickButton(silla)}>
                DESCARGAR pasaje
            </PrimaryButton>
        </div>
    </div>
}

export default PasajeroCard