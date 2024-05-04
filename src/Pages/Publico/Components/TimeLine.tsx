import { startOfWeek, endOfWeek, eachDayOfInterval } from 'date-fns';
const meses = [
    'Ene',
    'Feb',
    'Mar',
    'Abr',
    'May',
    'Jun',
    'Jul',
    'Ago',
    'Sep',
    'Oct',
    'Nov',
    'Dic'
];

const diasSemana = [
    'Domingo',
    'Lunes',
    'Martes',
    'Miércoles',
    'Jueves',
    'Viernes',
    'Sábado'
];

const TimeLine = () => {
    const currentDate = new Date();

    const startOfWeekDate = startOfWeek(currentDate);
    const endOfWeekDate = endOfWeek(currentDate);

    const daysOfWeek = eachDayOfInterval({ start: startOfWeekDate, end: endOfWeekDate });

    return (
        <div className="bg-gray-300 p-5 flex space-x-7 rounded">
            {daysOfWeek.map((data, index) =>
                <div key={index} className={'text-xl'}>
                    {diasSemana[data.getDay()]} {data.getDate()} {meses[data.getMonth()]}
                </div>
            )}
        </div>
    )
}

export default TimeLine