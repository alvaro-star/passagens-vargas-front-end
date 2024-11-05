import React, { ButtonHTMLAttributes } from 'react';

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string,
    disabled?: boolean,
    children: React.ReactNode
}

const PrimaryButton = ({ className = '', disabled, children, ...props }: Props) => {
    return (
        <button
            {...props}
            className={
                `inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150 ${className} ${disabled && 'opacity-25'} `}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

const PrimaryButton1 = ({ className = '', disabled, children, ...props }: Props) => {
    return (
        <button
            {...props}
            className={
                `bg-gray-900 text-white active:bg-blue-600 font-semibold uppercase text-sm px-5 py-2 rounded shadow hover:shadow-lg outline-none focus:outline-none ease-linear transition-all duration-150 flex items-center ${className} ${disabled && 'opacity-25'} `}
            disabled={disabled}
        >
            {children}
        </button>
    );
}

export default PrimaryButton
