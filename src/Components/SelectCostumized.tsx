import http from '@/http';
import ICiudad from '@/Types/ICiudad';
import IPage from '@/Types/IPage';
import { IoClose } from "react-icons/io5"
import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes, useState } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean
    labelValue?: string
    ciudadElejida: ICiudad | null
    setCiudadElejida: (novo: ICiudad | null) => void
}

export default forwardRef(function SelectCostumized({ type = 'text', labelValue = 'Valor', ciudadElejida, setCiudadElejida, className = '', isFocused = false, ...props }: Props, ref) {
    const localRef = useRef<HTMLInputElement>(null);
    const [isInputFocused, setIsInputFocused] = useState(false);
    const [valor, setValor] = useState("")
    const [ciudades, setCiudades] = useState<ICiudad[]>([])

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    const handleLabelClick = () => {
        localRef.current?.focus();
    };

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
        if (ciudadElejida != null) {
            setValor(ciudadElejida.nombre)
        }
    }, []);

    useEffect(() => {
        if (ciudadElejida != null) {
            setValor(ciudadElejida.nombre)
        } else { setValor("") }
    }, [ciudadElejida]);

    useEffect(() => {
        if (valor.length > 2) {
            http.get<IPage<ICiudad>>(`ciudades/${valor}/like`)
                .then(resposta => {
                    setCiudades(resposta.data.content)
                })
        }
    }, [valor])
    const clicou = async (event: React.MouseEvent<HTMLDivElement, MouseEvent>, option: ICiudad) => {
        event.preventDefault()
        await setCiudadElejida(option)
        localRef.current?.blur();
    }
    const clear = async (event: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        event.preventDefault()
        setCiudades([])
        await setCiudadElejida(null)
        localRef.current?.blur();
    }

    let classeDesfocada = "relative block px-2.5 py-2.5 w-full h-11 text-gray-900 bg-white rounded border border-gray-400 appearance-none "
    let classFocado = "relative block px-2.5 py-2.5 w-full h-11 text-gray-900 bg-white rounded border appearance-none outline-blue-500 ring-blue-500 border-blue-500"

    return (
        <div className={isInputFocused ?
            classFocado : classeDesfocada}>
            <div className='flex items-center text-gray-500'>
                <input
                    {...props}
                    type={type}
                    value={valor}
                    onChange={eve => setValor(eve.target.value)}
                    onFocus={() => setIsInputFocused(true)}
                    onBlur={() => {
                        setIsInputFocused(false)
                        if (ciudadElejida) {
                            setValor(ciudadElejida.nombre)
                        } else {
                            setValor("")
                        }
                    }}
                    ref={localRef}
                    className={"appearance-none w-full border-0 outline-none peer " + className} placeholder=" " />
                <button onMouseDown={e => clear(e)} disabled={ciudadElejida === null} className={'flex items-center disabled:opacity-50'}>
                    <IoClose className='h-5 w-5' />
                </button>
                <label onClick={handleLabelClick}
                    className="absolute text-sm text-gray-500 rounded-t bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">{labelValue}</label>
            </div>
            <div hidden={!isInputFocused} className='absolute options text-gray-500 shadow bg-white rounded w-full -ml-2.5 mt-5'>
                {ciudades.map(ciudad =>
                    <div onMouseDown={e => clicou(e, ciudad)} className='px-2.5 p-2 hover:bg-slate-200 cursor-pointer' key={ciudad.id}>
                        {ciudad.nombre}
                    </div>
                )}
                {ciudades.length == 0 &&
                    <div className='px-2.5 p-2 cursor-pointer'>
                        Escribe minimo 3 letras
                    </div>
                }
            </div>
        </div>
    );
});
