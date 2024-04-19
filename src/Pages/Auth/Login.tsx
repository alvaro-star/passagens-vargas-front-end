import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import http from "@/http"
import FormTemplate from "@/Components/FormTemplate"
import InputLabel from "@/Components/InputLabel"
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
                    setLogin('')
                    setContrasena('')
                    //Só será mandado um role, por enquanto
                    sessionStorage.setItem("role", resposta.data.roles[0])
                    switch (resposta.data.roles[0]) {
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
                    }
                }).catch(erro => console.log(erro))
            }).catch(erro => {
                alert(erro.response.data.conteudo);
            })
    }
    return (
        <div className="h-full w-full grid place-content-center">
            <FormTemplate onSubmit={enviar} className="">
                <div className="mt-2 w-full">
                    <InputLabel value="Email" />
                    <TextInput234 value={login} setValue={setLogin} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Contrasena" />
                    <TextInput234 value={contrasena} setValue={setContrasena} />
                </div>
            </FormTemplate>
        </div>
    )
}

export default Login