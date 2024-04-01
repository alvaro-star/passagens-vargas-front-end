import { useEffect, useState } from "react"
import IPiso from "../../../Types/IPiso"
import SillaSquare from "./SillaSquare"

interface Props {
    piso: IPiso,
    adicionar: (eve: React.MouseEvent<HTMLButtonElement, MouseEvent>, nSilla: number) => void
}

const Piso = ({ piso, adicionar }: Props) => {
    const [sillas, setSillas] = useState<number[]>([])

    useEffect(() => {
        if (piso.nSillas) {
            let SillasDisponibles = [piso.primeraSilla]
            SillasDisponibles.length = piso.nSillas
            piso.posicoesIndisponiveis.forEach(indisponivel => {
                SillasDisponibles[indisponivel - 1] = -1
            })
            let contador = SillasDisponibles[0]
            for (let index = 1; index < piso.nSillas; index++) {
                if (SillasDisponibles[index] != -1) {
                    contador++
                    SillasDisponibles[index] = contador
                }
            }
            setSillas(SillasDisponibles)
        }
    }, [])
    return (
        <div className="w-96 lg:-rotate-90 lg:-mt-96 mt-10 bg-slate-100 p-5 rounded grid place-content-center">
            <div className="p-2 bg-red-500  text-white text-center rounded-t-xl">
                Cabeça
            </div>
            <div className="p-5 bg-red-200 grid grid-cols-4 gap-3 place-content-center">

                <div></div>
                {piso.nColunas == 4 &&
                    <>
                        <div></div>
                        <div></div>
                    </>
                }
                {(piso.nColunas == 3 && piso.distribuicaoFileira == 'IZQUIERDA') &&
                    <>
                        <div className="row-span-12"></div>
                        <div></div>
                    </>
                }
                {(piso.nColunas == 3 && piso.distribuicaoFileira == 'DERECHA') &&
                    <>
                        <div></div>
                        <div className="row-span-12"></div>
                    </>
                }
                <div></div>
                {sillas.map((silla, index) =>
                    <SillaSquare
                        key={index}
                        nSilla={silla}
                        onClick={(eve) => adicionar(eve, silla)}
                        className="bg-yellow-400 hover:bg-yellow-100 lg:rotate-90"
                    />
                )}
            </div>
            <div className="p-2 text-white bg-red-500 text-center rounded-b">
                Rabo
            </div>
        </div>
    )
}

export default Piso