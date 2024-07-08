import { eachDayOfInterval } from 'date-fns';

import './TimeLine.css'
const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface Props {
    fechaSalida: Date,
    clickOtherDay: (fechaNueva: Date | null) => void
}
const TimeLine = ({ fechaSalida, clickOtherDay }: Props) => {
    const currentDate = new Date();

    const datasIguais = (data1: Date, data2: Date): boolean => {
        return data1.getFullYear() == data2.getFullYear() && data1.getMonth() == data2.getMonth() && data1.getDate() == data2.getDate()
    }
    const dataFinal = new Date(currentDate);
    dataFinal.setDate(currentDate.getDate() + 14)
    const allDays = eachDayOfInterval({ start: currentDate, end: dataFinal });

    return (
        <div className="bg-gray-300 p-5 rounded">
            <div className='flex space-x-9 rounded overflow-x-auto hide-scrollbar'>
                {allDays.map((data, index) => {
                    let styleDate = datasIguais(fechaSalida, data) ? ' font-semibold' : '';
                    return <p key={index} onClick={() => clickOtherDay(data)} className={'text-xl whitespace-nowrap cursor-pointer ' + styleDate}>
                        {diasSemana[data.getDay()]} {data.getDate()} {meses[data.getMonth()]}
                    </p>
                }
                )}
            </div>
        </div>

    )
}

export default TimeLine
