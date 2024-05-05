import { startOfWeek, endOfWeek, eachDayOfInterval, addWeeks } from 'date-fns';

import './TimeLine.css'
const meses = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

const diasSemana = ['Domingo', 'Lunes', 'Martes', 'Miércoles', 'Jueves', 'Viernes', 'Sábado'];

interface Props {
    fechaSalida: Date
}
const TimeLine = ({ fechaSalida }: Props) => {
    const currentDate = new Date();

    // Adiciona duas semanas à data atual
    const twoWeeksLater = addWeeks(currentDate, 2);

    const datasIguais = (data1: Date, data2: Date): boolean => {
        return data1.getFullYear() == data2.getFullYear() && data1.getMonth() == data2.getMonth() && data1.getDate() == data2.getDate()
    }
    // Obtém o início e o fim da semana para a data atual e para duas semanas depois
    const startOfWeekDate = startOfWeek(currentDate);
    const endOfWeekDate = endOfWeek(currentDate);
    const startOfNextTwoWeeks = startOfWeek(twoWeeksLater);
    const endOfNextTwoWeeks = endOfWeek(twoWeeksLater);

    // Obtém os dias de cada semana
    const daysOfWeekCurrentWeek = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });
    const daysOfWeekNextTwoWeeks = eachDayOfInterval({ start: startOfNextTwoWeeks, end: endOfNextTwoWeeks });

    const allDays = [...daysOfWeekCurrentWeek, ...daysOfWeekNextTwoWeeks];

    return (
        <div className="bg-gray-300 p-5 rounded">
            <div className='flex space-x-9 rounded overflow-x-auto hide-scrollbar'>
                {allDays.map((data, index) => {
                    let styleDate = datasIguais(fechaSalida, data) ? ' font-semibold' : '';
                    return <p key={index} className={'text-xl whitespace-nowrap' + styleDate}>
                        {diasSemana[data.getDay()]} {data.getDate()} {meses[data.getMonth()]}
                    </p>
                }
                )}
            </div>
        </div>

    )
}

export default TimeLine
