import React, { forwardRef, useEffect, useImperativeHandle, useRef, SelectHTMLAttributes } from 'react';

interface Props extends SelectHTMLAttributes<HTMLSelectElement> {
    isFocused?: boolean
    labelValue?: string
    children: React.ReactNode
}

export default forwardRef(function TextInput({ className = '', labelValue = '', isFocused = false, children, ...props }: Props, ref) {
    const localRef = useRef<HTMLSelectElement>(null);

    useImperativeHandle(ref, () => ({
        focus: () => localRef.current?.focus(),
    }));

    useEffect(() => {
        if (isFocused) localRef.current?.focus();
    }, []);

    return <div className='relative'>
        <select
            {...props}
            className={`p-2 w-full border border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded shadow-sm outline-none ${className} `}
            ref={localRef}
        >
            {children}
        </select>
        <label
            className="absolute text-sm text-gray-500 rounded-t bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-0 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">
            {labelValue}
        </label>
    </div>
});
