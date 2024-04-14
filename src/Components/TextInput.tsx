import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from 'react';
import ICampo from '../Types/ICampo';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean
    campo: ICampo<string>
    setCampo: (campo: ICampo<string>) => void
}

export default forwardRef(function TextInput({ campo, setCampo, type = 'text', className = '', isFocused = false, ...props }: Props, ref) {
    const localRef = useRef<HTMLInputElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, []);

    return (
        <input
            {...props}
            type={type}
            className={`p-2 w-full border border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded shadow-sm  ${className} `}
            value={campo.value}
            onChange={eve => setCampo({ value: eve.target.value, erro: campo.erro })}
            ref={localRef}
        />
    );
});
