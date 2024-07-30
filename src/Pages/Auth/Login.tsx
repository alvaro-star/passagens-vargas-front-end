import React, { useState } from "react"
import { Link, useNavigate } from "react-router-dom"
import http from "@/http"
import FormTemplate from "@/Components/FormTemplate"
import TextInput234 from "@/Components/TextInput234"
import InputError from "@/Components/InputError"
import IError from "@/Types/IErrors/IError"

interface ILogin {
    token: string
}

interface IUsuario {
    login: string
    nombre: string
    roles: string[]
    telefono: string
    idEmpresa: string | null
}

const tipoUsuario = (roles: string[]): string => {
    if (roles.includes("ROLE_ADMIN"))
        return "ROLE_ADMIN"
    if (roles.includes("ROLE_EMPRESA_ADMIN"))
        return "ROLE_EMPRESA_ADMIN"
    if (roles.includes("ROLE_EMPRESA_FUNCIONARIO"))
        return "ROLE_EMPRESA_FUNCIONARIO"
    if (roles.includes("ROLE_CLIENTE"))
        return "ROLE_CLIENTE"
    return ""
}
interface ILoginError {
    login: string,
    contrasena: string
    [key: string]: string
}
const newLoginError = () => {
    return { login: '', contrasena: "" }
}
const Login = () => {
    const navigate = useNavigate()
    const [login, setLogin] = useState<string>('')
    const [contrasena, setContrasena] = useState<string>('')
    const [messageError, setMessageError] = useState("")
    const [errorsForm, setErrorsForm] = useState<ILoginError>(newLoginError())
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        let errosForm: ILoginError = newLoginError()
        let message = ""
        const usuario = {
            login: login,
            contrasena: contrasena
        }
        http.post<ILogin>("auth/login", usuario)
            .then(response => {
                response.data.token
                sessionStorage.setItem("token", response.data.token)
                setErrorsForm(errosForm)
                http.get<IUsuario>("/usuarios/mydata").then(resposta => {
                    setLogin('')
                    setContrasena('')
                    //Só será mandado um role, por enquanto
                    const rolePadrao = tipoUsuario(resposta.data.roles)
                    sessionStorage.setItem("role", rolePadrao)

                    switch (rolePadrao) {
                        case "ROLE_ADMIN":
                            navigate("/admin")
                            break;
                        case "ROLE_EMPRESA_ADMIN":
                            if (resposta.data.idEmpresa) {
                                sessionStorage.setItem("idEmpresa", resposta.data.idEmpresa)
                                navigate("/empresa")
                            }
                            break;
                        case "ROLE_EMPRESA_FUNCIONARIO":
                            if (resposta.data.idEmpresa) {
                                sessionStorage.setItem("idEmpresa", resposta.data.idEmpresa)
                                navigate("/empresa/viajes")
                            }
                            break;
                        case "ROLE_CLIENTE":
                            navigate("/")
                            break;
                        default:
                            alert("Hubo un error en la consulta")
                    }
                })
            }).catch((erro) => {
                if (erro.response.data.conteudo != null)
                    message = erro.response.data.conteudo
                else if (erro.response.data.errors) {
                    erro.response.data.errors.forEach((erroItem: IError) => {
                        errosForm[erroItem.name] = erroItem.message
                    });
                } else {
                    message = "Hubo un error en la solicitud. Intente de nevo..."
                }
                setErrorsForm(errosForm)
                setMessageError(message)
            })
        setMessageError(message)
    }
    return (
        <div className="h-full w-full grid place-content-center">
            <FormTemplate onSubmit={enviar} className="">
                <h2 className="font-semibold text-xl">Inicia sesion</h2>
                <InputError message={messageError} />
                <div className="mt-2 w-full">
                    <TextInput234 value={login} setValue={setLogin} labelValue="E-mail" required />
                    <InputError className="ml-1" message={errorsForm.login} />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 type="password" value={contrasena} setValue={setContrasena} labelValue="Contraseña" required />
                    <InputError className="ml-1" message={errorsForm.contrasena} />
                </div>
                <Link to="/reset/password" className="w-full text-xs mt-1 text-end mr-3 text-blue-500 hover:text-blue-600 cursor-pointer">
                    Olvidaste tu contraseña?
                </Link>
            </FormTemplate>
        </div>
    )
}

export default Login