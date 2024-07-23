import { useState } from "react"
import IParadaForm from "../Viajes/Types/IParadaForm"
import IParadaFormErro from "../Viajes/Types/IParadaFormErro"
import ParadaForm from "../Viajes/Components/ParadaForm"
import PrimaryButton from "@/Components/PrimaryButton"
import http from "@/http"
import IError from "@/Types/IErrors/IError"
import { IoClose } from "react-icons/io5"
import IParada2 from "@/Types/IViaje/IParada2"

interface Props {
    className?: string
    idViaje: string
    addParada: (newParada: IParada2) => void
    validarParada: (newParada: IParadaForm) => boolean
    setOpenForm: (value: boolean) => void
}

const ParadaFormPage = ({ className = '', idViaje, setOpenForm, addParada, validarParada }: Props) => {

    const novoParadaForm = () => {
        return { plataforma: '', dataHora: '', idLugar: '', id: "" }
    }
    const [parada, setParada] = useState<IParadaForm>(novoParadaForm())
    const [paradaErros, setParadaErros] = useState<IParadaFormErro>(novoParadaForm())

    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let erros: IParadaFormErro = novoParadaForm();
        if (!validarParada(parada)) {
            erros.dataHora = 'La fecha esta fuera del limite'
        }
        if (!parseInt(parada.plataforma)) {
            erros.plataforma = "Necesita ser un numero"
        }
        let haErros = parada.dataHora === '' || parada.plataforma === '' || !parseInt(parada.plataforma) || parada.idLugar === '' || !idViaje;
        if (!haErros) {
            http.post<IParada2>('paradas', { ...parada, idViaje: idViaje })
                .then(resposta => {
                    addParada(resposta.data)
                    setParada(novoParadaForm())
                    setParadaErros(erros)
                    setOpenForm(false)
                })
                .catch(erro => {
                    if (erro.response.data.errors)
                        erro.response.data.errors.forEach((er: IError) => erros[er.name] = er.message)
                    setParadaErros(erros)
                })
        } else {
            setParadaErros(erros)
        }
    }

    return (
        <div className={"w-full grid place-content-center " + className}>
            <form onSubmit={enviar} className="w-80 flex justify-center items-center flex-col p-5 border shadow bg-slate-100">
                <div className="mb-2 w-full flex justify-between items-center">
                    <h2 className="pb-2 text-gray-800 text-lg font-semibold">Registra una Parada Nueva</h2>
                    <button
                        className="flex items-center justify-center rounded h-8 w-8 bg-red-500"
                        onClick={() => setOpenForm(false)}
                    >
                        <IoClose className="text-xl text-center text-white" />
                    </button>
                </div>
                <ParadaForm parada={parada} setParada={setParada} paradaErros={paradaErros} />
                <div className="text-center mt-3">
                    <PrimaryButton type="submit">Enviar</PrimaryButton>
                </div>
            </form>
        </div>
    )
}

export default ParadaFormPage