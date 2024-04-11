import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    nSilla: number
    className?: string
}

const SillaSquare = ({ nSilla, className = '', ...props }: Props) => {
    return (
        <button {...props}
            className={`font-bold text-xl border-2 border-gray-500 h-12 w-12 bg-gray-300 flex justify-center items-center p-2 rounded hover:bg-white ${className}`}>
            {nSilla}
        </button>
    )
}
export default SillaSquare