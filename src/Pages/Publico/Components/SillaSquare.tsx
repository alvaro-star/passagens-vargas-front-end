import { ButtonHTMLAttributes } from "react"
import { IoClose } from "react-icons/io5"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    nSilla: number
    ocupado?: boolean
    transparent?: boolean
    className?: string
    hover?: boolean
}

const SillaSquare = ({ nSilla, className = '', hover = true, ocupado = false, transparent = false, ...props }: Props) => {
    return (
        <button {...props}
            className={transparent
                ? `h-12 w-12 rounded ${hover ? 'hover:bg-white' : ''}`
                : `font-bold text-2xl border-2 border-gray-500 h-12 w-12 bg-gray-300 flex justify-center items-center rounded ${className}`}>
            {!transparent && !ocupado
                ? nSilla
                : <IoClose style={{ width: '100%', height: '100%', fontSize: 72 }} className="font-extrabold" />
            }
        </button>
    )
}
export default SillaSquare