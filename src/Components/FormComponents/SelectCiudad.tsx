import ICiudad from '@/Types/ICiudad';
import IPage from '@/Types/IPage';
import IType from '@/Types/IType';
import http from '@/http';
import { forwardRef, useImperativeHandle, useRef, useState } from 'react';
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
    ciudadElejida: IType | null
    setCiudadElejida: (selectedOption: IType | null) => void
}

const SelectCiudad = forwardRef(({ placeholder = '', labelValue = 'Value', ciudadElejida, setCiudadElejida }: Props, ref) => {
    const localRef = useRef<HTMLInputElement>(null);
    const [ciudades, setCiudades] = useState<IType[]>([])
    const [isInputFocused, setIsInputFocused] = useState(false)
    const handleLabelClick = () => {
        localRef.current?.focus()
        setIsInputFocused(true)
    }

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

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
                value={ciudadElejida}
                placeholder={placeholder}
                onChange={setCiudadElejida}
                options={ciudades}
                onInputChange={handleInputChange}
                onFocus={() => setIsInputFocused(true)}
                onBlur={() => setIsInputFocused(false)}
                isClearable={true}
            />
            <label onClick={handleLabelClick}
                className={`${ciudadElejida || isInputFocused ? "text-sm -translate-y-4 scale-75" : ""} ${isInputFocused ? "text-blue-500" : "text-gray-500"} absolute  rounded-t bg-white duration-300 transform top-2 z-10 origin-[0] px-2 start-1`}>{labelValue}</label>
        </div>

    )
})


export default SelectCiudad