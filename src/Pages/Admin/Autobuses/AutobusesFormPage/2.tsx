import { useEffect, useState } from "react"
import ICampo from "../../../../Types/ICampo"
import TextInput2 from "../../../../Components/TextInput2"
import InputLabel from "../../../../Components/InputLabel"
import SillaSquare from "../../../Publico/Components/SillaSquare"

interface ISilla {
    value: number
    disponivel: boolean
}
const AutobusesFormPage = () => {

    const [placa, setPlaca] = useState<ICampo<string>>({ value: '', erro: '' })

    const [nLinhas, setNLinhas] = useState<ICampo<number>>({ value: 4, erro: '' })
    const [nColunas, setNColunas] = useState<ICampo<number>>({ value: 4, erro: '' })
    const [distribuicaoFileira, setDistribuicaoFileira] = useState<ICampo<string>>({ value: 'DERECHA', erro: '' })
    const [inicioContagem, setInicioContagem] = useState<ICampo<string>>({ value: 'DERECHA', erro: '' })

    const [sillasIndisponiveis, setSillasIndisponiveis] = useState<number[]>([])
    const [sillas, setSillas] = useState<ISilla[]>([])

    const [linhas, setLinhas] = useState<number[]>([])
    const [colunas, setColunas] = useState<number[]>([])
    let contador = 0
    let indexSillas = 0

    useEffect(() => {
        let sillasDisponibles: ISilla[] = []
        let index = 0
        let linhasFor = []

        for (let i = 0; i < nLinhas.value; i++) {
            for (let j = 0; j < nColunas.value; j++) {
                sillasDisponibles.push({
                    value: index,
                    disponivel: true
                })
                index++
            }
            linhasFor.push(nColunas.value)
        }

        let colunasFor = []
        for (let i = 0; i < nColunas.value; i++) {
            colunasFor.push(i)
        }

        setColunas(colunasFor)
        setLinhas(linhasFor)
        setSillas(sillasDisponibles)
        setSillasIndisponiveis([])
    }, [nLinhas, nColunas])

    useEffect(() => {
        contador = 0
        indexSillas = 0
    }, [sillas])

    const clickSilla = (eve: React.MouseEvent<HTMLButtonElement, MouseEvent>, posicao: number) => {
        eve.preventDefault()

        let sillasT = sillas
        let chave = (posicao) / nColunas.value
        chave = Math.floor(chave)
        let linhasAux = linhas.map(linha => linha);

        if (sillasIndisponiveis.includes(posicao)) {
            linhasAux[chave] = linhasAux[chave] + 1
            sillasT[posicao].disponivel = true
            setSillasIndisponiveis(sillasIndisponiveis.filter(value => value != posicao))
        } else {
            linhasAux[chave] = linhasAux[chave] - 1
            sillasT[posicao].disponivel = false
            setSillasIndisponiveis([...sillasIndisponiveis, posicao])
        }
        setLinhas(linhasAux)
        setSillas(sillasT)
    }

    return (
        <div className="w-full p-2">
            <div className="bg-slate-300 p-5">
                <div className="flex justify-between">
                    <div className="w-24">
                        <InputLabel value="Placa" className="text-white" />
                        <TextInput2
                            campo={placa}
                            setCampo={setPlaca}
                            placeholder="N° Placa"
                        />
                    </div>
                    <div>
                        <InputLabel value="N° Colunas" className="text-white" />
                        <select value={nColunas.value} onChange={eve => setNColunas({ value: parseInt(eve.target.value), erro: nColunas.erro })} className="rounded w-24 p-1 text-center">
                            <option>3</option>
                            <option>4</option>
                        </select>
                    </div>
                    <div className="w-24">
                        <InputLabel value="N° Linhas" className="text-white" />
                        <div className="w-full bg-white rounded p-1 flex justify-around text-center">
                            <div
                                className="w-1/3 hover:text-white hover:bg-slate-500 rounded cursor-pointer"
                                onClick={() => {
                                    if (!(nLinhas.value - 1 < 2)) {
                                        setNLinhas({ value: nLinhas.value - 1, erro: nLinhas.erro })
                                    }
                                }}
                            > {'<'} </div>
                            <div className="w-1/3">
                                {nLinhas.value}
                            </div>
                            <div
                                className="w-1/3 hover:text-white hover:bg-slate-500 rounded cursor-pointer"
                                onClick={() => {
                                    if (!(nLinhas.value + 1 > 20)) {
                                        setNLinhas({ value: nLinhas.value + 1, erro: nLinhas.erro })
                                    }
                                }}
                            > {'>'} </div>
                        </div>
                    </div>

                    <div>
                        <InputLabel value="Direccion 2° Fila" className="text-white" />
                        <select disabled={nColunas.value == 4} value={distribuicaoFileira.value} onChange={eve => setDistribuicaoFileira({ value: eve.target.value, erro: nColunas.erro })} className="rounded w-28 p-1 text-center">
                            <option value='IZQUIERDA'>IZQUIERDA</option>
                            <option value='DERECHA'>DERECHA</option>
                        </select>
                    </div>
                    <div>
                        <InputLabel value="Inicio Conteo" className="text-white" />
                        <select value={inicioContagem.value} onChange={eve => setInicioContagem({ value: eve.target.value, erro: nColunas.erro })} className="rounded w-28 p-1 text-center">
                            <option value='IZQUIERDA'>IZQUIERDA</option>
                            <option value='DERECHA'>DERECHA</option>
                        </select>
                    </div>
                </div>
                <section className="w-full rounded bg-gray-300 min-h-72 flex justify-center items-center">
                    <div className="lg:h-96  lg:-rotate-90 p-5 rounded grid place-content-center">
                        <div className="p-2 h-14 bg-gray-500  text-white text-center rounded-t-3xl">
                        </div>
                        <div className="p-5 bg-gray-200 grid grid-cols-4 gap-3 place-content-center">
                            <div></div>
                            {(nColunas.value == 3 && distribuicaoFileira.value == 'IZQUIERDA') ?
                                <div style={{ gridRow: `span ${nLinhas.value + 1} / span ${nLinhas.value + 1}` }}></div> :
                                <div></div>
                            }
                            {(nColunas.value == 3 && distribuicaoFileira.value == 'DERECHA') ?
                                <div style={{ gridRow: `span ${nLinhas.value + 1} / span ${nLinhas.value + 1}` }}></div> :
                                <div></div>
                            }
                            <div></div>
                            {inicioContagem.value === 'DERECHA' && linhas.map((linha) => {
                                contador += linha
                                const conteudoJSX = (
                                    colunas.map(() => {
                                        let silla = sillas[indexSillas]
                                        indexSillas++

                                        const sillaJSX = (<SillaSquare
                                            key={silla.value}
                                            nSilla={contador}
                                            transparent={!silla.disponivel}
                                            onClick={eve => clickSilla(eve, silla.value)}
                                        />)
                                        if (silla.disponivel) {
                                            contador--
                                        }
                                        return sillaJSX
                                    })
                                )
                                contador += linha
                                return conteudoJSX
                            })}

                            {inicioContagem.value === 'IZQUIERDA' && sillas.map((silla, index) => {
                                if (silla.disponivel) {
                                    contador++
                                }
                                return (<SillaSquare
                                    key={index}
                                    nSilla={contador}
                                    transparent={!silla.disponivel}
                                    onClick={eve => clickSilla(eve, index)}
                                />)
                            })}
                        </div>
                        <div className="p-2 h-10 text-white bg-gray-500 text-center rounded-b">
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}
export default AutobusesFormPage
