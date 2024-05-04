import InputError from "@/Components/InputError"
import SelectCiudad from "@/Components/SelectCiudad"
import IParadaForm from "../Types/IParadaForm"
import IParadaFormErro from "../Types/IParadaFormErro"
import { useEffect, useState } from "react"
import IType from "@/Types/IType"
import ILugar from "@/Types/ILugar"
import TextInputObject from "@/Pages/Publico/Components/TextInputObject"
import http from "@/http"
interface Props {
    parada: IParadaForm
    paradaErros: IParadaFormErro
    setParada: (parada: IParadaForm) => void
}

const ParadaForm = ({ parada, paradaErros, setParada }: Props) => {
    const [ciudad, setCiudad] = useState<IType | null>(null)
    const [lugares, setLugares] = useState<ILugar[]>([])

    useEffect(() => {
        if (ciudad) {
            http.get<ILugar[]>('ciudades/' + ciudad.value + '/lugares')
                .then(resposta => {
                    setLugares(resposta.data)
                    if (resposta.data.length > 0) {
                        editar('idLugar', resposta.data[0].id.toString())
                    }
                })
        }
    }, [ciudad])

    const editar = (campo: string, value: string) => {
        let paradaAux: IParadaForm = { ...parada }
        paradaAux[campo] = value
        setParada(paradaAux)
    }
    return <div className="flex items-center space-x-4">
        <div className="w-24">
            <TextInputObject className="text-center" type="text" min={1} value={parada.plataforma} onChange={(eve) => editar('plataforma', eve.target.value)} labelValue="Plataforma" />
            <InputError message={paradaErros.plataforma} />
        </div>
        <div>
            <TextInputObject type="datetime-local" value={parada.dataHora} onChange={(eve) => editar('dataHora', eve.target.value)} labelValue="Fecha de llegada" />
            <InputError message={paradaErros.dataHora} />
        </div>
        <div className="w-64">
            <SelectCiudad option={ciudad} setOption={setCiudad} labelValue="Ciudad Salida" />
        </div>

        <div className="relative">
            <select disabled={ciudad == null}
                value={parada.idLugar} onChange={eve => editar('idLugar', eve.target.value)}
                className="w-64 block px-2.5 pb-2.5 pt-4 text-sm h-11 text-gray-900 bg-white rounded border border-gray-400 appearance-none focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 peer">
                {lugares.map(lugar =>
                    <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                )}
            </select>
            <label
                className="absolute text-sm text-gray-500 rounded-t bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Elije un lugar</label>
        
            <InputError message={paradaErros.idLugar} />
        </div>
    </div>
}

export default ParadaForm