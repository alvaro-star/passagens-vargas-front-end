import React, { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string,
    disabled?: boolean,
    children: React.ReactNode
}


const PrimaryButtonEmpresa = ({ className = '', disabled, children, ...props }: Props) => {
    return <button
        {...props}
        className={
            `bg-gray-900 text-white active:bg-blue-600 font-semibold uppercase text-sm px-5 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center  ${className} ${disabled && 'opacity-25'} `}
        disabled={disabled}
    >
        {children}
    </button>
}

export default PrimaryButtonEmpresa
