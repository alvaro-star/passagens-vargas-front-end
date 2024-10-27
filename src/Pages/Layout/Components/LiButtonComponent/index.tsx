import { Link } from "react-router-dom"
import './style.css'
interface Props {
    to?: string
    icon: React.ReactNode
    text: React.ReactNode
    setActiveRoute?: (rota: string) => void
}
export default function LiButtonComponent({ icon, to = "", text, setActiveRoute = (rota: string) => { }, ...props }: Props) {
    const onClick = () => {
        setActiveRoute(to)
    }
    return <li className="inline-flex li-button-component " {...props}>
        <Link onClick={onClick} to={to} className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 text-sm mb-4 no-underline font-semibold">
            {icon}
            <p>{text}</p>
        </Link>
    </li>
}