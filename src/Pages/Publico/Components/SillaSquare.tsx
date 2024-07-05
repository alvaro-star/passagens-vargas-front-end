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
            className={transparent ?
                `h-14 w-14 rounded ${hover ? 'hover:bg-white' : ''}` :
                `font-bold text-2xl border-2 border-gray-500 h-14 w-14 bg-gray-300 flex justify-center items-center p-2 rounded ${className}`}>
            {!transparent && !ocupado
                ? nSilla :
                <IoClose className="text-6xl font-extrabold" />
            }
        </button>
    )
}
export default SillaSquare