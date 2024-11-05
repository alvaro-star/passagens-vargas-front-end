import React, { FormHTMLAttributes } from "react"
import PrimaryButton from "../Buttons/PrimaryButton"

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
    disabled?: boolean
    buttonMessage?: string
    children?: React.ReactNode
}

const FormTemplate = ({ children, disabled = false, className, buttonMessage = '', ...props }: Props) => {
    return (
        <form
            {...props}
            className={`w-80 flex flex-col items-center justify-center bg-slate-200 p-5 rounded ${className}`}>
            {children}
            <PrimaryButton type="submit" className="mt-4" disabled={disabled}>
                {buttonMessage == '' ? `Enviar` : buttonMessage}
            </PrimaryButton>
        </form>
    )
}

export default FormTemplate