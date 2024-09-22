interface Props {
    text: string
}

export default function ThComponent({ text }: Props) {
    return <th className="px-6 align-middle border border-solid py-3 text-xs uppercase border-l-0 border-r-0 whitespace-nowrap font-semibold text-left bg-blueGray-50 text-blueGray-500 border-blueGray-100">
        {text}
    </th>
}