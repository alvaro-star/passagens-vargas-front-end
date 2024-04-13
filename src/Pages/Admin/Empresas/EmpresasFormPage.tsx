import FormTemplate from "@/Components/FormTemplate"
import InputLabel from "@/Components/InputLabel"
import TextInput from "@/Components/TextInput"
import ICampo from "@/Types/ICampo"
import http from "@/http"
import React, { useState } from "react"
import { useNavigate } from "react-router-dom"



const EmpresasFormPage = () => {
    const [nombre, setNombre] = useState<ICampo<string>>({ value: '', erro: '' })
    const [logo, setLogo] = useState<ICampo<string>>({ value: '', erro: '' })
    const [numeroCuenta, setNumeroCuenta] = useState<ICampo<string>>({ value: '', erro: '' })
    const navigate = useNavigate()
    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        //Validação
        if (logo.value.length > 255) {
            let campo = logo
            campo.erro = 'El tamanho del link es muy grande'
            setLogo(campo)
            return
        }
        
        e.preventDefault()
        const empresa = {
            nombre: nombre.value,
            logo: logo.value,
            numeroCuenta: numeroCuenta.value
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
                        <InputLabel value="Nombre" />
                        <TextInput value={nombre.value} onChange={eve => setNombre({ value: eve.target.value, erro: logo.erro })} />
                    </div>
                    <div className="w-full mt-2">
                        <InputLabel value="Link da logo" />
                        <TextInput value={logo.value} onChange={eve => setLogo({ value: eve.target.value, erro: logo.erro })} />
                    </div>
                    <div className="w-full mt-2">
                        <InputLabel value="Numero de Cuenta" />
                        <TextInput value={numeroCuenta.value} onChange={eve => setNumeroCuenta({ value: eve.target.value, erro: logo.erro })} />
                    </div>
                </FormTemplate>
            </div>
        </div>
    )
}


export default EmpresasFormPage