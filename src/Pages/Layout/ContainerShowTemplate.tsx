interface Props {
    header: React.ReactNode
    children: React.ReactNode
}
const ContainerShowTemplate = ({ header, children }: Props) => {
    return <div className="max-w-6xl mx-auto py-5 md:p-10">
        <div className="px-5 pb-5 md:text-white flex items-center justify-between">
            {header}
        </div>
        {children}
    </div>
}


export default ContainerShowTemplate