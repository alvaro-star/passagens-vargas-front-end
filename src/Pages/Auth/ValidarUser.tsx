import FormTemplate from "@/Components/FormTemplate"
import TextInput234 from "@/Components/TextInput234"
import http from "@/http"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


const ValidarUser = () => {
    const navigate = useNavigate()
    const [email, setEmail] = useState("")
    const [codigo, setCodigo] = useState("")
    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        http.post("/auth/validar", { email, codigo })
            .then(() => {
                alert("Su cuenta se creo exitosamente, ahora inicie sesion")
                navigate("/login")
            })
            .catch(() => {
                alert("Verifica los datos o intenta registrarte otra vez")
            })
    }
    return <div className="h-full w-full grid place-content-center">
        <FormTemplate onSubmit={enviar} className="">
            <h2 className="font-semibold text-xl">Verificacion de Cuenta</h2>
            <p className="w-full text-sm">Informa tu email y el codigo de verificacion que recibiste</p>
            <div className="mt-2 w-full">
                <TextInput234 value={email} setValue={setEmail} labelValue="E-mail" required />
            </div>
            <div className="mt-2 w-full">
                <TextInput234 value={codigo} setValue={setCodigo} labelValue="Codigo de Verificacion" required />
            </div>
        </FormTemplate>
    </div>
}


export default ValidarUser