import IPiso from "@/Types/IPiso"
import ISilla from "@/Types/ISilla"
import { useEffect, useState } from "react"
import SillaSquare from "./SillaSquare"

interface Props {
    piso: IPiso,
    sillasOcupadas: number[],
    hidden?: boolean
    clickSilla?: (eve: React.MouseEvent<HTMLButtonElement, MouseEvent>, nSilla: ISilla) => void
}

const Piso = ({ piso, sillasOcupadas = [], hidden = false, clickSilla = () => { } }: Props) => {
    const [sillas, setSillas] = useState<ISilla[]>([])
    useEffect(() => {
        if (!piso.nLinhas || !piso.nColunas) return;
        let SillasDisponibles: ISilla[] = []

        piso.posicoesBloqueadas.forEach(nIndisponivel => {
            SillasDisponibles[nIndisponivel - 1] = {
                numero: -1,
                ocupado: false,
                posicion: nIndisponivel
            }
        })

        let HashMapNSillaIndex: number[] = []

        let contador = piso.primeraSilla - 1

        if (piso.inicioContagem == 'IZQUIERDA') {
            let nQuadrados = piso.nLinhas * piso.nColunas
            for (let index = 0; index < nQuadrados; index++) {
                if (!SillasDisponibles[index]) { // se não existe então não é indisponivel
                    contador++
                    SillasDisponibles[index] = {
                        numero: contador, ocupado: false, posicion: index + 1
                    }
                    HashMapNSillaIndex.push(index)
                }
            }
        } else {
            for (let i = 0; i < piso.nLinhas; i++) {
                for (let j = piso.nColunas - 1; j >= 0; j--) {
                    let index = piso.nColunas * i + j
                    if (!SillasDisponibles[index]) { // se não existe então não é indisponivel
                        contador++
                        SillasDisponibles[index] = {
                            numero: contador, ocupado: false, posicion: index + 1
                        }
                        HashMapNSillaIndex.push(index)
                    }
                }
            }
        }

        sillasOcupadas.forEach(sillaOcupada => {
            SillasDisponibles[HashMapNSillaIndex[sillaOcupada - piso.primeraSilla]].ocupado = true
        })

        setSillas(SillasDisponibles)
    }, [piso])
    return (
        <div className={(hidden ? 'hidden' : 'flex') + " rounded min-h-60 justify-center items-center"}>
            <div className="lg:h-72  lg:-rotate-90 p-5 rounded grid place-content-center">
                <div className="p-2 h-14 bg-gray-500  text-white text-center rounded-t-3xl">
                </div>
                <div className="p-5 bg-gray-200 grid grid-cols-4 gap-3 place-content-center">
                    <div></div>
                    {(piso.nColunas == 3 && piso.distribuicaoFileira == 'DERECHA')
                        ? <div style={{ gridRow: `span ${piso.nLinhas + 1} / span ${piso.nLinhas + 1}` }}></div>
                        : <div></div>
                    }
                    {(piso.nColunas == 3 && piso.distribuicaoFileira == 'IZQUIERDA')
                        ? <div style={{ gridRow: `span ${piso.nLinhas + 1} / span ${piso.nLinhas + 1}` }}></div>
                        : <div></div>
                    }
                    <div></div>
                    {sillas.map((silla, index) =>
                        <SillaSquare key={index}
                            disabled={silla.ocupado}
                            ocupado={silla.ocupado}
                            nSilla={silla.numero}
                            transparent={silla.numero == -1}
                            onClick={(eve) => clickSilla(eve, silla)}
                            className={`${silla.ocupado ? 'bg-gray-100 text-gray-500' : 'bg-gray-400 hover:bg-white'} lg:rotate-90`}
                        />
                    )}
                </div>
                <div className="p-2 h-10 text-white bg-gray-500 text-center rounded-b">
                </div>
            </div>
        </div>
    )
}

export default Piso