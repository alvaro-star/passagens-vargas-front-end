import FormTemplate from "@/Components/FormTemplate"
import InputError from "@/Components/InputError"
import TextInput234 from "@/Components/TextInput234"
import http from "@/http"
import IError from "@/Types/IErrors/IError"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface IErrors {
    email: string,
    codigo: string,
    password: string,
    [key: string]: string
}


const ResetPassword = () => {
    const novoErrors = () => {
        return { email: '', codigo: '', password: '' }
    }
    const navigate = useNavigate()

    const [email, setEmail] = useState<string>('')
    const [codigo, setCodigo] = useState<string>('')

    const [contrasena, setContrasena] = useState<string>('')
    const [codigoMandado, setCodigoMandado] = useState(false)
    const [errosValidacao, setErrosValidacao] = useState<IErrors>(novoErrors())
    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()

        if (!codigoMandado) {
            let errosValidation: IErrors = novoErrors()
            http.post("auth/forget_password", { email: email })
                .then(() => setCodigoMandado(true))
                .catch(erro => {
                    if (erro.response.data.conteudo)
                        errosValidacao.email = erro.response.data.conteudo
                    else
                        alert("Ocurrio un error en los servidores, notifique-lo ala empresa...")
                })
            setErrosValidacao(errosValidation)
        } else {
            let errosValidation: IErrors = novoErrors()
            http.put("auth/reset_password",
                { codigo: codigo, email: email, password: contrasena }
            ).then(() => {
                alert("Tu contrasenha fue renovado exitosamente")
                navigate("/login")
            }).catch(erro => {
                if (erro?.response?.data?.errors) {
                    let erros: IError[] = erro?.response?.data?.errors
                    erros.forEach(erro => errosValidation[erro.name] = erro.message)
                } else if (erro?.response?.data.conteudo)
                    alert(erro?.response?.data.conteudo)
                else {
                    alert("Hubo un error en la solicitud")
                }
            })
            setErrosValidacao(errosValidation)
        }
    }
    return <div className="h-full w-full grid place-content-center">
        <FormTemplate onSubmit={enviar} className="">
            <h2 className="px-1 font-semibold text-xl text-start w-full">Escribe tus datos...</h2>
            <p className="text-sm px-1">
                Escribe tu email para enviarte un codigo de verificacion
            </p>
            <div className="mt-1 w-full">
                <TextInput234 className="disabled:text-gray-400" disabled={codigoMandado} value={email} setValue={setEmail} labelValue="E-mail" required />
                <InputError className="mx-1" message={errosValidacao.email} />
            </div>
            {codigoMandado && <>
                <p className="text-sm w-full px-1">
                    Verifica la bandeja de tu email...
                </p>
                <p className="text-sm w-full px-1">
                    Ingresa el codigo de verificacion y tu nueva contrasena
                </p>
                <div className="mt-2 w-full">
                    <TextInput234 value={codigo} setValue={setCodigo} labelValue="Codigo" required />
                    <InputError className="mx-1" message={errosValidacao.codigo} />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 value={contrasena} setValue={setContrasena} labelValue="Contrasena" required />
                    <InputError className="mx-1" message={errosValidacao.password} />
                </div>
            </>}
        </FormTemplate>
    </div>

}


export default ResetPassword