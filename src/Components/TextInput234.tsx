import { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes } from 'react';

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    isFocused?: boolean
    setValue: (valor: string) => void
}

export default forwardRef(function TextInput234({ type = 'text', className = '', isFocused = false, setValue, ...props }: Props, ref) {
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
            className={
                'p-2 w-full border focus:outline-blue-300 border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded shadow-sm  ' +
                className
            }
            onChange={eve => setValue(eve.target.value)}
            ref={localRef}
        />
    );
});
