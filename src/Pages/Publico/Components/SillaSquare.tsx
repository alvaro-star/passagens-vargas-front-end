import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    nSilla: number
    className?: string
}

const SillaSquare = ({ nSilla, className = '', ...props }: Props) => {
    return (
        <button {...props}
            className={`h-10 w-10 bg-red-500 text-white flex justify-center items-center p-2 rounded hover:bg-red-100 ${className}`}>
            {nSilla}
        </button>
    )
}
export default SillaSquare