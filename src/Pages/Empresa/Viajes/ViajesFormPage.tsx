import InputError from "@/Components/InputError"
import TextInput234 from "@/Components/TextInput234"
import IViaje from "@/Types/IViaje"
import http from "@/http"
import { useState } from "react"
import IParadaForm from "./Types/IParadaForm"
import IParadaFormErro from "./Types/IParadaFormErro"
import ParadaForm from "./Components/ParadaForm"
import { IoClose } from "react-icons/io5"

interface IErros {
    idAutobus: string,
    precioPiso1: string,
    precioPiso2: string,
    salida: IParadaFormErro
    destino: IParadaFormErro
}

interface Props {
    idAutobus: number
    nPisos: number
    addViaje: (novo: IViaje) => void
    setOpenForm: (value: boolean) => void
}

const ViajesFormPage = ({ setOpenForm, addViaje, idAutobus, nPisos }: Props) => {

    const [salida, setSalida] = useState<IParadaForm>({ plataforma: '', dataHora: '', idLugar: '' })
    const [destino, setDestino] = useState<IParadaForm>({ plataforma: '', dataHora: '', idLugar: '' })

    const [precio1, setPrecio1] = useState('')
    const [precio2, setPrecio2] = useState('')

    const construirParadaErro = () => {
        return {
            plataforma: '',
            dataHora: '',
            idLugar: ''
        }
    }

    const construirViajeErro = () => {
        let salida = construirParadaErro()
        let destino = construirParadaErro()
        return {
            idAutobus: '',
            precioPiso1: '',
            precioPiso2: '',
            salida: salida,
            destino: destino
        }
    }

    const validarParada = (parada: IParadaForm, errosParada: IParadaFormErro) => {
        let valido = true
        if (parada.idLugar === '') {
            valido = false
            errosParada.idLugar = 'Escoje un valor válido'
        }

        if (!parseInt(parada.plataforma)) {
            valido = false
            errosParada.plataforma = 'Valor inválido'
        }

        if (parada.dataHora === '') {
            valido = false
            errosParada.dataHora = 'Valor inválido'
        }

        return valido;
    }

    const [erros, setErros] = useState<IErros>(construirViajeErro())

    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let errosInFuncton = construirViajeErro()
        let podeEnviar = true;
        podeEnviar = validarParada(salida, errosInFuncton.salida)
        podeEnviar = validarParada(destino, errosInFuncton.destino)

        if (!parseFloat(precio1)) {
            podeEnviar = false
            errosInFuncton.precioPiso1 = 'Valor inválido'
        } else if (parseFloat(precio1) <= 0) {
            podeEnviar = false
            errosInFuncton.precioPiso1 = 'Valor inválido'
        }

        if (nPisos == 2) {
            if (!parseFloat(precio2)) {
                podeEnviar = false
                errosInFuncton.precioPiso2 = 'Valor inválido'
            } else if (parseFloat(precio2) <= 0) {
                podeEnviar = false
                errosInFuncton.precioPiso2 = 'Valor inválido'
            }
        }

        setErros(errosInFuncton)

        if (podeEnviar) {
            let formData = {
                idAutobus: idAutobus,
                salida: salida,
                destino: destino,
                precioPiso1: parseFloat(precio1),
                precioPiso2: 0
            }

            if (nPisos == 2) {
                formData["precioPiso2"] = parseFloat(precio2)
            }

            http.post('empresa/viajes/create', formData)
                .then(resposta => {
                    addViaje({ idAutobus: idAutobus, codigo: resposta.data.codigo, isCobrado: false, valorArrecadadoEfectivo: 0, valorArrecadadoWeb: 0, precios: [] })
                })
        }
    }

    return (
        <form className="bg-gray-200 p-5 rounded-lg flex flex-col" onSubmit={enviar}>
            <div className="relative">
                <h1 className="text-2xl my-4 font-semibold text-center">Registre los datos del nuevo Viaje</h1>
                <button className="absolute top-0 right-0 bg-red-500 h-8 w-8 text-white rounded flex items-center justify-center" onClick={() => setOpenForm(false)}>
                    <IoClose className="text-xl" />
                </button>
            </div>
            <section>
                <p className="text-lg font-semibold">
                    Datos dela Salida
                </p>
                <ParadaForm parada={salida} paradaErros={erros.salida} setParada={setSalida} />
            </section>
            <section className="mt-3">
                <p className="text-lg font-semibold">
                    Datos del destino
                </p>
                <ParadaForm parada={destino} paradaErros={erros.destino} setParada={setDestino} />
            </section>
            <section className="">
                <p className="text-lg font-semibold my-2">Regitre los precios del viaje</p>
                <div className="flex gap-2">
                    <div className="w-full">
                        <TextInput234 value={precio1} setValue={setPrecio1} labelValue="Precio del primer piso (Bs)" />
                        <InputError message={erros.precioPiso1} />
                    </div>
                    {nPisos == 2 &&
                        <div className="w-full">
                            <TextInput234 value={precio2} setValue={setPrecio2} labelValue="Precio del segundo piso (Bs)" />
                            <InputError message={erros.precioPiso2} />
                        </div>
                    }
                </div>
            </section>
            <div className="text-center mt-5">
                <button className="bg-black py-1.5 px-3 rounded-lg font-semibold text-white" type="submit">
                    ENVIAR
                </button>
            </div>
        </form>
    )
}

export default ViajesFormPage