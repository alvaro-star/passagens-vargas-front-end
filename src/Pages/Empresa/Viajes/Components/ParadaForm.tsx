import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
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
        let paradaAux = { ...parada }
        let alterou = true

        switch (campo) {
            case 'plataforma':
                paradaAux.plataforma = value
                break;
            case 'dataHora':
                paradaAux.dataHora = value
                break;
            case 'idLugar':
                paradaAux.idLugar = value
                break;
            default:
                alterou = false
                break;
        }
        if (alterou) {
            setParada(paradaAux)
        }
    }
    return <div className="flex items-center space-x-4">
        <div className="w-16">
            <InputLabel value="Plataforma" />
            <TextInputObject className="text-center" type="number" min={1} value={parada.plataforma} onChange={(eve) => editar('plataforma', eve.target.value)} />
            <InputError message={paradaErros.plataforma} />
        </div>
        <div>
            <InputLabel value="Fecha de llegada" />
            <TextInputObject type="datetime-local" value={parada.dataHora} onChange={(eve) => editar('dataHora', eve.target.value)} />
            <InputError message={paradaErros.dataHora} />
        </div>
        <div className="w-64">
            <InputLabel value="Ciudad Salida" />
            <SelectCiudad option={ciudad} setOption={setCiudad} />
        </div>

        <div>
            <InputLabel value="Elije un lugar" />
            <select disabled={ciudad == null}
                value={parada.idLugar} onChange={eve => editar('idLugar', eve.target.value)}
                className="w-64 p-2 border focus:outline-blue-300 border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded shadow-sm">
                {lugares.map(lugar =>
                    <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                )}
            </select>
            <InputError message={paradaErros.idLugar} />
        </div>
    </div>
}

export default ParadaForm