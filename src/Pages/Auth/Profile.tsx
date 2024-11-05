import FormTemplate from "@/Components/FormComponents/FormTemplate"
import InputError from "@/Components/FormComponents/InputError"
import TextInput234 from "@/Components/FormComponents/TextInput234"

import http from "@/http"
import IError from "@/Types/IErrors/IError"
import { useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import IUsuario from "./Types/IUsuario"

interface IErros {
    nombre: string
    email: string
    telefono: string
    contrasena: string,
    [key: string]: string
}

const Profile = () => {
    const navigate = useNavigate()
    const [nombre, setNombre] = useState<string>("")
    const [email, setEmail] = useState<string>("")
    const [telefono, setTelefono] = useState<string>("")
    const [contrasena, setContrasena] = useState<string>("")
    const [enviado, setEnviado] = useState(false)

    const newErros = () => {
        return {
            nombre: "",
            email: "",
            telefono: "",
            contrasena: ""
        }
    }

    useEffect(() => {
        http.get<IUsuario>("/usuarios/mydata").then(({ data }) => {
            setEmail(data.login)
            setTelefono(data.telefono)
            setNombre(data.nombre)
        })
    }, [])

    const [erros, setErros] = useState<IErros>(newErros())
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        setEnviado(true)
        let errosValidation: IErros = newErros()
        if (contrasena != "") {
            const usuario = { email, nombre, telefono, contrasena }
            http.post('auth/update', usuario)
                .then(() => {
                    setEnviado(false)
                    navigate("/update/validar")
                })
                .catch(erro => {
                    setEnviado(false)
                    if (erro?.response?.data?.errors) {
                        let erros: IError[] = erro?.response?.data?.errors
                        erros.forEach(erro => errosValidation[erro.name] = erro.message)
                    } else if (erro?.response?.data?.conteudo)
                        alert(erro?.response?.data?.conteudo);
                    else
                        alert("Hubo un error en la solicitud");
                    setErros(errosValidation)
                })
        }
    }

    return (
        <div className="h-full grid place-content-center">
            <FormTemplate onSubmit={enviar} disabled={enviado} buttonMessage="Actualizar">
                <h2 className="text-xl font-bold w-full">Escribe tus nuevos datos</h2>
                <div className="mt-2 w-full">
                    <TextInput234 value={nombre} setValue={setNombre} labelValue="Nombre" required />
                    <InputError message={erros.nombre} />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 value={email} setValue={setEmail} labelValue="E-mail" required />
                    <InputError message={erros.login} />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 value={telefono} setValue={setTelefono} labelValue="Telefono" required />
                    <InputError message={erros.telefono} />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 type="password" value={contrasena} setValue={setContrasena} labelValue="Confirma tu contraseña" required />
                    <InputError message={erros.contrasena} />
                </div>
            </FormTemplate>
        </div>
    )
}

export default Profile