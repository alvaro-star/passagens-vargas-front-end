import DatePicker, { registerLocale } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";

import { es } from 'date-fns/locale/es';
registerLocale('es', es)
interface Props {
    labelValue?: string
    dataExtern: Date | null
    setDataExtern: (dateNew: Date | null) => void
}

const DatePickerCostumized = ({ labelValue = "value", dataExtern, setDataExtern }: Props) => {

    return (
        <div className="relative">
            <DatePicker
                selected={dataExtern}
                onChange={setDataExtern}
                locale="es"
                minDate={new Date()}
                className="block px-2.5 py-2.5 w-44 h-11 text-gray-900 bg-white rounded border border-gray-400 appearance-none focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 peer"
                dateFormat="dd/MM/yyyy"
            />
            <label
                className="absolute text-sm text-gray-500 rounded-t bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">{labelValue}</label>
        </div>
    );
};

export default DatePickerCostumized;
