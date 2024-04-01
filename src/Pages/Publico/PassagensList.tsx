import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import TextInput from "../../Components/TextInput"

const PassagensList = () => {
    const [sillas, setSillas] = useState<number[]>([])
    const navigate = useNavigate()
    useEffect(() => {
        let sillasEscogidas = sessionStorage.getItem("sillasFromViaje")
        if (sillasEscogidas == null) {
            navigate('/')
        } else if (sillasEscogidas.split(',').length == 0) {
            navigate('/')
        } else {
            let sillasArray: number[] = []
            sillasEscogidas.split(',').forEach(nSilla => {
                sillasArray.push(parseInt(nSilla))
            })
            setSillas(sillasArray)
        }
    }, [])
    return (
        <div className="flex justify-center items-center flex-col">
            <section className="w-full mt-5">
                <div className="mx-10 bg-slate-200 rounded p-5">
                    <img src="https://github.com/alvaro-star.png" alt="" className="w-10" />
                    Detalhes del viaje
                </div>
            </section>
            <section>
                {sillas.map((nSilla, index) =>
                    <div key={index} className="text-white bg-red-500 p-2">
                        {nSilla}
                    </div>
                )}
            </section>
            <section className="w-full mt-10">
                <div className="mx-10 bg-slate-200 rounded p-5">
                    Detalhes del contacto
                    <div className="">
                        <TextInput />
                        <TextInput />
                    </div>
                </div>
            </section>
        </div>
    )
}

export default PassagensList