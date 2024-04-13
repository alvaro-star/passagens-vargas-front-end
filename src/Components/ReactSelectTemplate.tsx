import React, { forwardRef, useEffect, useImperativeHandle, useRef, InputHTMLAttributes, useState, useCallback } from 'react';

interface Option {
    id: string;
    value: string;
}

interface Props extends InputHTMLAttributes<HTMLInputElement> {
    options?: Option[];
    idEscolhidoPai?: string
}

export default forwardRef(function ReactSelectTemplate(
    { idEscolhidoPai = '3', type = 'text', className = '', options = [], ...props }: Props, ref) {
    const [isFocused, setIsFocused] = useState<boolean>(false);
    const [isMenuOpen, setIsMenuOpen] = useState<boolean>(false); // Estado para controlar a visibilidade do menu
    const localRef = useRef<HTMLInputElement>(null);
    const [idEscolhido, setIdEscolhido] = useState('')
    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        const escolhido = options.find(option => option.id === idEscolhidoPai);
        if (escolhido) {
            setValor(escolhido.value);
            setIdEscolhido(escolhido.id)
            setIsMenuOpen(false);
        } else {
            setIdEscolhido(options[0].id)
            setValor(options[0].value)
        }
    }, [])

    const filtrarOptions = (palavra: string) => {
        return options.filter(option => option.value.includes(palavra));
    }

    useEffect(() => {
        if (isFocused) {
            localRef.current?.focus();
        }
    }, [isFocused]);

    const [valor, setValor] = useState<string>('Steve')

    const escolher = (e: string) => {
        const escolhido = options.find(option => option.id === e);
        if (escolhido) {
            setValor(escolhido.value);
            setIdEscolhido(escolhido.id)
            setIsMenuOpen(false);
        }
    };

    return (
        <section className={`relative bg-white ${isFocused ? 'rounded-t' : 'rounded'} `}>
            <div
                className={`w-full flex shadow-sm ${isFocused ? 'rounded-t outline-2 border-2 border-blue-300' : 'rounded'} ` + className}
                onFocus={() => {
                    setIsFocused(true);
                    setIsMenuOpen(true); // Abra o menu quando o input é focado
                }}
                onBlur={() => setIsFocused(false)}
            >
                <input
                    {...props}
                    type={type}
                    value={valor}
                    className='w-full focus:outline-none rounded shadow-sm'
                    ref={localRef}
                    onChange={(eve) => setValor(eve.target.value)}
                />
                <p className="w-6 grid place-content-center">X</p>
            </div>
            {isMenuOpen && (
                <div className="bg-white rounded-b absolute inset-x-0 flex flex-col">
                    {filtrarOptions(valor).map(option => (
                        <span key={option.id} onClick={() => escolher(option.id)} className="w-full hover:bg-slate-200 px-2 cursor-pointer">{option.value}</span>
                    ))}
                </div>
            )}
        </section>
    );
});
