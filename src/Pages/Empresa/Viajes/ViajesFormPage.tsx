import InputError from "@/Components/InputError"
import InputLabel from "@/Components/InputLabel"
import SelectCiudad from "@/Components/SelectCiudad"
import TextInput234 from "@/Components/TextInput234"
import ILugar from "@/Types/ILugar"
import IType from "@/Types/IType"
import IViaje from "@/Types/IViaje"
import http from "@/http"
import { useEffect, useState } from "react"

interface ParadaFormErro {
    plataforma: string,
    dataHora: string,
    idLugar: string
}

interface IErros {
    idAutobus: string,
    precioPiso1: string,
    precioPiso2: string,
    salida: ParadaFormErro
    destino: ParadaFormErro
}

interface Props {
    idAutobus: number
    nPisos: number
    addViaje: (novo: IViaje) => void
    setOpenForm: (value: boolean) => void
}

const ViajesFormPage = ({ setOpenForm, addViaje, idAutobus, nPisos }: Props) => {
    const [plataformaSalida, setPlataformaSalida] = useState<string>('')
    const [ciudadSalida, setCiudadSalida] = useState<IType | null>(null)
    const [fechaEncuentroSalida, setFechaEncuentroSalida] = useState<string>('')
    const [lugaresSalida, setLugaresSalidas] = useState<ILugar[]>([])
    const [idLugarSalida, setIdLugarSalida] = useState('')

    const [plataformaDestino, setPlataformaDestino] = useState<string>('')
    const [ciudadDestino, setCiudadDestino] = useState<IType | null>(null)
    const [fechaEncuentroDestino, setFechaEncuentroDestino] = useState<string>('')
    const [lugaresDestino, setLugaresDestino] = useState<ILugar[]>([])
    const [idLugarDestino, setIdLugarDestino] = useState('')

    const [precio1, setPrecio1] = useState('0')
    const [precio2, setPrecio2] = useState('0')

    const construirParadaErro = () => {
        return {
            plataforma: '',
            dataHora: '',
            idLugar: ''
        }
    }

    const construirViajeErro = () => {
        let salida = construirParadaErro()
        let destino = construirParadaErro()
        return {
            idAutobus: '',
            precioPiso1: '',
            precioPiso2: '',
            salida: salida,
            destino: destino
        }
    }

    const [erros, setErros] = useState<IErros>(construirViajeErro())

    useEffect(() => {
        if (ciudadSalida) {
            http.get<ILugar[]>('ciudades/' + ciudadSalida.value + '/lugares')
                .then(resposta => {
                    setLugaresSalidas(resposta.data)
                    if (resposta.data.length > 0) {
                        setIdLugarSalida(resposta.data[0].id.toString())
                    }
                })
        }
    }, [ciudadSalida])

    useEffect(() => {
        if (ciudadDestino) {
            http.get<ILugar[]>('ciudades/' + ciudadDestino.value + '/lugares')
                .then(resposta => {
                    setLugaresDestino(resposta.data)
                    if (resposta.data.length > 0) {
                        setIdLugarDestino(resposta.data[0].id.toString())
                    }
                })
        }
    }, [ciudadDestino])

    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        let errosInFuncton = construirViajeErro()
        let podeEnviar = true;
        if (idLugarSalida === '') {
            podeEnviar = false
            errosInFuncton.salida.idLugar = 'Escoje un valor válido'
        }

        if (!parseInt(plataformaSalida)) {
            podeEnviar = false
            errosInFuncton.salida.plataforma = 'Valor inválido'
        }

        if (fechaEncuentroSalida === '') {
            podeEnviar = false
            errosInFuncton.salida.dataHora = 'Valor inválido'
        }

        if (idLugarDestino === '') {
            podeEnviar = false
            errosInFuncton.destino.idLugar = 'Escoje un valor válido'
        }

        if (!parseInt(plataformaDestino)) {
            podeEnviar = false
            errosInFuncton.destino.plataforma = 'Valor inválido'
        }

        if (fechaEncuentroDestino === '') {
            podeEnviar = false
            errosInFuncton.destino.dataHora = 'Valor inválido'
        }

        if (!parseFloat(precio1)) {
            podeEnviar = false
            errosInFuncton.precioPiso1 = 'Valor inválido'
        } else if (parseFloat(precio1) <= 0) {
            podeEnviar = false
            errosInFuncton.precioPiso1 = 'Valor inválido'
        }

        if (nPisos == 2) {
            if (!parseFloat(precio2)) {
                podeEnviar = false
                errosInFuncton.precioPiso2 = 'Valor inválido'
            } else if (parseFloat(precio2) <= 0) {
                podeEnviar = false
                errosInFuncton.precioPiso2 = 'Valor inválido'
            }
        }

        setErros(errosInFuncton)

        if (podeEnviar) {
            let formData = {
                idAutobus: idAutobus,
                salida: {
                    plataforma: plataformaSalida,
                    dataHora: fechaEncuentroSalida,
                    idLugar: idLugarSalida
                },
                destino: {
                    plataforma: plataformaDestino,
                    dataHora: fechaEncuentroDestino,
                    idLugar: idLugarDestino
                },
                precioPiso1: parseFloat(precio1),
                precioPiso2: 0
            }

            if (nPisos == 2) {
                formData["precioPiso2"] = parseFloat(precio2)
            }

            http.post('viajes/create', formData)
                .then(resposta => { 
                    addViaje({ idAutobus: idAutobus, codigo: resposta.data.codigo }) 
                })
        }
    }

    return (
        <form className="bg-gray-200 p-5 rounded flex flex-col" onSubmit={enviar}>
            <div className="relative">
                <h1 className="text-2xl my-4 font-semibold text-center">Registre los datos del nuevo Viaje</h1>
                <button className="absolute top-0 right-0 bg-red-500 h-8 w-8 text-white rounded flex items-center justify-center" onClick={() => setOpenForm(false)}>X</button>
            </div>
            <section>
                <p className="text-lg font-semibold">
                    Datos dela Salida
                </p>

                <div className="flex items-center space-x-4">
                    <div className="w-16">
                        <InputLabel value="Plataforma" />
                        <TextInput234 className="text-center" type="number" min={1} value={plataformaSalida} setValue={setPlataformaSalida} />
                        <InputError message={erros.salida.plataforma} />
                    </div>
                    <div>
                        <InputLabel value="Fecha de llegada" />
                        <TextInput234 type="datetime-local" value={fechaEncuentroSalida} setValue={setFechaEncuentroSalida} />
                        <InputError message={erros.salida.dataHora} />
                    </div>
                    <div className="w-64">
                        <InputLabel value="Ciudad Salida" />
                        <SelectCiudad option={ciudadSalida} setOption={setCiudadSalida} />
                    </div>

                    <div>
                        <InputLabel value="Elije un lugar" />
                        <select disabled={ciudadSalida == null}
                            value={idLugarSalida} onChange={eve => setIdLugarSalida(eve.target.value)}
                            className="w-64 p-2 border focus:outline-blue-300 border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded shadow-sm">
                            {lugaresSalida.map(lugar =>
                                <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                            )}
                        </select>
                        <InputError message={erros.salida.idLugar} />
                    </div>
                </div>
            </section>
            <section className="mt-3">
                <p className="text-lg font-semibold">
                    Datos del destino
                </p>
                <div className="flex items-center space-x-4">
                    <div className="w-16">
                        <InputLabel value="Plataforma" />
                        <TextInput234 className="text-center" type="number" value={plataformaDestino} setValue={setPlataformaDestino} />
                        <InputError message={erros.destino.plataforma} />
                    </div>
                    <div>
                        <InputLabel value="Fecha de llegada" />
                        <TextInput234 type="datetime-local" value={fechaEncuentroDestino} setValue={setFechaEncuentroDestino} />
                        <InputError message={erros.destino.dataHora} />
                    </div>
                    <div className="w-64">
                        <InputLabel value="Ciudad Destino" />
                        <SelectCiudad option={ciudadDestino} setOption={setCiudadDestino} />
                    </div>

                    <div>
                        <InputLabel value="Elije un lugar" />
                        <select disabled={ciudadDestino == null}
                            value={idLugarDestino} onChange={eve => setIdLugarDestino(eve.target.value)}
                            className="w-64 p-2 border focus:outline-blue-300 border-gray-400 focus:border-indigo-500 focus:ring-indigo-500 rounded shadow-sm">
                            {lugaresDestino.map(lugar =>
                                <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                            )}
                        </select>
                        <InputError message={erros.destino.idLugar} />
                    </div>
                </div>
            </section>
            <section className="">
                <p className="text-lg font-semibold my-2">Regitre los precios del viaje</p>
                <div className="flex gap-2">
                    <div className="w-full">
                        <InputLabel value="Precio del primer piso (Bs)" />
                        <TextInput234 value={precio1} setValue={setPrecio1} />
                        <InputError message={erros.precioPiso1} />
                    </div>
                    {nPisos == 2 &&
                        <div className="w-full">
                            <InputLabel value="Precio del segundo piso (Bs)" />
                            <TextInput234 value={precio2} setValue={setPrecio2} />
                            <InputError message={erros.precioPiso2} />
                        </div>
                    }
                </div>
            </section>
            <div className="text-center mt-5">
                <button className="bg-black py-1.5 px-3 rounded-lg font-semibold text-white" type="submit">
                    ENVIAR
                </button>
            </div>
        </form>
    )
}

export default ViajesFormPage