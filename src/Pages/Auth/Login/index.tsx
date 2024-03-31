import React, { useState } from "react"
import { useNavigate } from "react-router-dom"
import http from "../../../http"
import FormTemplate from "../../../Components/FormTemplate"
import InputLabel from "../../../Components/InputLabel"
import TextInput from "../../../Components/TextInput"



const Login = () => {
    const navigate = useNavigate()
    const [login, setLogin] = useState<string>("")
    const [contrasena, setContrasena] = useState<string>("")
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        const usuario = {
            login, contrasena
        }

        http.post("auth/login", usuario)
            .then(response => {
                if (response?.data?.token) {
                    sessionStorage.setItem("token", response.data.token)
                    setLogin("")
                    setContrasena("")
                    navigate("/")
                }
            }).catch(erro => {
                alert(erro.response.data.conteudo);
            })
    }
    return (
        <div className="flex justify-center">
            <FormTemplate onSubmit={enviar} className="mt-20">
                <div className="mt-2 w-full">
                    <InputLabel>Email</InputLabel>
                    <TextInput value={login} onChange={eve => setLogin(eve.target.value)} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel>Contrasena</InputLabel>
                    <TextInput value={contrasena} onChange={eve => setContrasena(eve.target.value)} />
                </div>
            </FormTemplate>
        </div>
    )
}

export default Login