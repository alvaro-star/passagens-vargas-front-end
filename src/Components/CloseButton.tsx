import { ButtonHTMLAttributes } from "react"
import { IoClose } from "react-icons/io5"

interface Props extends ButtonHTMLAttributes<HTMLButtonElement> {
    className?: string,
    disabled?: boolean
}
const CloseButton = ({ className = '', disabled = false, ...props }: Props) => {
    return <button
        {...props}
        className={"grid place-content-center bg-red-500 rounded h-8 w-8 text-xl text-white p-1.5 " + className}
        disabled={disabled}
    >
        <IoClose />
    </button>
}
export default CloseButton