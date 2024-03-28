import { useState } from "react"
import TextInput from "../../../Components/TextInput"
import FormTemplate from "../Components/FormTemplate"
import InputLabel from "../../../Components/InputLabel"
import InputError from "../../../Components/InputError"
import http from "../../../http"

const Register = () => {
    const [nombre, setNombre] = useState<string>('')
    const [login, setLogin] = useState<string>('')
    const [telefono, setTelefono] = useState<string>('')
    const [contrasena, setContrasena] = useState<string>('')
    const [contrasena2, setContrasena2] = useState<string>('')

    const [nombreError, setNombreError] = useState<string>('')
    const [loginError, setLoginError] = useState<string>('')
    const [telefonoError, setTelefonoError] = useState<string>('')
    const [contrasenaError, setContrasenaError] = useState<string>('')
    const [contrasena2Error, setContrasena2Error] = useState<string>('')

    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        setContrasenaError("")
        setContrasena2Error("")
        if (contrasena === contrasena2) {
            const role = "ROLE_CLIENTE";
            const usuario = {login, nombre, telefono, contrasena, role}
            setNombreError("")
            setLoginError("")
            setTelefonoError("")
            http.post('auth/register', usuario)
                .then(response => {
                    console.log(response);
                })
                .catch(erro => {
                    alert(erro.response.data.conteudo)
                    console.log(erro.response.data)
                })
        } else {
            setContrasenaError("La contrasenha es distinta")
            setContrasena2Error("La contrasenha es distinta")
        }
    }

    return (
        <div className="mt-10 flex justify-center items-center ">
            <FormTemplate className="w-80" onSubmit={enviar}>
                <h2 className="text-xl font-bold">Registrar</h2>
                <div className="mt-2 w-full">
                    <InputLabel value="Nombre" />
                    <TextInput value={nombre} onChange={eve => setNombre(eve.target.value)} />
                    <InputError message={nombreError} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Email" />
                    <TextInput value={login} onChange={eve => setLogin(eve.target.value)} />
                    <InputError message={loginError} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Telefono" />
                    <TextInput value={telefono} onChange={eve => setTelefono(eve.target.value)} />
                    <InputError message={telefonoError} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Contrasenha" />
                    <TextInput value={contrasena} onChange={eve => setContrasena(eve.target.value)} />
                    <InputError message={contrasenaError} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Repita la Contrasenha" />
                    <TextInput value={contrasena2} onChange={eve => setContrasena2(eve.target.value)} />
                    <InputError message={contrasena2Error} />
                </div>
            </FormTemplate>
        </div>
    )
}

export default Register