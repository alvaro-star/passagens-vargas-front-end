import { Link } from "react-router-dom"

interface Props {
    to?: string
    children: React.ReactNode
}
export default function LinkLayoutComponent({ to = "", children }: Props) {
    return <Link to={to} className="text-sm py-2 px-4 font-normal block w-full whitespace-nowrap bg-transparent text-blueGray-700">
        {children}
    </Link>
} 