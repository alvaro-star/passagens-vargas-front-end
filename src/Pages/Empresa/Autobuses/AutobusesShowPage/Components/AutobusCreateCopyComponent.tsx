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
                if (erro.response.data.conteudo)
                    alert(erro.response.data.conteudo)
                else if (erro.response.data.errors) {
                    erro.response.data.errors.forEach((erroItem: IError) => {
                        if (erroItem.name === "dataNovo")
                            setDataNovoError(erroItem.message)
                    });
                } else {
                    alert("Ocurrio un error contacte-se con el servidor...")
                }
            })
    }
    const closeForm = () => {
        setDataNovo("")
        setDataNovoError("")
        setShowForm(false)
    }
    return <form className="bg-white border p-5 w-72" onSubmit={enviarForm}>
        <div className="flex items-center justify-between mb-2">
            <TituloForm text="Crear un nuevo viaje" />
            <CloseButton onClick={closeForm} />
        </div>
        <TextInputEmpresa value={dataNovo} type="date" setValue={setDataNovo} labelValue="Fecha nueva" />
        <InputError message={dataNovoError} className="ml-2" />
        <div className="text-center">
            <PrimaryButtonEmpresa className="mt-3">
                Enviar
            </PrimaryButtonEmpresa>
        </div>
    </form>
}

export default AutobusCreateCopyComponent