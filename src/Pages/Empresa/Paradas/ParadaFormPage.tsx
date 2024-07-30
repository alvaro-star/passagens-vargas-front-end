import { useState } from "react"
import IParadaForm from "../Viajes/Types/IParadaForm"
import IParadaFormErro from "../Viajes/Types/IParadaFormErro"
import ParadaForm from "../Viajes/Components/ParadaForm"
import http from "@/http"
import IError from "@/Types/IErrors/IError"
import IParada2 from "@/Types/IViaje/IParada2"
import PrimaryButtonEmpresa from "@/Components/PrimaryButtonEmpresa"
import CloseButton from "@/Components/CloseButton"

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
                .then(({ data }) => {
                    addParada(data)
                    let paradaNovo = novoParadaForm()
                    paradaNovo.idLugar = parada.idLugar
                    setParada(paradaNovo)
                    setParadaErros(erros)
                    setOpenForm(false)
                })
                .catch(({ response }) => {
                    if (response.data.errors)
                        response.data.errors.forEach((er: IError) => erros[er.name] = er.message)
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
                    <CloseButton onClick={() => setOpenForm(false)} />
                </div>
                <ParadaForm parada={parada} setParada={setParada} paradaErros={paradaErros} />
                <div className="text-center mt-3">
                    <PrimaryButtonEmpresa type="submit">Enviar</PrimaryButtonEmpresa>
                </div>
            </form>
        </div>
    )
}

export default ParadaFormPage