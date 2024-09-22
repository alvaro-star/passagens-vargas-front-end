import FormTemplate from "@/Components/FormTemplate"
import InputError from "@/Components/InputError"
import TextInput234 from "@/Components/TextInput234"

import http from "@/http"
import IError from "@/Types/IErrors/IError"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

interface IErros {
    nombre: string
    login: string
    telefono: string
    contrasena: string,
    contrasena2: string
    [key: string]: string
}

const Register = () => {
    const navigate = useNavigate()
    const [nombre, setNombre] = useState<string>("")
    const [login, setLogin] = useState<string>("")
    const [telefono, setTelefono] = useState<string>("")
    const [contrasena, setContrasena] = useState<string>("")
    const [contrasena2, setContrasena2] = useState<string>("")
    const [enviado, setEnviado] = useState(false)

    const newErros = () => {
        return {
            nombre: "",
            login: "",
            telefono: "",
            contrasena: "",
            contrasena2: ""
        }
    }

    const [erros, setErros] = useState<IErros>(newErros())
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        setEnviado(true)
        let errosValidation: IErros = newErros()
        if (contrasena === contrasena2 && contrasena != "") {
            const usuario = { login, nombre, telefono, contrasena }
            http.post('auth/register', usuario)
                .then(() => {
                    setEnviado(false)
                    navigate("/validar")
                })
                .catch(erro => {
                    setEnviado(false)
                    if (erro?.response?.data?.errors) {
                        let erros: IError[] = erro?.response?.data?.errors
                        erros.forEach(erro => errosValidation[erro.name] = erro.message)
                    } else
                        alert("Hubo un error en la solicitud");
                    setErros(errosValidation)
                })
        } else {
            errosValidation.contrasena = "La contraseña es distinta"
            errosValidation.contrasena2 = "La contraseña es distinta"
            setErros(errosValidation)
        }
    }

    return (
        <div className="h-full grid place-content-center">
            <FormTemplate onSubmit={enviar} disabled={enviado}>
                <h2 className="text-xl font-bold w-full">Registrate</h2>
                <p className="w-full text-sm">Ingresa tus datos y create una cuenta...</p>
                <div className="mt-2 w-full">
                    <TextInput234 value={nombre} setValue={setNombre} labelValue="Nombre" required />
                    <InputError message={erros.nombre} />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 value={login} setValue={setLogin} labelValue="E-mail" required />
                    <InputError message={erros.login} />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 value={telefono} setValue={setTelefono} labelValue="Telefono" required />
                    <InputError message={erros.telefono} />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 type="password" value={contrasena} setValue={setContrasena} labelValue="Contraseña" required />
                    <InputError message={erros.contrasena} />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 type="password" value={contrasena2} setValue={setContrasena2} labelValue="Repita la Contraseña" required />
                    <InputError message={erros.contrasena2} />
                </div>
            </FormTemplate>
        </div>
    )
}

export default Register