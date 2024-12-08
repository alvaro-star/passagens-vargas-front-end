import { useEffect, useState } from "react"
import PisoFormPage from "./Components/PisoFormPage"
import IPiso from "@/Types/IPiso"
import http from "@/http"
import PrimaryButtonEmpresa from "@/Components/Buttons/PrimaryButtonEmpresa"
import Piso from "@/Pages/Publico/Components/Piso"
import IAutobusForm from "./Types/IAutobusForm"
import { useNavigate } from "react-router-dom"
import TextInputEmpresa from "@/Components/TextInputEmpresa"
import InputError from "@/Components/FormComponents/InputError"
import CookieEmpresaId from "@/Helpers/CookieGenerate/CookieEmpresaId"
import { proceccErroDefault, processErro422 } from "@/Helpers/Exceptions/processorsError"

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
    posicoesBloqueadas: []
}

const AutobusesFormPage = () => {

    const navigate = useNavigate()
    const [idEmpresa, setIdEmpresa] = useState<string>('')

    const [piso1, setPiso1] = useState<IPiso>(construtorPiso)
    const [piso2, setPiso2] = useState<IPiso>(construtorPiso)

    const [placa, setPlaca] = useState<string>('')
    const [placaErro, setPlacaErro] = useState('')

    const [etapa, setEtapa] = useState(1)
    const [segundoPiso, setSegundoPiso] = useState<boolean | null>(null)

    useEffect(() => {
        let cookie1 = CookieEmpresaId.get()
        if (cookie1) {
            setIdEmpresa(cookie1)
        } else navigate('/')
    }, [])
    useEffect(() => {
        if (piso1.nSillas) {
            let nsillas = piso1.nSillas
            setPiso2(prevPiso2 => ({
                ...prevPiso2,
                primeraSilla: nsillas + 1
            }));
        }
    }, [piso1.nSillas]);

    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setPlacaErro('')
        let autobusForm: IAutobusForm | null = {
            id: null,
            placa: placa,
            idEmpresa: idEmpresa,
            pisos: [{
                distribuicaoFileira: piso1.distribuicaoFileira,
                inicioContagem: piso1.inicioContagem,
                posicionesBloqueadas: piso1.posicoesBloqueadas,
                ncolunas: piso1.nColunas,
                nlinhas: piso1.nLinhas
            }]
        }

        if (segundoPiso == true) {
            autobusForm.pisos.push({
                distribuicaoFileira: piso2.distribuicaoFileira,
                inicioContagem: piso2.inicioContagem,
                posicionesBloqueadas: piso2.posicoesBloqueadas,
                ncolunas: piso2.nColunas,
                nlinhas: piso2.nLinhas
            })
        }

        http.post('autobuses', autobusForm)
            .then(() => {
                autobusForm = null
                setPiso1(construtorPiso)
                setPiso2(construtorPiso)
                setPlaca('')
                setEtapa(1)
                setSegundoPiso(null)
                navigate(-1)
            }).catch(error => {
                if (error.response.data.errors) {
                    const errors: Record<string, string> = processErro422(error)
                    if (Object.keys(errors).includes("placa"))
                        setPlacaErro(errors["placa"])
                } else if (error.response.data.conteudo) {
                    alert(error.response.data.conteudo)
                } else proceccErroDefault()

            })
    }

    return (
        <div className="px-5 sm:px-24 pb-32">
            <h2 className="text-center text-2xl font-semibold my-5 text-white">
                Ajusta las Dimensiones del nuveo Autobus a tu preferencia
            </h2>
            {etapa == 1 && <section>
                <div className="w-full p-5 border-x-2 border-t-2 bg-white flex">
                    <p className="w-full">
                        Piso 1
                    </p>
                </div>
                <div className=" border-2 py-5 bg-slate-100">
                    <PisoFormPage piso={piso1} etapa={etapa} setEtapa={setEtapa} setPiso={setPiso1} />
                </div>
            </section>}

            {etapa == 2 && <>
                <div className="w-full p-5 bg-white">
                    <div className="w-full">
                        <PrimaryButtonEmpresa
                            onClick={() => setEtapa(1)}
                            className=''>
                            Volver
                        </PrimaryButtonEmpresa>
                    </div>
                    <div className="grid place-content-center">
                        <p>
                            Desea agregar un segundo Piso?
                        </p>
                        <div className="mt-2 flex gap-2 justify-center">
                            <PrimaryButtonEmpresa
                                onClick={() => setSegundoPiso(true)}
                                className={`hover:bg-green-800 ${segundoPiso != null && segundoPiso == true ? 'bg-green-800' : 'bg-green-500'}`}>
                                Si
                            </PrimaryButtonEmpresa>
                            <PrimaryButtonEmpresa
                                onClick={() => setSegundoPiso(false)}
                                className={`hover:bg-red-800 ${segundoPiso != null && segundoPiso == false ? 'bg-red-800' : 'bg-red-500'}`}>
                                No
                            </PrimaryButtonEmpresa>
                        </div>
                    </div>
                    <div className="grid place-content-center">
                        {segundoPiso == false && <PrimaryButtonEmpresa className="mt-5" onClick={() => setEtapa(3)}>continuar</PrimaryButtonEmpresa>}
                    </div>
                </div>
                {segundoPiso &&
                    <section className="mt-5">
                        <div className="w-full p-5 border-x-2 border-t-2 bg-white flex">
                            <p className="w-full">
                                Piso 2
                            </p>
                        </div>
                        <div className={"border-2 py-5 bg-slate-100"}>
                            <PisoFormPage piso={piso2} etapa={etapa} setEtapa={setEtapa} setPiso={setPiso2} />
                        </div>
                    </section>
                }
            </>}
            {etapa == 3 && <form className="relative border-2 py-8 sm:p-8 w-full bg-slate-100" onSubmit={enviar}>
                <PrimaryButtonEmpresa
                    onClick={() => setEtapa(2)}
                    className='absolute ml-5'>
                    Volver
                </PrimaryButtonEmpresa>
                <section className="w-full grid place-content-center my-5">
                    <div className="w-72">
                        <TextInputEmpresa value={placa} setValue={setPlaca} required labelValue="N° Placa" />
                        <InputError className="ml-1" message={placaErro} />
                    </div>
                </section>
                <div>
                    <h2 className="w-1/4 text-end my-2 text-xl font-semibold">Piso 1</h2>
                    <Piso hoverTransparent={false} piso={piso1} sillasOcupadas={[]} />
                </div>
                {segundoPiso &&
                    <div className="mt-10">
                        <h2 className="w-1/4 text-end my-2 text-xl font-semibold">Piso 2</h2>
                        <Piso hoverTransparent={false} piso={piso2} sillasOcupadas={[]}></Piso>
                    </div>
                }
                <div className="w-full mt-5 flex justify-center">
                    <PrimaryButtonEmpresa>Salvar Registro</PrimaryButtonEmpresa>
                </div>
            </form>}
        </div>
    )
}

export default AutobusesFormPage