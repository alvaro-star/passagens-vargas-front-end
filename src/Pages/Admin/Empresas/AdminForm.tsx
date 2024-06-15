import React, { useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import http from "@/http"
import FormTemplate from "@/Components/FormTemplate"
import TextInput234 from "@/Components/TextInput234"

const AdminForm = () => {
    const navigate = useNavigate()
    const { id } = useParams()
    const [email, setEmail] = useState<string>('')
    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault()
        console.log(id);

        const usuarioAdmin = { email: email, idEmpresa: id }
        http.post("empresas/admin", usuarioAdmin)
            .then((resposta) => {
                console.log(resposta);
                setEmail("")
                navigate("/admin/empresas/" + id)
            })
            .catch(erro => console.log(erro.response))
    }
    return (
        <div className="h-full w-full grid place-content-center mt-20">
            <FormTemplate onSubmit={enviar} className="w-96">
                <h2 className="font-semibold text-xl">Escribe el email del administrador</h2>
                <div className="mt-2 w-full">
                    <TextInput234 value={email} setValue={setEmail} labelValue="E-mail" required />
                </div>
            </FormTemplate>
        </div>
    )
}

export default AdminForm