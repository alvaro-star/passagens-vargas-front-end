import FormTemplate from "@/Components/FormComponents/FormTemplate"
import TextInput234 from "@/Components/FormComponents/TextInput234"
import http from "@/http"
import { useState } from "react"
import { useNavigate } from "react-router-dom"


const ValidarUpdate = () => {
    const navigate = useNavigate()
    const [codigo, setCodigo] = useState("")
    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        http.put("/auth/validar_update", { codigo })
            .then(() => {
                alert("Sus datos fueron actualizados exitosamente")
                navigate("/login")
            })
            .catch(() => {
                alert("El codigo es invalido o no te pertenece")
            })
    }
    return <div className="h-full w-full grid place-content-center">
        <FormTemplate onSubmit={enviar} className="" buttonMessage="enviar codigo">
            <h2 className="font-semibold text-xl">Verificacion de Cuenta</h2>
            <p className="w-full text-sm">Informa el codigo de verificacion que te enviamos por email</p>
            <div className="mt-2 w-full">
                <TextInput234 type="password" value={codigo} setValue={setCodigo} labelValue="Codigo de Verificacion" required />
            </div>
        </FormTemplate>
    </div>
}


export default ValidarUpdate