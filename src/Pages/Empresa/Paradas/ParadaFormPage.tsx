import { useState } from "react"
import IParadaForm from "../Viajes/Types/IParadaForm"
import IParadaFormErro from "../Viajes/Types/IParadaFormErro"
import ParadaForm from "../Viajes/Components/ParadaForm"
import PrimaryButton from "@/Components/PrimaryButton"
import http from "@/http"
import { useNavigate, useParams } from "react-router-dom"
import IError from "@/Types/IError"

const ParadaFormPage = () => {
    const { id } = useParams()

    const navigate = useNavigate()

    const [parada, setParada] = useState<IParadaForm>({ plataforma: '', dataHora: '', idLugar: '' })
    const [paradaErros, setParadaErros] = useState<IParadaFormErro>({ plataforma: '', dataHora: '', idLugar: '' })

    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let haErros = parada.dataHora === '' || parada.plataforma === '' || parada.idLugar === '' || !id;
        if (!haErros) {
            http.post('paradas', { ...parada, idViaje: id })
                .then(() => navigate(`empresa/admin/viajes/${id}`))
                .catch((erro) => {
                    console.log(erro);
                    let erros: IParadaFormErro = { plataforma: '', dataHora: '', idLugar: '' };
                    if (erro.response.data.errors) {
                        erro.response.data.errors.forEach((erro: IError) => {
                            erros[erro.name] = erro.message;
                        })
                        setParadaErros(erros)
                    }
                })
        }
    }

    return <div className="w-full grid place-content-center">
        <form onSubmit={enviar} className="w-full flex justify-center flex-col p-5 bg-gray-300 rounded-lg my-10">
            <ParadaForm parada={parada} setParada={setParada} paradaErros={paradaErros} />
            <div className="text-center mt-2">
                <PrimaryButton type="submit">Enviar</PrimaryButton>
            </div>
        </form>
    </div>
}

export default ParadaFormPage