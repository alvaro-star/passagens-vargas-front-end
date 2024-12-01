import { Link } from "react-router-dom"
import './style.css'

interface Props {
    to?: string
    icon: React.ReactNode
    text: React.ReactNode,
    activeRoute: string,
    setActiveRoute?: (rota: string) => void
}

export default function LiButtonComponent({ icon, to = "", text, activeRoute, setActiveRoute, ...props }: Props) {
    const onClick = () => {
        if (setActiveRoute) setActiveRoute(to)
    }

    return <li className={`active inline-flex ${activeRoute == to ? "li-button-component-active" : 'li-button-component'}`} {...props}>
        <Link
            onClick={onClick}
            to={to}
            className="flex items-center space-x-2 text-gray-700 hover:text-blue-500 text-sm mb-4 no-underline font-semibold whitespace-nowrap">
            {icon}
            <p>
                {text}
            </p>
        </Link>
    </li>
}