import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import http from "@/http"
import FormTemplate from "@/Components/FormTemplate"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import ICampo from "@/Types/ICampo"

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
    const construtorCampoString = { value: "", erro: '' }
    const navigate = useNavigate()
    const [login, setLogin] = useState<ICampo<string>>(construtorCampoString)
    const [contrasena, setContrasena] = useState<ICampo<string>>(construtorCampoString)
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        const usuario = {
            login, contrasena
        }

        http.post<ILogin>("auth/login", usuario)
            .then(response => {
                response.data.token
                sessionStorage.setItem("token", response.data.token)

                http.get<IUsuario>("/usuarios/mydata").then(resposta => {
                    setLogin(construtorCampoString)
                    setContrasena(construtorCampoString)
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
                    <TextInput campo={login} setCampo={setLogin} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Contrasena" />
                    <TextInput campo={contrasena} setCampo={setContrasena} />
                </div>
            </FormTemplate>
        </div>
    )
}

export default Login