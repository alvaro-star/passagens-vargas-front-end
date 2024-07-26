import CloseButton from "@/Components/CloseButton"
import InputError from "@/Components/InputError"
import PrimaryButton from "@/Components/PrimaryButton"
import TextInputEmpresa from "@/Components/TextInputEmpresa"
import TituloForm from "@/Components/TituloForm"
import http from "@/http"
import IError from "@/Types/IErrors/IError"
import { useEffect, useState } from "react"
interface Props {
    precioProp: number
    nPiso: number | string
    idPrecio: string
    setPrecioProp: (value: number) => void
    setShowForm: (value: boolean) => void
}
const PrecioEditComponent = ({ precioProp, nPiso, idPrecio, setPrecioProp, setShowForm }: Props) => {
    const [precio, setPrecio] = useState('')
    const [precioError, setPrecioError] = useState('')

    const editar = () => {
        http.put(`precios/${idPrecio}`, { precio: parseInt(precio) })
            .then(() => {
                setPrecioProp(parseInt(precio))
                setShowForm(false)
            })
            .catch((erro) => {
                if (erro.response.data.conteudo) {
                    alert(erro.response.data.conteudo)
                } else if (erro.response.data.errors) {
                    erro.response.data.errors.forEach((errorList: IError) => {
                        if (errorList.name === "precio")
                            setPrecioError(errorList.message)
                    });
                }
            })
    }

    useEffect(() => {
        setPrecio(precioProp.toString())
        setPrecioError('')
    }, [precioProp])

    const closeMenu = () => {
        setShowForm(false)
    }
    return <div className="w-72 p-5 bg-white border text-center">
        <div>
            <div className="flex items-center justify-between">
                <TituloForm text={"Editar precio del piso " + nPiso} />
                <CloseButton onClick={closeMenu} />
            </div>
            <TextInputEmpresa className="mt-2" labelValue="Precio" value={precio} setValue={setPrecio} />
            <InputError message={precioError} />
            <PrimaryButton
                onClick={editar}
                className="bg-yellow-400 rounded-none mt-3"
            >
                editar
            </PrimaryButton>
        </div>
    </div>
}

export default PrecioEditComponent