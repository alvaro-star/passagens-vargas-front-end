import React, { useState } from "react"
import InputLabel from "../../../Components/InputLabel"
import TextInput from "../../../Components/TextInput"
import FormTemplate from "../Components/FormTemplate"
import http from "../../../http"
import InputError from "../../../Components/InputError"

const Login = () => {
    const [login, setLogin] = useState<string>("")
    const [contrasena, setContrasena] = useState<string>("")
    const [message, setMessage] = useState<string>("")
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        const usuario = {
            login, contrasena
        }

        http.post("auth/login", usuario)
            .then(response => {
                setMessage("")
                if (response?.data?.token) {
                    sessionStorage.setItem("token", response.data.token)
                    setLogin("")
                    setContrasena("")
                }
            }).catch(erro => {
                setMessage(erro.response.data.conteudo)
            })
    }
    return (
        <div className="flex justify-center">
            <FormTemplate onSubmit={enviar} className="mt-20">
                <div className="mt-2">
                    <InputLabel>Email</InputLabel>
                    <TextInput value={login} onChange={eve => setLogin(eve.target.value)} />
                    <InputError message={message}/>
                </div>
                <div className="mt-2">
                    <InputLabel>Contrasena</InputLabel>
                    <TextInput value={contrasena} onChange={eve => setContrasena(eve.target.value)} />
                </div>
            </FormTemplate>
        </div>
    )
}

export default Login