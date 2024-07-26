import { useEffect, useState } from "react"
import InputNumber from "./InputNumber"
import PrimaryButtonEmpresa from "@/Components/PrimaryButtonEmpresa"
import IPiso from "@/Types/IPiso"
import ISilla from "@/Types/ISilla"
import Piso from "@/Pages/Publico/Components/Piso"
import InputLabel from "@/Components/InputLabel"

interface Props {
    piso: IPiso,
    etapa: number,
    setEtapa: (nEtapa: number) => void,
    setPiso: (piso: IPiso) => void
}

const PisoFormPage = ({ piso, setPiso, etapa, setEtapa }: Props) => {
    const posiciones = ['IZQUIERDA', 'DERECHA']
    const [nLinhas, setNLinhas] = useState<number>(piso.nLinhas)
    const [nColunas, setNColunas] = useState<number>(piso.nColunas)
    const [distribuicaoFileira, setDistribuicaoFileira] = useState<string>(piso.distribuicaoFileira)
    const [inicioContagem, setInicioContagem] = useState<string>(piso.inicioContagem)

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
        const nuevoPiso = {
            ...piso,
            nLinhas,
            nColunas,
            distribuicaoFileira,
            inicioContagem,
            nSillas: nLinhas * nColunas - sillasIndisponiveis.length,
            posicoesBloqueadas: sillasIndisponiveis
        };
        setPiso(nuevoPiso);
        setEtapa(etapa + 1);
    };

    return (

        <div className="">
            <div className="flex justify-center gap-4 flex-wrap items-center text-center">
                <div>
                    <InputLabel value="N° Colunas" className="" />
                    <select value={nColunas} onChange={eve => setNColunas(parseInt(eve.target.value))} className="rounded w-24 p-1 text-center">
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
                    <select disabled={nColunas == 4} value={distribuicaoFileira} onChange={eve => setDistribuicaoFileira(eve.target.value)} className="rounded w-28 p-1 text-center">
                        {posiciones.map((posicion, index) => <option key={index} value={posicion}>{posicion}</option>)}
                    </select>
                </div>
                <div>
                    <InputLabel value="Inicio Conteo" className="" />
                    <select value={inicioContagem} onChange={eve => setInicioContagem(eve.target.value)} className="rounded w-28 p-1 text-center">
                        {posiciones.map((posicion, index) => <option key={index} value={posicion}>{posicion}</option>)}
                    </select>
                </div>
            </div>
            <Piso
                piso={{
                    id: null,
                    nLinhas: nLinhas,
                    nColunas: nColunas,
                    distribuicaoFileira: distribuicaoFileira,
                    nPiso: 1,
                    inicioContagem: inicioContagem,
                    nSillas: null,
                    primeraSilla: piso.primeraSilla,
                    idAutobus: null,
                    posicoesBloqueadas: sillasIndisponiveis
                }}
                sillasOcupadas={[]}
                clickSilla={clickSilla} />
            <section className="grid place-content-center">
                <PrimaryButtonEmpresa onClick={confirmarModelo}>
                    CONFIRMAR MODELO
                </PrimaryButtonEmpresa>
            </section>
        </div>
    )
}

export default PisoFormPage