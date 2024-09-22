interface Props {
    children: React.ReactNode
    className?: string
}

export default function TdComponent({ children, className }: Props) {
    return <td className={"border-t-0 px-6 align-middle border-l-0 border-r-0 whitespace-nowrap p-1 " + className}>
        {children}
    </td>
}