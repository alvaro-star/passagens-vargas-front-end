import PrimaryButton from "@/Components/PrimaryButton"
import { IoClose } from "react-icons/io5"
import ISillaType from "../Types/ISillaType"
import http from "@/http"

interface Props {
    className?: string
    silla: ISillaType
    setSillaElegido: (pasajero: null | ISillaType) => void
}
const PasajeroCard = ({ silla,className="", setSillaElegido }: Props) => {
    const downloadPasaje = () => {
        if (!silla.pasajero)
            return
        http.get(`pasajes/${silla.pasajero.id}/download`, { responseType: 'blob' })
            .then(response => {
                const url = window.URL.createObjectURL(new Blob([response.data]));
                const link = document.createElement('a');
                link.href = url;
                link.setAttribute('download', 'pasajero.pdf');
                document.body.appendChild(link);
                link.click();
                document.body.removeChild(link);
            })
            .catch(error => {
                console.error('Erro ao baixar o PDF:', error);
            });
    }
    return <div className={"w-64 bg-slate-300 p-5 " +className}>
        <div className="flex items-center justify-between">
            <p className="font-semibold text-lg">
                Datos del pasajero
            </p>
            <button className="bg-red-500 h-8 w-8 text-white rounded flex items-center justify-center" onClick={() => setSillaElegido(null)}>
                <IoClose className="text-xl" />
            </button>
        </div>
        <p>
            Asiento: {silla.numero}
        </p>
        <p>
            Nombre: {silla.pasajero?.nombre}
        </p>
        <p>
            Carnet: {silla.pasajero?.carnet}
        </p>
        <p>
            Salida: {silla.pasajero?.salida.ciudad}
        </p>
        <p>
            Destino: {silla.pasajero?.destino.ciudad}
        </p>
        <div className="w-full text-center">
            <PrimaryButton className="rounded-none" onClick={downloadPasaje}>
                DESCARGAR pasaje
            </PrimaryButton>
        </div>
    </div>
}

export default PasajeroCard