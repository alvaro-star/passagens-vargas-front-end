import FormTemplate from "@/Components/FormTemplate"
import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import ICampo from "@/Types/ICampo"
import IError from "@/Types/IError"
import http from "@/http"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const Register = () => {
    const navigate = useNavigate()
    const construtorCampoString = { value: "", erro: '' }

    const [nombre, setNombre] = useState<ICampo<string>>(construtorCampoString)
    const [login, setLogin] = useState<ICampo<string>>(construtorCampoString)
    const [telefono, setTelefono] = useState<ICampo<string>>(construtorCampoString)
    const [contrasena, setContrasena] = useState<ICampo<string>>(construtorCampoString)
    const [contrasena2, setContrasena2] = useState<ICampo<string>>(construtorCampoString)

    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        setContrasena({ value: contrasena.value, erro: '' })
        setContrasena2({ value: contrasena2.value, erro: '' })
        if (contrasena.value === contrasena2.value && contrasena.value != "") {
            const role = "ROLE_CLIENTE";
            const usuario = { login, nombre, telefono, contrasena, role }
            setNombre({ value: nombre.value, erro: '' })
            setLogin({ value: login.value, erro: '' })
            setTelefono({ value: telefono.value, erro: '' })
            setContrasena({ value: contrasena.value, erro: '' })
            setContrasena2({ value: contrasena2.value, erro: '' })
            http.post('auth/register', usuario)
                .then(resposta => {
                    if (resposta.request.status == 201) {
                        alert("Cadastrado com sucesso!!!");
                        navigate("/login")
                    } else { // Provisorio
                        console.log(resposta.data.message);
                    }
                })
                .catch(erro => {
                    if (erro?.response?.data?.errors) {
                        let erros: IError[] = erro?.response?.data?.errors
                        erros.forEach(erro => {
                            switch (erro.name) {
                                case "nombre":
                                    setNombre({ value: nombre.value, erro: erro.message })
                                    break;
                                case "login":
                                    setLogin({ value: login.value, erro: erro.message })
                                    break;
                                case "telefono":
                                    setTelefono({ value: telefono.value, erro: erro.message })
                                    break;
                                case "contrasena":
                                    setContrasena({ value: contrasena.value, erro: erro.message })
                                    break;
                            }
                        })
                    } else {
                        console.log("Houve um erro durante a solicitação");
                    }
                })
        } else {
            setContrasena({ value: contrasena.value, erro: "La contrasenha es distinta" })
            setContrasena2({ value: contrasena2.value, erro: "La contrasenha es distinta" })
        }
    }

    return (
        <div className="mt-10 flex justify-center items-center ">
            <FormTemplate onSubmit={enviar}>
                <h2 className="text-xl font-bold">Registrar</h2>
                <div className="mt-2 w-full">
                    <InputLabel value="Nombre" />
                    <TextInput campo={nombre} setCampo={setNombre} />
                    <InputError message={nombre.erro} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Email" />
                    <TextInput campo={login} setCampo={setLogin} />
                    <InputError message={login.erro} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Telefono" />
                    <TextInput campo={telefono} setCampo={setTelefono} />
                    <InputError message={telefono.erro} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Contrasenha" />
                    <TextInput campo={contrasena} setCampo={setContrasena} />
                    <InputError message={contrasena.erro} />
                </div>
                <div className="mt-2 w-full">
                    <InputLabel value="Repita la Contrasenha" />
                    <TextInput campo={contrasena2} setCampo={setContrasena2} />
                    <InputError message={contrasena2.erro} />
                </div>
            </FormTemplate>
        </div>
    )
}

export default Register