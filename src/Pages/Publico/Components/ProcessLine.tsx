interface Props {
    className?: string
}

const ProcessLine = ({ className = '' }: Props) => {
    return (
        <section className={" flex items-center justify-between "
            + className
        }>
            <div className="flex items-center gap-3">
                <div className="rounded-full h-10 w-10  bg-gray-200"></div>
                <p className="text-lg">Escojer Viaje</p>
            </div>
            <div className="border border-b-2 w-1/4">
            </div>
            <div className="flex items-center gap-3">
                <div className="rounded-full h-10 w-10  bg-gray-200"></div>
                <p className="text-lg">Asientos</p>
            </div>
            <div className="border border-b-2 w-1/4">
            </div>
            <div className="flex items-center gap-3">
                <div className="rounded-full h-10 w-10  bg-gray-200"></div>
                <p className="text-lg">Confirmar</p>
            </div>
        </section>
    )
}

export default ProcessLine