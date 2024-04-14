import { useEffect, useState } from "react"
import PisoFormPage from "./Components/PisoFormPage"
import IPiso from "@/Types/IPiso"
import ICampo from "@/Types/ICampo"
import http from "@/http"
import PrimaryButton from "@/Components/PrimaryButton"
import InputLabel from "@/Components/InputLabel"
import Piso from "@/Pages/Publico/Components/Piso"
import IAutobusForm from "./Types/IAutobusForm"
import IAutobus from "@/Types/IAutobus"
import TextInput from "@/Components/TextInput"

interface Props {
    idEmpresa: string
    aposCriar: (newAutobus: IAutobus) => void
}

const AutobusesFormPage = ({ idEmpresa, aposCriar }: Props) => {
    const construtorPiso = {
        id: null,
        nLinhas: 10,
        nColunas: 4,
        distribuicaoFileira: 'DERECHA',
        nPiso: 1,
        inicioContagem: 'IZQUIERDA',
        nSillas: null,
        primeraSilla: 1,
        idAutobus: null,
        posicoesIndisponiveis: []
    }

    const [piso1, setPiso1] = useState<IPiso>(construtorPiso)
    const [piso2, setPiso2] = useState<IPiso>(construtorPiso)

    const construtor = { value: '', erro: '' }
    const [placa, setPlaca] = useState<ICampo<string>>(construtor)
    const [etapa, setEtapa] = useState(1)
    const [segundoPiso, setSegundoPiso] = useState<boolean | null>(null)

    useEffect(() => {
        if (piso1.nSillas) {
            let piso2Aux = piso2
            piso2Aux.primeraSilla = piso1.nSillas + 1
            setPiso2(piso2Aux)
        }
    }, [piso1.nSillas])

    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let autobusForm: IAutobusForm | null = {
            id: null,
            placa: placa.value,
            idEmpresa: idEmpresa,
            pisos: [{
                distribuicaoFileira: piso1.distribuicaoFileira,
                inicioContagem: piso1.inicioContagem,
                posicoesIndisponiveis: piso1.posicoesIndisponiveis,
                ncolunas: piso1.nColunas,
                nlinhas: piso1.nLinhas
            }]
        }

        if (segundoPiso == true) {
            autobusForm.pisos.push({
                distribuicaoFileira: piso2.distribuicaoFileira,
                inicioContagem: piso2.inicioContagem,
                posicoesIndisponiveis: piso2.posicoesIndisponiveis,
                ncolunas: piso2.nColunas,
                nlinhas: piso2.nLinhas
            })
        }

        http.post('autobuses', autobusForm)
            .then(resposta => {
                console.log(resposta);
                autobusForm = null
                setPiso1(construtorPiso)
                setPiso2(construtorPiso)
                setPlaca(construtor)
                setEtapa(1)
                setSegundoPiso(null)
                aposCriar({
                    id: resposta.data.id,
                    placa: resposta.data.placa,
                    idEmpresa: idEmpresa
                })
            })
    }


    return (
        <div className="px-5 sm:px-24 pt-7 pb-32">
            <h2 className="text-center text-2xl font-semibold my-5">
                Ajusta las Dimensiones del nuveo Autobus a tu preferencia
            </h2>

            {etapa == 1 && <section>
                <div className="w-full p-5 border-x-2 border-t-2 bg-white rounded-t-lg flex">
                    <p className="w-full">
                        Piso 1
                    </p>
                </div>
                <div className="  rounded-b-lg border-2 py-5">
                    <PisoFormPage piso={piso1} etapa={etapa} setEtapa={setEtapa} setPiso={setPiso1} />
                </div>
            </section>}

            {etapa == 2 && <>
                <div className="relative rounded-lg p-5 bg-white grid place-content-center ">
                    <PrimaryButton
                        onClick={() => setEtapa(1)}
                        className='absolute mt-5 ml-5'>
                        Volver
                    </PrimaryButton>
                    <p>
                        Desea agregar un segundo Piso?
                    </p>
                    <div className="mt-2 flex gap-2 justify-center">
                        <PrimaryButton
                            onClick={() => setSegundoPiso(true)}
                            className={`hover:bg-green-800 ${segundoPiso != null && segundoPiso == true ? 'bg-green-800' : 'bg-green-500'}`}>
                            Si
                        </PrimaryButton>
                        <PrimaryButton
                            onClick={() => setSegundoPiso(false)}
                            className={`hover:bg-red-800 ${segundoPiso != null && segundoPiso == false ? 'bg-red-800' : 'bg-red-500'}`}>
                            No
                        </PrimaryButton>
                    </div>
                    <div className="grid place-content-center">
                        {segundoPiso == false && <PrimaryButton className="mt-5" onClick={() => setEtapa(3)}>continuar</PrimaryButton>}
                    </div>
                </div>
                {segundoPiso == true &&
                    <section className="mt-5">
                        <div className="w-full p-5 border-x-2 border-t-2 bg-white rounded-t-lg flex">
                            <p className="w-full">
                                Piso 2
                            </p>
                        </div>
                        <div className={"  rounded-b-lg border-2 py-5"}>
                            <PisoFormPage piso={piso2} etapa={etapa} setEtapa={setEtapa} setPiso={setPiso2} />
                        </div>
                    </section>
                }
            </>}
            {etapa == 3 && <form className="relative border-2 py-8 sm:p-8 w-full " onSubmit={enviar}>
                <PrimaryButton
                    onClick={() => setEtapa(2)}
                    className='absolute ml-5'>
                    Volver
                </PrimaryButton>
                <section className="w-full grid place-content-center my-5">
                    <div className="w-72">
                        <InputLabel value="N° Placa" />
                        <TextInput campo={placa} setCampo={setPlaca} required />
                    </div>
                </section>
                <div>
                    <h2 className="w-1/4 text-end my-2 text-xl font-semibold">Piso 1</h2>
                    <Piso piso={piso1} sillasOcupadas={[]} />
                </div>
                {segundoPiso == true &&
                    <div className="mt-10">
                        <h2 className="w-1/4 text-end my-2 text-xl font-semibold">Piso 2</h2>
                        <Piso piso={piso2} sillasOcupadas={[]}></Piso>
                    </div>
                }
                <div className="w-full mt-5 flex justify-center">
                    <PrimaryButton>Salvar Registro</PrimaryButton>
                </div>
            </form>}
        </div>
    )
}

export default AutobusesFormPage
