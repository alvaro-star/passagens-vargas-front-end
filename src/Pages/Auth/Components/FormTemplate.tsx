import React, { FormHTMLAttributes } from "react"
import ApplicationLogo from "../../../Components/ApplicationLogo"
import PrimaryButton from "../../../Components/PrimaryButton"

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
    children: React.ReactNode
}

const FormTemplate = ({ children, className, ...props }: Props) => {
    return (
        <form
            {...props}
            className={`flex flex-col items-center justify-center bg-slate-200 p-5 rounded ${className}`}>
            <ApplicationLogo className="h-20 my-10" />
            {children}
            <PrimaryButton className="mt-4">
                Enviar
            </PrimaryButton>
        </form>
    )
}

export default FormTemplate