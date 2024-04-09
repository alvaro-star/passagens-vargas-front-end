import { useEffect, useState } from "react"
import ICampo from "../../../Types/ICampo"
import TextInput from "../../../Components/TextInput"
import InputLabel from "../../../Components/InputLabel"
import SillaSquare from "../../Publico/Components/SillaSquare"

interface IPisoForm {
    distribuicaoFileira: string,
    inicioContagem: string,
    posicoesIndisponiveis: number[],
    ncolunas: number,
    nlinhas: number
}

interface ISilla {
    value: number
    disponivel: boolean
    order: number // variavel auxiliar, caso a variavel inicio contagem seja 'derecha', esta variavel será usada
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
    let contador = 0
    useEffect(() => {
        let sillasDisponibles: ISilla[] = []

        let t
        let x
        for (let i = 0; i < nLinhas.value; i++) {
            for (let j = 0; j < nColunas.value; j++) {
                t = nLinhas.value * i + j + 1
                x = nLinhas.value * (i + 1) - j
                sillasDisponibles.push({
                    value: t,
                    disponivel: true,
                    order: x
                })
            }
        }

        let linhasFor = []
        for (let j = 0; j < nLinhas.value; j++) {
            linhasFor.push(j)
        }

        setLinhas(linhasFor)
        setSillas(sillasDisponibles)
    }, [nLinhas, nColunas])

    useEffect(() => {
        contador = 0
    }, [sillas])

    const clickSilla = (eve: React.MouseEvent<HTMLButtonElement, MouseEvent>, posicao: number) => {
        eve.preventDefault()
        if (sillasIndisponiveis.includes(posicao)) {
            let sillasT = sillas
            sillasT[posicao - 1].disponivel = true
            setSillas(sillasT)
            setSillasIndisponiveis(sillasIndisponiveis.filter(value => value != posicao))
        } else {
            let sillasT = sillas
            sillasT[posicao - 1].disponivel = false
            setSillas(sillasT)
            setSillasIndisponiveis([...sillasIndisponiveis, posicao])
        }
    }

    return (
        <div className="w-full p-2">
            <div className="bg-slate-300 p-5">
                <div className="flex justify-between">
                    <div className="w-24">
                        <InputLabel value="Placa" className="text-white" />
                        <TextInput
                            value={placa.value}
                            onChange={eve => setPlaca({ value: eve.target.value, erro: placa.erro })}
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
                    //Crie algun vazios e inverta o inicio da contagem
                    <div>
                        <InputLabel value="Inicio Conteo" className="text-white" />
                        <select value={inicioContagem.value} onChange={eve => setInicioContagem({ value: eve.target.value, erro: nColunas.erro })} className="rounded w-28 p-1 text-center">
                            <option value='IZQUIERDA'>IZQUIERDA</option>
                            <option value='DERECHA'>DERECHA</option>
                        </select>
                    </div>
                </div>
                //Inicio contagem inconcluso
                <section className="flex justify-center">
                    <div className="w-96 lg:-rotate-90 lg:-mt-40 mt-10 bg-slate-100 p-5 rounded grid place-content-center">
                        <div className="p-2 bg-red-500  text-white text-center rounded-t-xl">
                            Cabeça
                        </div>
                        <div className="p-5 bg-red-200 grid grid-cols-5 gap-3 place-content-center">
                            <div></div>
                            {nColunas.value == 4 &&
                                <>
                                    <div></div>
                                    <div style={{ gridRow: `span ${nLinhas.value + 1} / span ${nLinhas.value + 1}` }}></div>
                                    <div></div>
                                </>
                            }
                            {(nColunas.value == 3 && distribuicaoFileira.value == 'IZQUIERDA') &&
                                <>
                                    <div style={{ gridRow: `span ${nLinhas.value + 1} / span ${nLinhas.value + 1}` }}></div>
                                    <div style={{ gridRow: `span ${nLinhas.value + 1} / span ${nLinhas.value + 1}` }}></div>
                                    <div></div>
                                </>
                            }
                            {(nColunas.value == 3 && distribuicaoFileira.value == 'DERECHA') &&
                                <>
                                    <div></div>
                                    <div style={{ gridRow: `span ${nLinhas.value + 1} / span ${nLinhas.value + 1}` }}></div>
                                    <div style={{ gridRow: `span ${nLinhas.value + 1} / span ${nLinhas.value + 1}` }}></div>
                                </>
                            }
                            <div></div>
                            {inicioContagem.value === 'DERECHA' && sillas.map((silla, index) => {
                                let className = ''
                                if (silla.disponivel) {
                                    contador++
                                } else {
                                    className = 'silla bg-opacity-0 text-opacity-0 border-0'
                                }
                                return (
                                    <SillaSquare
                                        key={index}
                                        nSilla={contador}
                                        className={className}
                                        onClick={eve => clickSilla(eve, index + 1)}
                                        style={{ order: silla.order }}
                                    />
                                )
                            })}

                            {inicioContagem.value === 'IZQUIERDA' && sillas.map((silla, index) => {
                                let className = ''
                                if (silla.disponivel) {
                                    contador++
                                } else {
                                    className = 'silla bg-opacity-0 text-opacity-0 border-0'
                                }
                                return (
                                    <SillaSquare
                                        key={index}
                                        nSilla={contador}
                                        className={className}
                                        onClick={eve => clickSilla(eve, index + 1)}
                                    />
                                )
                            })}

                        </div>
                        <div className="p-2 text-white bg-red-500 text-center rounded-b">
                            Rabo
                        </div>
                    </div>
                </section>
            </div>
        </div>
    )
}

export default AutobusesFormPage