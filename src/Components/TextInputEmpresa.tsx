import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean
    labelValue?: string
    className?: string
    classNameInput?: string
    classNameLabel?: string
    setValue: (valor: string) => void
}

export default forwardRef(function TextInputEmpresa({ type = 'text', labelValue = 'Valor', className = '', classNameInput = '', classNameLabel = '', isFocused = false, setValue, ...props }: Props, ref) {
    const localRef = useRef<HTMLInputElement>(null);

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
    }, []);

    return (
        <div className={`relative ${className}`}>
            <input
                {...props}
                type={type}
                onChange={eve => setValue(eve.target.value)}
                ref={localRef}
                className={`block p-2.5 w-full h-11 text-gray-900 bg-white rounded border border-gray-400 appearance-none focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 peer ${classNameInput}`} placeholder=" " />
            <label onClick={handleLabelClick}
                className="absolute text-sm text-gray-500 rounded-t bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">{labelValue}</label>
        </div>
    );
});
