import { Link } from "react-router-dom"

interface Props {
    to?: string
    icon: React.ReactNode
    text: React.ReactNode
}
export default function LiButtonComponent({ icon, to = "", text }: Props) {
    return <li className="inline-flex">
        <Link to={to} className="flex items-center text-gray-700 hover:text-blue-500 text-sm mb-4 no-underline font-semibold">
            {icon}
            <p>{text}</p>
        </Link>
    </li>
} 