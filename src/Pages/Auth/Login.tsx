import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import http from "@/http"
import FormTemplate from "@/Components/FormTemplate"
import TextInput234 from "@/Components/TextInput234"

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
    if (roles.includes("ROLE_EMPRESA_FUNCIONARIO"))
        return "ROLE_EMPRESA_FUNCIONARIO"
    if (roles.includes("ROLE_EMPRESA_ADMIN"))
        return "ROLE_EMPRESA_ADMIN"
    if (roles.includes("ROLE_CLIENTE"))
        return "ROLE_CLIENTE"
    return ""
}
const Login = () => {
    const navigate = useNavigate()
    const [login, setLogin] = useState<string>('')
    const [contrasena, setContrasena] = useState<string>('')
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        const usuario = {
            login: login,
            contrasena: contrasena
        }

        http.post<ILogin>("auth/login", usuario)
            .then(response => {
                response.data.token
                sessionStorage.setItem("token", response.data.token)

                http.get<IUsuario>("/usuarios/mydata").then(resposta => {
                    console.log(resposta);

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
                                navigate("/empresa")
                            }
                            break;
                        case "ROLE_CLIENTE":
                            navigate("/")
                            break;
                        default:
                            alert("Hubo un error en la consulta")
                    }
                })
            })
    }
    return (
        <div className="h-full w-full grid place-content-center">
            <FormTemplate onSubmit={enviar} className="">
                <h2 className="font-semibold text-xl">Escribe tus Datos</h2>
                <div className="mt-2 w-full">
                    <TextInput234 value={login} setValue={setLogin} labelValue="E-mail" required />
                </div>
                <div className="mt-2 w-full">
                    <TextInput234 value={contrasena} setValue={setContrasena} labelValue="Contrasena" required />
                </div>
            </FormTemplate>
        </div>
    )
}

export default Login