interface Props {
    className?: string
    step: number
}

const ProcessLine = ({ className = '', step }: Props) => {
    let bgsColors = ['gray-200', 'gray-200']
    switch (step) {
        case 2:
            bgsColors[0] = 'gray-500'
            break;
        case 3:
            bgsColors[0] = 'gray-500'
            bgsColors[1] = 'gray-500'
            break;
    }
    return (
        <section className={" flex items-center justify-between "
            + className
        }>
            <div className="flex items-center gap-3">
                <div className={`rounded-full h-10 w-10  bg-gray-500`}></div>
                <p className="text-lg">Escojer Viaje</p>
            </div>
            <div className={`border border-b-2 w-1/4 border-b-${bgsColors[0]}`}></div>
            <div className="flex items-center gap-3">
                <div className={`rounded-full h-10 w-10  bg-${bgsColors[0]}`}></div>
                <p className="text-lg">Asientos</p>
            </div>
            <div className={`border border-b-2 w-1/4 border-b-${bgsColors[1]}`}></div>
            <div className="flex items-center gap-3">
                <div className={`rounded-full h-10 w-10  bg-${bgsColors[1]}`}></div>
                <p className="text-lg">Confirmar</p>
            </div>
        </section>
    )
}

export default ProcessLine