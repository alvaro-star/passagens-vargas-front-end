import InputError from "@/Components/InputError"
import IParadaForm from "../Types/IParadaForm"
import IParadaFormErro from "../Types/IParadaFormErro"
import { useEffect, useState } from "react"
import ILugar from "@/Types/ILugar"
import TextInputObject from "@/Pages/Publico/Components/TextInputObject"
import http from "@/http"
import SelectCostumized from "@/Components/SelectCostumized"
import ICiudad from "@/Types/ICiudad"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
interface Props {
    parada: IParadaForm
    paradaErros: IParadaFormErro
    setParada: (parada: IParadaForm) => void
}

const ParadaForm = ({ parada, paradaErros, setParada }: Props) => {
    const [ciudad, setCiudad] = useState<ICiudad | null>(null)
    const [lugares, setLugares] = useState<ILugar[]>([])

    useEffect(() => {
        if (ciudad) {
            http.get<ILugar[]>('ciudades/' + ciudad.id + '/lugares')
                .then(resposta => {
                    setLugares(resposta.data.map(lugar => ({ ...lugar, nombre: capitalizeFirstLetter(lugar.nombre) })))
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
    return <div className="w-full space-y-4">
        <div className="">
            <TextInputObject className="text-center" type="text" min={1} value={parada.plataforma} onChange={(eve) => editar('plataforma', eve.target.value)} labelValue="Plataforma" />
            <InputError message={paradaErros.plataforma} />
        </div>
        <div className="">
            <TextInputObject type="datetime-local" value={parada.dataHora} onChange={(eve) => editar('dataHora', eve.target.value)} labelValue="Fecha de llegada" />
            <InputError className="w-full ml-2" message={paradaErros.dataHora} />
        </div>
        <div className="text-black">
            <SelectCostumized ciudadElejida={ciudad} setCiudadElejida={setCiudad} labelValue="Nombre dela Ciudad" />
        </div>

        <div className="relative w-full">
            <select disabled={ciudad == null}
                value={parada.idLugar} onChange={eve => editar('idLugar', eve.target.value)}
                className="block w-full px-2.5 py-2.5 h-11 text-gray-900 bg-white rounded border border-gray-400 appearance-none focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 peer">
                {lugares.map(lugar =>
                    <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                )}
            </select>
            <label
                className="absolute text-sm text-gray-500 rounded-t bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Elije un lugar</label>
            <InputError className="w-full" message={paradaErros.idLugar} />
        </div>
    </div>
}

export default ParadaForm