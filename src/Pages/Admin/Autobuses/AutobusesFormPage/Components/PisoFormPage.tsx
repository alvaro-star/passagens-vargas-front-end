import { useEffect, useState } from "react"
import ICampo from "../../../../../Types/ICampo"
import InputLabel from "../../../../../Components/InputLabel"
import Piso from "../../../../Publico/Components/Piso"
import ISilla from "../../../../../Types/ISilla"
import InputNumber from "./InputNumber"
import IPiso from "../../../../../Types/IPiso"
import PrimaryButton from "../../../../../Components/PrimaryButton"

interface Props {
    piso: IPiso,
    etapa: number,
    setEtapa: (nEtapa: number) => void,
    setPiso: (piso: IPiso) => void
}

const PisoFormPage = ({ piso, setPiso, etapa, setEtapa }: Props) => {
    const posiciones = ['IZQUIERDA', 'DERECHA']
    const [nLinhas, setNLinhas] = useState<ICampo<number>>({ value: piso.nLinhas, erro: '' })
    const [nColunas, setNColunas] = useState<ICampo<number>>({ value: piso.nColunas, erro: '' })
    const [distribuicaoFileira, setDistribuicaoFileira] = useState<ICampo<string>>({ value: piso.distribuicaoFileira, erro: '' })
    const [inicioContagem, setInicioContagem] = useState<ICampo<string>>({ value: piso.inicioContagem, erro: '' })

    useEffect(() => {
        setSillasIndisponiveis([])
    }, [nLinhas, nColunas])

    const [sillasIndisponiveis, setSillasIndisponiveis] = useState<number[]>([])

    const clickSilla = (eve: React.MouseEvent<HTMLButtonElement, MouseEvent>, silla: ISilla) => {
        eve.preventDefault()
        if (sillasIndisponiveis.includes(silla.posicion)) {
            setSillasIndisponiveis(sillasIndisponiveis.filter(value => value != (silla.posicion)))
        } else {
            setSillasIndisponiveis([...sillasIndisponiveis, silla.posicion])
        }
    }

    const confirmarModelo = () => {
        setPiso({
            id: null,
            nLinhas: nLinhas.value,
            nColunas: nColunas.value,
            distribuicaoFileira: distribuicaoFileira.value,
            nPiso: 1,
            inicioContagem: inicioContagem.value,
            nSillas: nLinhas.value * nColunas.value - sillasIndisponiveis.length,
            primeraSilla: piso.primeraSilla,
            idAutobus: null,
            posicoesIndisponiveis: sillasIndisponiveis
        })
        setEtapa(etapa + 1)
    }

    return (

        <div className="">
            <div className="flex justify-center gap-4 flex-wrap items-center text-center">
                <div>
                    <InputLabel value="N° Colunas" className="" />
                    <select value={nColunas.value} onChange={eve => setNColunas({ value: parseInt(eve.target.value), erro: nColunas.erro })} className="rounded w-24 p-1 text-center">
                        <option>3</option>
                        <option>4</option>
                    </select>
                </div>

                <div className="w-24">
                    <InputLabel value="N° Linhas" className="" />
                    <InputNumber maxValue={20} minValue={1} campo={nLinhas} setCampo={setNLinhas}></InputNumber>
                </div>

                <div>
                    <InputLabel value="Direccion 2° Fila" className="" />
                    <select disabled={nColunas.value == 4} value={distribuicaoFileira.value} onChange={eve => setDistribuicaoFileira({ value: eve.target.value, erro: nColunas.erro })} className="rounded w-28 p-1 text-center">
                        {posiciones.map((posicion, index) => <option key={index} value={posicion}>{posicion}</option>)}
                    </select>
                </div>
                <div>
                    <InputLabel value="Inicio Conteo" className="" />
                    <select value={inicioContagem.value} onChange={eve => setInicioContagem({ value: eve.target.value, erro: nColunas.erro })} className="rounded w-28 p-1 text-center">
                        {posiciones.map((posicion, index) => <option key={index} value={posicion}>{posicion}</option>)}
                    </select>
                </div>
            </div>
            <Piso
                piso={{
                    id: null,
                    nLinhas: nLinhas.value,
                    nColunas: nColunas.value,
                    distribuicaoFileira: distribuicaoFileira.value,
                    nPiso: 1,
                    inicioContagem: inicioContagem.value,
                    nSillas: null,
                    primeraSilla: piso.primeraSilla,
                    idAutobus: null,
                    posicoesIndisponiveis: sillasIndisponiveis
                }}
                sillasOcupadas={[]}
                clickSilla={clickSilla} />
            <section className="grid place-content-center">
                <PrimaryButton onClick={confirmarModelo}>
                    CONFIRMAR MODELO
                </PrimaryButton>
            </section>
        </div>
    )
}

export default PisoFormPage