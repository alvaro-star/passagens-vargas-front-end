import { useEffect, useState } from "react"
import InputError from "@/Components/FormComponents/InputError"
import TextInputEmpresa from "@/Components/TextInputEmpresa"
import http from "@/http"
import { useNavigate, useParams } from "react-router-dom"
import ParadaForm from "../Viajes/Components/ParadaForm"
import IParadaForm from "../Viajes/Types/IParadaForm"
import IParadaFormErro from "../Viajes/Types/IParadaFormErro"
import IAutobusExtends from "./AutobusesShowPage/Types/IAutobusExtends"
import IError from "@/Types/IErrors/IError"
import ContainerShowTemplate from "@/Pages/Layout/ContainerShowTemplate"
import PrimaryButton from "@/Components/Buttons/PrimaryButton"

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
                });

        } else
            setErros(errosInFuncton)
    }

    return <ContainerShowTemplate
        header={
            <h1 className="text-2xl font-semibold text-center w-full">
                Registre los datos del nuevo Viaje
            </h1>
        }>
        <div className="max-w-2xl mx-auto">
            <form className="bg-white border p-5 flex flex-col rounded" onSubmit={enviar}>
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
                <section className=" flex justify-between items-center mt-5">
                    <p className="text-lg font-semibold my-2">Precios</p>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <TextInputEmpresa value={precio1} setValue={setPrecio1} labelValue="Precio del piso 1 (Bs)" />
                            <InputError message={erros.precioPiso1} />
                        </div>
                        {autobus?.pisos.length == 2 && <div className="w-full">
                            <TextInputEmpresa value={precio2} setValue={setPrecio2} labelValue="Precio del piso 2 (Bs)" />
                            <InputError message={erros.precioPiso2} />
                        </div>}
                    </div>
                </section>
                <div className="text-center mt-5">
                    <PrimaryButton type="submit">
                        ENVIAR
                    </PrimaryButton>
                </div>
            </form>
        </div>
    </ContainerShowTemplate>
}
export default ViajesCreatePage