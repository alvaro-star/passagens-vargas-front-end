import PrimaryButton from "@/Components/Buttons/PrimaryButton"
import InputError from "@/Components/FormComponents/InputError"
import TextInput234 from "@/Components/FormComponents/TextInput234"

import http from "@/http"
import ContainerShowTemplate from "@/Pages/Layout/ContainerShowTemplate"
import IError from "@/Types/IErrors/IError"
import { useEffect, useState } from "react"
import IUsuario from "../Types/IUsuario"

interface IErros {
    nombre: string
    email: string
    telefono: string
    contrasena: string,
    [key: string]: string
}

const newErros = () => {
    return {
        nombre: "", email: "", telefono: "", contrasena: ""
    }
}

const Profile = () => {
    const [nombre, setNombre] = useState("")
    const [email, setEmail] = useState("")
    const [telefono, setTelefono] = useState("")
    const [contrasena, setContrasena] = useState("")
    const [codigo, setCodigo] = useState("")

    const [erros, setErros] = useState<IErros>(newErros())
    // Controle de Estados
    const [enviado, setEnviado] = useState(false)
    const [validarSolcitidud, setValidarSolcitidud] = useState(false)

    useEffect(() => {
        http.get<IUsuario>("/usuarios/mydata").then(({ data }) => {
            setEmail(data.login)
            setTelefono(data.telefono)
            setNombre(data.nombre)
        })
    }, [])

    const sendRequestUpdate = () => {
        setEnviado(true)
        let errosValidation: IErros = newErros()
        if (contrasena != "") {
            const usuario = { email, nombre, telefono, contrasena }
            http.post('auth/update', usuario)
                .then(() => setValidarSolcitidud(true))
                .catch(erro => {
                    if (erro?.response?.data?.errors) {
                        let erros: IError[] = erro?.response?.data?.errors
                        erros.forEach(erro => errosValidation[erro.name] = erro.message)
                    } else if (erro?.response?.data?.conteudo)
                        alert(erro?.response?.data?.conteudo);
                    else
                        alert("Hubo un error en la solicitud");
                    setErros(errosValidation)
                }).finally(() => {
                    setEnviado(false)
                    setContrasena("")
                })
        }
    }

    const confirmRequestUpdate = () => {
        setEnviado(true)
        http.put("/auth/validar_update", { codigo })
            .then(() => {
                setValidarSolcitidud(false)
                alert("Sus datos fueron actualizados exitosamente")
            })
            .catch(() => {
                alert("El codigo es invalido")
            }).finally(() => setEnviado(false))
    }

    const send = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        if (!validarSolcitidud) sendRequestUpdate()
        else confirmRequestUpdate()
    }

    return (
        <ContainerShowTemplate
            header={<h2 className="text-2xl font-semibold">
                Datos del Perfil
            </h2>}>
            <div className="bg-white p-5 rounded">
                <form onSubmit={send}>
                    <div className="mt-2 w-full">
                        <TextInput234 disabled={validarSolcitidud} value={nombre} setValue={setNombre} labelValue="Nombre" required />
                        <InputError message={erros.nombre} />
                    </div>
                    <div className="mt-2 grid md:grid-cols-2 gap-2">
                        <div className="w-full">
                            <TextInput234 disabled={validarSolcitidud} value={email} setValue={setEmail} labelValue="E-mail" required />
                            <InputError message={erros.login} />
                        </div>
                        <div className="w-full">
                            <TextInput234 disabled={validarSolcitidud} value={telefono} setValue={setTelefono} labelValue="Telefono" required />
                            <InputError message={erros.telefono} />
                        </div>
                    </div>

                    {validarSolcitidud ? <>
                        <p className="mt-2">Informa el codigo de verificacion que te enviamos por email</p>
                        <div className="mt-2 w-full">
                            <TextInput234 type="password" value={codigo} setValue={setCodigo} labelValue="Codigo" required />
                            <InputError message={erros.contrasena} />
                        </div>
                    </> :
                        <div className="mt-2 w-full">
                            <TextInput234 disabled={validarSolcitidud} type="password" value={contrasena} setValue={setContrasena} labelValue="Confirma tu contraseña para enviar" required />
                            <InputError message={erros.contrasena} />
                        </div>
                    }
                    <div className="w-full text-center mt-3">
                        <PrimaryButton disabled={enviado}>
                            {validarSolcitidud ? "Confirmar" : "Actualizar"}
                        </PrimaryButton>
                    </div>
                </form>
            </div>

        </ContainerShowTemplate>

    )
}

export default Profile