import React, { FormHTMLAttributes } from "react"

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
    children?: React.ReactNode
}

const FormTemplate = ({ children, className, ...props }: Props) => {
    return (
        <form
            {...props}
            className={`w-80 flex flex-col items-center justify-center bg-slate-200 p-5 rounded ${className}`}>
            {children}
        </form>
    )
}

export default FormTemplate