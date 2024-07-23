import React, { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string,
    disabled?: boolean,
    children: React.ReactNode
}

const PrimaryButtonEmpresa = ({ className = '', disabled, children, ...props }: Props) => {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${className} ${disabled && 'opacity-25'} `}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default PrimaryButtonEmpresa
