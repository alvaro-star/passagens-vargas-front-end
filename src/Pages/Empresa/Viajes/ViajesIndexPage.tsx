import { useState } from "react"

const ViajesIndexPage = () => {
    const [aba, setAba] = useState(0)
    const abas = ['Viajes Pasados', 'Viajes disponíbles']
    return (
        <div className="max-w-7xl m-auto py-10">
            <header className="flex space-x-1">
                {abas.map((abafor, index) => {
                    let classSelect = (index === aba) ? 'bg-slate-300' : ''
                    return <nav
                        onClick={() => setAba(index)}
                        className={`bg-slate-200 cursor-pointer rounded-t-lg py-1.5 px-3 ${classSelect}`} key={index}>
                        {abafor}
                    </nav>
                }
                )}
            </header>
            <div className="bg-slate-300">
                Teste
            </div>
        </div>
    )
}

export default ViajesIndexPage