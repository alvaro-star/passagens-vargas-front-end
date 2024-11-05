import FormTemplate from "@/Components/FormComponents/FormTemplate"
import TextInput234 from "@/Components/FormComponents/TextInput234"
import http from "@/http"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"

/*interface empresaFormErro {
    nombre: string
    logo: string
    numeroCuenta: string
}*/


const EmpresasFormPage = () => {
    const [nombre, setNombre] = useState<string>('')
    const [logo, setLogo] = useState<string>('')
    const [numeroCuenta, setNumeroCuenta] = useState<string>('')
    const navigate = useNavigate()
    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        //Validação
        let errosV = { nombre: '', logo: '', numeroCuenta: '' }
        if (logo.length > 255) {
            errosV.logo = 'El tamanho del link es muy grande'
            return
        }

        e.preventDefault()
        const empresa = {
            nombre: nombre,
            logo: logo,
            numeroCuenta: numeroCuenta
        }
        http.post('empresas', empresa).then(() => {
            navigate('/admin/empresas')
        }).catch(erro => {
            console.log(erro);
        })
    }
    return (
        <div className="w-full my-10 grid place-content-center">
            <div>
                <FormTemplate onSubmit={enviar}>
                    <div className="w-full mt-2">
                        <TextInput234 value={nombre} setValue={setNombre} labelValue="Nombre" />
                    </div>
                    <div className="w-full mt-2">
                        <TextInput234 value={logo} setValue={setLogo} labelValue="Link da logo" />
                    </div>
                    <div className="w-full mt-2">
                        <TextInput234 value={numeroCuenta} setValue={setNumeroCuenta} labelValue="Numero de Cuenta" />
                    </div>
                </FormTemplate>
            </div>
        </div>
    )
}


export default EmpresasFormPage