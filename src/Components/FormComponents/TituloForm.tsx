
interface Props {
    text: string,
    className?: string
}
const TituloForm = ({ text, className = "" }: Props) => {
    return <h2 className={"text-lg font-semibold " + className}>{text}</h2>
}
export default TituloForm