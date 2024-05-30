import FormTemplate from "@/Components/FormTemplate"
import InputError from "@/Components/InputError"
import TextInput234 from "@/Components/TextInput234"
import http from "@/http"
import { useState } from "react"
import { useNavigate } from "react-router-dom"

const FuncionariosFormPage = () => {
    const [email, setEmail] = useState("")
    const [emailErro, setEmailErro] = useState("")
    const path = "/empresa/admin/funcionarios"
    const navigate = useNavigate()
    const enviar = (e: React.FormEvent<HTMLDivElement>) => {
        e.preventDefault()
        const idEmpresa = sessionStorage.getItem("idEmpresa")
        let dados = { email }
        setEmail("")
        setEmailErro("")
        if (email == null || email === ""){
            setEmailErro("Escribe un email valido")
            return;
        }
        
        http.post(`funcionarios/${idEmpresa}`, dados)
            .then(() => {
                navigate(path)
            }).catch(erro => {
                if (erro.response.data.conteudo) {
                    alert(erro.response.data.conteudo)
                } else {
                    alert("Hubo un error en el envio")
                }
            })
    }
    return <div className="flex justify-center py-10" onSubmit={enviar}>
        <FormTemplate>
            <h2 className="font-semibold text-lg">Registrar un nuevo Funcionario</h2>
            <div className="w-full mt-2">
                <TextInput234 value={email} setValue={setEmail} labelValue="Email" required />
                <InputError message={emailErro} />
            </div>
        </FormTemplate>
    </div>
}

export default FuncionariosFormPage