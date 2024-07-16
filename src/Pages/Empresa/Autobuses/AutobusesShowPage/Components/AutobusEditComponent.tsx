import InputError from "@/Components/InputError"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInput234 from "@/Components/TextInput234"
import TituloForm from "@/Components/TituloForm"
import http from "@/http"
import IError from "@/Types/IErrors/IError"
import { useEffect, useState } from "react"
import { IoClose } from "react-icons/io5"

interface Props {
    placaProp: string
    idAutobus: string
    setPlacaProp: (value: string) => void
    setShowForm: (value: boolean) => void
}
const AutobusEditComponent = ({ placaProp, idAutobus, setPlacaProp, setShowForm }: Props) => {
    const [placa, setPlaca] = useState('')
    const [placaError, setPlacaError] = useState('')
    useEffect(() => {
        setPlaca(placaProp)
    }, [placaProp])
    const closeForm = () => {
        setShowForm(false);
        setPlaca(placaProp)
    }
    const enviar = () => {
        http.put(`autobuses/${idAutobus}`, { placa: placa })
            .then(() => {
                setPlacaProp(placa)
                setPlacaError('')
                setShowForm(false)
            }).catch((erro) => {
                if (erro.response.data.conteudo) {
                    alert(erro.response.data.conteudo)
                }
                if (erro.response.data.errors) {
                    erro.response.data.errors.forEach((errorList: IError) => {
                        if (errorList.name === "placa")
                            setPlacaError(errorList.message)
                    });
                }
            })
    }
    return <div className="w-72 bg-white p-5 border text-center">
        <div className=" flex items-center justify-between">
            <TituloForm text="Editar Autobus" />
            <button
                onClick={closeForm}
                className="grid place-content-center p-1.5 bg-red-500 text-white rounded">
                <IoClose />
            </button>
        </div>
        <TextInput234 className="mt-2" labelValue="Placa" value={placa} setValue={setPlaca} />
        <InputError message={placaError} />
        <PrimaryButton
            onClick={enviar}
            className="rounded-none bg-yellow-400 mt-3"
        >
            EDITAR
        </PrimaryButton>
    </div>
}
export default AutobusEditComponent