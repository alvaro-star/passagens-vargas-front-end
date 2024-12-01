
import InputError from "@/Components/FormComponents/InputError"
import PrimaryButton from "@/Components/Buttons/PrimaryButton"
import http from "@/http"
import { useState } from "react"
import IPrecio2 from "@/Types/IViaje/IPrecio2"
import CustomModal from "./CustomModal"
import TextInputObject from "@/Pages/Publico/Components/TextInputObject"
import isNumber from "@/Helpers/Validate/isNumber"
import CustomAxiosResponse from "@/Types/AxiosResponse/CustomAxiosResponse"
interface Props {
    showModal: boolean
    setShowModal: (value: boolean) => void
    valueZ?: number
    precios: IPrecio2[]
    setPrecios: (precios: IPrecio2[]) => void
}
const PreciosEditComponent = ({ precios, setPrecios, valueZ = 20, showModal, setShowModal }: Props) => {
    const [precioError, setPrecioError] = useState<Record<string, string> | null>(null)

    const editPrecio = (idPrecio: string, value: string) => {
        let precioNumber = 0;
        if (value === '') precioNumber = 0
        else if (!isNumber(value)) return
        else precioNumber = parseFloat(value)
        const precioEdit = precios.map(itemMap => (itemMap.id == idPrecio ? { ...itemMap, precio: precioNumber } : itemMap))
        setPrecios(precioEdit)
    }
    const getPrecioById: (id: string) => IPrecio2 | undefined = (idPrecio: string) => {
        return precios.find(itemList => itemList.id == idPrecio)
    }
    const updatePrecioApi = async (idPrecio: string) => {
        let errorsForm = {}
        try {
            const formData = { precio: getPrecioById(idPrecio)?.precio }
            await http.put(`precios/${idPrecio}`, formData)
            alert("El precio fue actualizado")
        } catch (error: CustomAxiosResponse | any) {
            if (error.status == 422) {
                errorsForm = processErro422(error, idPrecio)
            } else alert(error.response.data.conteudo)
        } finally {
            setPrecioError(errorsForm)
        }
    }
    const processErro422 = (erro: CustomAxiosResponse, idPrecio: string) => {
        const errorForms: Record<string, string> = {}
        if (erro.status != 422) return errorForms;
        const dataResponse = erro.response?.data
        if (dataResponse?.errors)
            dataResponse.errors.forEach(erro => {
                if (erro.name == "precio") errorForms[idPrecio] = erro.message
            })
        return errorForms
    }
    return <CustomModal showModal={showModal}
        setShowModal={setShowModal}
        header="Precios del viaje"
        className={`bg-white bg-opacity-75 z-${valueZ}`}
        classNameContainer="w-92 bg-white border p-5"
    >
        <div className="space-y-2 mt-2">
            {precios.map(precio =>
                <div key={precio.id}>
                    <div className="flex items-center space-x-2">
                        <TextInputObject
                            labelValue={"Precio del piso " + precio.nPiso}
                            value={precio.precio}
                            onChange={e => editPrecio(precio.id, e.target.value)} />
                        <PrimaryButton
                            className="rounded py-3 bg-yellow-400"
                            onClick={() => updatePrecioApi(precio.id)}
                        >
                            editar
                        </PrimaryButton>
                    </div>
                    <InputError message={precioError ? precioError[precio.id] : ''} />
                </div>
            )}
        </div>
    </CustomModal >


}

export default PreciosEditComponent