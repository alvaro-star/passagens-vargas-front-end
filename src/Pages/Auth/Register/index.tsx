import { useState } from "react"
import TextInput from "../../../Components/TextInput"
import FormTemplate from "../../../Components/FormTemplate"
import InputLabel from "../../../Components/InputLabel"
import InputError from "../../../Components/InputError"
import http from "../../../http"
import { IError } from "../../../Types/IError"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()
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
        if (contrasena === contrasena2 && contrasena != "") {
            const role = "ROLE_CLIENTE";
            const usuario = { login, nombre, telefono, contrasena, role }
            setNombreError("")
            setLoginError("")
            setTelefonoError("")
            setContrasena("")
            http.post('auth/register', usuario)
                .then(resposta => {
                    if (resposta.request.status == 201) {
                        alert("Cadastrado com sucesso!!!");
                        navigate("/login")
                    }else{ // Provisorio
                        console.log(resposta.data.message);
                    }
                })
                .catch(erro => {
                    if (erro?.response?.data?.errors) {
                        let erros: IError[] = erro?.response?.data?.errors
                        erros.forEach(erro => {
                            switch (erro.name) {
                                case "nombre":
                                    setNombreError(erro.message)
                                    break;
                                case "login":
                                    setLoginError(erro.message)
                                    break;
                                case "telefono":
                                    setTelefonoError(erro.message)
                                    break;
                                case "contrasena":
                                    setContrasenaError(erro.message)
                                    break;
                            }
                        })
                    }else{
                        console.log("Houve um erro durante a solicitação");
                    }
                })
        } else {
            setContrasenaError("La contrasenha es distinta")
            setContrasena2Error("La contrasenha es distinta")
        }
    }

    return (
        <div className="mt-10 flex justify-center items-center ">
            <FormTemplate onSubmit={enviar}>
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