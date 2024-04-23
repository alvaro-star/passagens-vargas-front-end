import ICiudad from '@/Types/ICiudad';
import IPage from '@/Types/IPage';
import IType from '@/Types/IType';
import http from '@/http';
import { useState } from 'react';
import Select, { StylesConfig } from 'react-select';

const customStyles: StylesConfig<IType, false> = {
    control: (provided, state) => ({
        ...provided,
        border: state.isFocused ? '1px solid blue' : '1px solid #ccc',
        padding: '2px'
    })
};

interface Props {
    option: IType | null
    setOption: (selectedOption: IType | null) => void
}

const SelectCiudad = ({ option, setOption }: Props) => {
    const [ciudades, setCiudades] = useState<IType[]>([])
    
    const handleInputChange = (inputValue: string) => {
        if (inputValue.length > 2) {
            http.get<IPage<ICiudad>>(`ciudades/${inputValue}/like`)
                .then(resposta => {
                    setCiudades(resposta.data.content.map(ciudad => ({ value: ciudad.id, label: ciudad.nombre })))
                })
        }
    };
    return (<Select
        styles={customStyles}
        value={option}
        onChange={setOption}
        options={ciudades}
        onInputChange={handleInputChange}
    />)
}


export default SelectCiudad