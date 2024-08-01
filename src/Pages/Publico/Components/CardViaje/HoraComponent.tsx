import { FaArrowRightLong } from "react-icons/fa6"
import { MdTimer } from "react-icons/md"
const getDataHora = (dataHora: string) => {
    let hora = dataHora.split('T')[1];
    let partes = hora.split(':')
    return `${partes[0]}:${partes[1]}`
}
interface Props {
    horaSalida: string
    horaDestino: string
}
const HoraComponent = ({ horaSalida, horaDestino }: Props) => {
    return <div className="text-xl flex items-center">
        <MdTimer className="my-3 mr-3 text-3xl" />
        <div className="flex items-center space-x-4">
            <p className="font-semibold">Salida  </p>
            <p>
                {getDataHora(horaSalida)}
            </p>
        </div>
        <FaArrowRightLong className="mx-3 text-3xl" />
        <div className="flex items-center space-x-4">
            <p className="font-semibold">Destino  </p>
            <p>
                {getDataHora(horaDestino)}
            </p>
        </div>
    </div>
}

export default HoraComponent