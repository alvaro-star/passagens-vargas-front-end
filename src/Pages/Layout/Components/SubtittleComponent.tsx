interface Props {
    text: string
}

export default function SubtittleComponent({ text }: Props) {
    return <h6 className="md:min-w-full text-gray-500 text-xs uppercase font-bold block pt-1 pb-4 no-underline">
        {text}
    </h6>
}