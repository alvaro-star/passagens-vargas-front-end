import React, { useState } from "react"
import InputLabel from "../../Components/InputLabel"
import TextInput from "../../Components/TextInput"
import axios from "axios"
import ApplicationLogo from "../../Components/ApplicationLogo"

const Login = () => {
    const [login, setLogin] = useState<string>("")
    const [contrasena, setContrasena] = useState<string>("")
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        const usuario = {
            login, contrasena
        }
        axios.post("http://localhost:8080/auth/login", usuario)
            .then(response => {
                console.log(response.data.token);
            }).catch(erro => {
                console.log(erro);
            })
    }
    return (
        <div className="flex justify-center">
            <form className="flex flex-col items-center justify-center bg-slate-200 p-5 rounded" onSubmit={enviar}>
                <ApplicationLogo className="h-12" />
                <div className="mt-2">
                    <InputLabel>Email</InputLabel>
                    <TextInput value={login} onChange={eve => setLogin(eve.target.value)} />
                </div>
                <div className="mt-2">
                    <InputLabel>Contrasena</InputLabel>
                    <TextInput value={contrasena} onChange={eve => setContrasena(eve.target.value)} />
                </div>
                <button className="bg-red-500 p-2 mt-2 rounded  text-white">
                    Enviar
                </button>
            </form>
        </div>
    )
}

export default Login