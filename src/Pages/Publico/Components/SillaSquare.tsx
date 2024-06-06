import { ButtonHTMLAttributes } from "react"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    nSilla: number
    transparent?: boolean
    className?: string
}

const SillaSquare = ({ nSilla, className = '', transparent = false, ...props }: Props) => {


    return (
        <button {...props}
            className={transparent ?
                'h-12 w-12 p-2 rounded hover:bg-white' :
                `font-bold text-xl border-2 border-gray-500 h-12 w-12 bg-gray-300 flex justify-center items-center p-2 rounded ${className}`}>
            {!transparent && nSilla}
        </button>
    )
}
export default SillaSquare