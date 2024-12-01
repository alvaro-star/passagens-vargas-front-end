import CloseButton from "@/Components/Buttons/CloseButton"
import InputError from "@/Components/FormComponents/InputError"
import PrimaryButtonEmpresa from "@/Components/Buttons/PrimaryButtonEmpresa"
import TextInputEmpresa from "@/Components/TextInputEmpresa"
import TituloForm from "@/Components/FormComponents/TituloForm"
import http from "@/http"
import IError from "@/Types/IErrors/IError"
import { useState } from "react"

interface Props {
    idViajeProp: string
    setShowForm: (values: boolean) => void
}

const AutobusCreateCopyComponent = ({ idViajeProp, setShowForm }: Props) => {
    const [dataNovo, setDataNovo] = useState('')
    const [dataNovoError, setDataNovoError] = useState('')

    const enviarForm = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        setDataNovoError("")
        http.post("empresa/viajes/create/copy", { idViaje: idViajeProp, dataNovo: dataNovo })
            .then(() => {
                alert("El viaje fue creado")
                setDataNovo("")
                setDataNovoError("")
                setShowForm(false)
            })
            .catch((erro) => {
                const errorData = erro.response.data;
                if (errorData.conteudo)
                    alert(errorData.conteudo)
                else if (errorData.errors) {
                    errorData.errors.forEach((erroItem: IError) => {
                        if (erroItem.name === "dataNovo")
                            setDataNovoError(erroItem.message)
                    });
                } else {
                    alert("Ocurrio un error contacte-se con el servidor...")
                }
            })
    }

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter')
            e.preventDefault();
    }

    const closeForm = () => {
        setDataNovo("")
        setDataNovoError("")
        setShowForm(false)
    }

    return <form className="bg-white border p-5 w-72" onSubmit={enviarForm} onKeyDown={handleKeyDown}>
        <div className="flex items-center justify-between mb-2">
            <TituloForm text="Crear un nuevo viaje" />
            <CloseButton onClick={closeForm} />
        </div>
        <div>
            <TextInputEmpresa value={dataNovo} type="date" setValue={setDataNovo} labelValue="Fecha nueva" />
            <InputError message={dataNovoError} className="ml-2" />
        </div>
        <div className="flex justify-center">
            <PrimaryButtonEmpresa className="mt-2 rounded">
                Enviar
            </PrimaryButtonEmpresa>
        </div>
    </form>
}

export default AutobusCreateCopyComponent