import { useEffect, useState } from "react"
import InputError from "@/Components/InputError"
import TextInput234 from "@/Components/TextInput234"
import http from "@/http"
import { useNavigate, useParams } from "react-router-dom"
import ParadaForm from "../Viajes/Components/ParadaForm"
import IParadaForm from "../Viajes/Types/IParadaForm"
import IParadaFormErro from "../Viajes/Types/IParadaFormErro"
import IAutobusExtends from "./AutobusesShowPage/Types/IAutobusExtends"
import IError from "@/Types/IErrors/IError"

interface IErros {
    [key: string]: string | IParadaFormErro; // Firma de índice
    idAutobus: string,
    precioPiso1: string,
    precioPiso2: string,
    salida: IParadaFormErro,
    destino: IParadaFormErro,
}
const construirParadaErro = () => {
    return { plataforma: '', dataHora: '', idLugar: '' }
}

const construirViajeErro = () => {
    let salida = construirParadaErro()
    let destino = construirParadaErro()
    return { idAutobus: '', precioPiso1: '', precioPiso2: '', salida: salida, destino: destino }
}

const ViajesCreatePage = () => {
    const { id } = useParams()
    const navigate = useNavigate()

    const [salida, setSalida] = useState<IParadaForm>({ plataforma: '', dataHora: '', idLugar: '', id: '' })
    const [destino, setDestino] = useState<IParadaForm>({ plataforma: '', dataHora: '', idLugar: '', id: '' })
    const [autobus, setAutobus] = useState<IAutobusExtends>()
    const [precio1, setPrecio1] = useState('')
    const [precio2, setPrecio2] = useState('')
    const [erros, setErros] = useState<IErros>(construirViajeErro())

    const validarParada = (parada: IParadaForm, errosParada: IParadaFormErro) => {
        let valido = true
        if (parada.idLugar === '') {
            valido = false
            errosParada.idLugar = 'Escoje un valor válido'
        }

        if (!parseInt(parada.plataforma)) {
            valido = false
            errosParada.plataforma = 'Valor inválido'
        }

        if (parada.dataHora === '') {
            valido = false
            errosParada.dataHora = 'Valor inválido'
        }

        return valido;
    }

    useEffect(() => {
        if (id) {
            http.get<IAutobusExtends>(`autobuses/${id}`)
                .then(resposta => setAutobus(resposta.data))
        }
    }, [id])


    const enviar = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        console.log("Click");

        let errosInFuncton: IErros = construirViajeErro()
        let podeEnviar = true;
        podeEnviar = validarParada(salida, errosInFuncton.salida)
        podeEnviar = validarParada(destino, errosInFuncton.destino)
        const dataSaida = new Date(salida.dataHora)
        const dataDestino = new Date(destino.dataHora)

        if (dataSaida >= dataDestino) {
            podeEnviar = false
            errosInFuncton.destino.dataHora = 'El destino tiene una fecha anterior ala dela salida'
        }
        if (!parseFloat(precio1)) {
            podeEnviar = false
            errosInFuncton.precioPiso1 = 'Valor inválido'
        } else if (parseFloat(precio1) <= 0) {
            podeEnviar = false
            errosInFuncton.precioPiso1 = 'Valor inválido'
        }

        if (autobus?.pisos.length == 2) {
            if (!parseFloat(precio2)) {
                podeEnviar = false
                errosInFuncton.precioPiso2 = 'Valor inválido'
            } else if (parseFloat(precio2) <= 0) {
                podeEnviar = false
                errosInFuncton.precioPiso2 = 'Valor inválido'
            }
        }

        if (podeEnviar) {
            let formData = {
                idAutobus: id, salida: salida, destino: destino, precioPiso1: parseFloat(precio1), precioPiso2: 0
            }

            if (autobus?.pisos.length == 2)
                formData["precioPiso2"] = parseFloat(precio2)

            http.post('empresa/viajes/create', formData)
                .then(() => {
                    setErros(errosInFuncton)
                    navigate(-1)
                })
                .catch(erro => {
                    let salidaError: IParadaFormErro = construirParadaErro();
                    let destinoError: IParadaFormErro = construirParadaErro();
                    let errosInFuncton = construirViajeErro();

                    if (erro.response && erro.response.data && erro.response.data.errors) {
                        erro.response.data.errors.forEach((erroItem: IError) => {
                            let erroNome = erroItem.name.split('.');
                            if (erroNome.length === 2) {
                                if (erroNome[0] === 'salida') {
                                    salidaError[erroNome[1]] = erroItem.message;
                                } else if (erroNome[0] === 'destino') {
                                    destinoError[erroNome[1]] = erroItem.message;
                                }
                            } else {
                                errosInFuncton = { ...errosInFuncton, [erroItem.name]: erroItem.message }
                            }
                        });
                    }

                    // Actualizar los errores en el estado
                    setErros({
                        ...errosInFuncton,
                        salida: salidaError,
                        destino: destinoError
                    });
                    console.log(erro);

                });

        } else
            setErros(errosInFuncton)
    }

    return <div className="max-w-2xl mx-auto mt-10">
        <form className="bg-white border p-5 flex flex-col" onSubmit={enviar}>
            <h1 className="text-2xl font-semibold text-center">Registre los datos del nuevo Viaje para {autobus?.placa}</h1>
            <div className="grid sm:grid-cols-2 gap-4">
                <section>
                    <p className="text-lg font-semibold">
                        Datos dela Salida
                    </p>
                    <ParadaForm parada={salida} paradaErros={erros.salida} setParada={setSalida} />
                </section>
                <section className="">
                    <p className="text-lg font-semibold">
                        Datos del destino
                    </p>
                    <ParadaForm parada={destino} paradaErros={erros.destino} setParada={setDestino} />
                </section>
            </div>
            <section className="">
                <p className="text-lg font-semibold my-2">Regitre los precios del viaje</p>
                <div className="flex gap-2">
                    <div className="w-full">
                        <TextInput234 value={precio1} setValue={setPrecio1} labelValue="Precio del primer piso (Bs)" />
                        <InputError message={erros.precioPiso1} />
                    </div>
                    {autobus?.pisos.length == 2 && <div className="w-full">
                        <TextInput234 value={precio2} setValue={setPrecio2} labelValue="Precio del segundo piso (Bs)" />
                        <InputError message={erros.precioPiso2} />
                    </div>}
                </div>
            </section>
            <div className="text-center mt-5">
                <button className="bg-black py-1.5 px-3 rounded font-semibold text-white" type="submit">
                    ENVIAR
                </button>
            </div>
        </form>
    </div>
}
export default ViajesCreatePage