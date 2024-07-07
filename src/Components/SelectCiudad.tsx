import ICiudad from '@/Types/ICiudad';
import IPage from '@/Types/IPage';
import IType from '@/Types/IType';
import http from '@/http';
import { useState } from 'react';
import Select, { StylesConfig } from 'react-select';
import capitalizeFirstLetter from '@/Helpers/CapitalizeFirstLetter';


const customStyles: StylesConfig<IType, false> = {
    control: (provided, state) => ({
        ...provided,
        border: state.isFocused ? '1px solid blue' : '1px solid rgb(156 163 175/1)',
        padding: '2px'
    }),

};

interface Props {
    labelValue: string
    placeholder?: string
    option: IType | null
    setOption: (selectedOption: IType | null) => void
}

const SelectCiudad = ({ placeholder = '', labelValue = 'Value', option, setOption }: Props) => {
    const [ciudades, setCiudades] = useState<IType[]>([])

    const handleInputChange = (inputValue: string) => {
        if (inputValue.length > 2) {
            http.get<IPage<ICiudad>>(`ciudades/${inputValue}/like`)
                .then(resposta => {
                    setCiudades(resposta.data.content.map(ciudad => ({ value: ciudad.id, label: capitalizeFirstLetter(ciudad.nombre) })))
                })
        }
    };

    return (
        <div className='relative'>
            <Select
                noOptionsMessage={() => "Escribe 3 Letras"}
                styles={customStyles}
                className=''
                value={option}
                placeholder={placeholder}
                onChange={setOption}
                options={ciudades}
                onInputChange={handleInputChange}
            />
            <label
                className="absolute text-sm text-gray-500 rounded-t bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">{labelValue}</label>
        </div>

    )
}


export default SelectCiudad