import { useEffect, useState } from "react"
import http from "@/http"
import { useNavigate } from "react-router-dom"
import IType from "@/Types/IType"
import ILugar from "@/Types/ILugar"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import isNumber from "@/Helpers/Validate/isNumber"
import isFloatPositve from "@/Helpers/Validate/isFloatPositive"
import CustomAxiosResponse from "@/Types/AxiosResponse/CustomAxiosResponse"
import ContainerShowTemplate from "@/Pages/Layout/ContainerShowTemplate"
import TextInputEmpresa from "@/Components/TextInputEmpresa"
import InputError from "@/Components/FormComponents/InputError"
import SelectCiudad from "@/Components/FormComponents/SelectCiudad"
import SelectComponent from "@/Components/FormComponents/SelectComponent"
import PrimaryButton from "@/Components/Buttons/PrimaryButton"
import CookieEmpresaId from "@/Helpers/CookieGenerate/CookieEmpresaId"
import IPage from "@/Types/IPage"
import IAutobus from "@/Types/IAutobus"


const ViajesCreatePage = () => {
    const [idAutobus, setIdAutobus] = useState('')
    const navigate = useNavigate()

    const [horasViaje, setHorasViaje] = useState('');
    const [carril, setCarril] = useState('');
    const [fechaSalida, setFechaSalida] = useState(new Date().toISOString().slice(0, 16));

    const [autobuses, setAutobuses] = useState<IAutobus[]>([])

    const [ciudadSalida, setCiudadSalida] = useState<IType | null>(null)
    const [lugaresSalida, setLugaresSalida] = useState<ILugar[]>([])
    const [idLugarSalida, setIdLugarSalida] = useState('')

    const [ciudadDestino, setCiudadDestino] = useState<IType | null>(null)
    const [lugaresDestino, setLugaresDestino] = useState<ILugar[]>([])
    const [idLugarDestino, setIdLugarDestino] = useState("")

    const [autobus, setAutobus] = useState<IAutobus>()
    const [precio1, setPrecio1] = useState('')
    const [precio2, setPrecio2] = useState('')
    const [erros, setErros] = useState<Record<string, string>>({})


    useEffect(() => {
        if (!idAutobus) return
        http.get<IAutobus>(`autobuses/${idAutobus}`)
            .then(({ data }) => setAutobus(data))
    }, [idAutobus])

    const fetchLugares = (ciudad: IType | null, setIdLugar: (idLugar: string) => void, setLugares: (lugares: ILugar[]) => void) => {
        if (ciudad) {
            http.get<ILugar[]>(`ciudades/${ciudad.value}/lugares`)
                .then(({ data }) => {
                    setLugares(data.map(lugar => ({ ...lugar, nombre: capitalizeFirstLetter(lugar.nombre) })))
                    if (data.length > 0) setIdLugar(data[0].id.toString())
                })
        }
    }

    useEffect(() => {
        const idEmpresa = CookieEmpresaId.get()
        const params = { size: 20 }
        http.get<IPage<IAutobus>>(`autobuses/from/${idEmpresa}`, { params })
            .then(({ data }) => {
                setAutobuses(data.content)
            })
    }, [])

    useEffect(() => {
        fetchLugares(ciudadSalida, setIdLugarSalida, setLugaresSalida)
    }, [ciudadSalida])

    useEffect(() => {
        fetchLugares(ciudadDestino, setIdLugarDestino, setLugaresDestino)
    }, [ciudadDestino])

    const validarFormData: () => Record<string, string> = () => {
        const errorsForm: Record<string, string> = {};
        if (idLugarDestino == '')
            errorsForm.idLugarDestino = 'Elije un lugar'
        if (idLugarSalida == '')
            errorsForm.idLugarSalida = 'Elije una lugar'
        if (!isNumber(carril))
            errorsForm.plataforma = "No puede ser nulo"

        if (!isNumber(horasViaje) || parseInt(horasViaje) <= 0)
            errorsForm.horasViaje = "Informe un valor valido"
        if (fechaSalida == '')
            errorsForm.fechaSalida = "La fecha es invalida"
        if (isNaN((new Date(fechaSalida)).getTime()))
            errorsForm.fechaSalida = "La fecha es invalida"

        if (!isFloatPositve(precio1))
            errorsForm.precioPiso1 = 'Valor inválido'

        if (autobus?.pisos?.length == 2 && !isFloatPositve(precio2))
            errorsForm.precioPiso2 = 'Valor inválido'
        return errorsForm
    }


    const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        const errorsForm = validarFormData()
        console.log(Object.values(errorsForm).length != 0);

        if (Object.values(errorsForm).length != 0) {
            setErros(errorsForm)
            return
        }
        try {
            const formData = {
                idAutobus: idAutobus,
                plataforma: carril,
                fechaSalida: fechaSalida,
                idLugarSalida: idLugarSalida,
                horasViaje: horasViaje,
                idLugarDestino: idLugarDestino,
                precioPiso1: parseFloat(precio1),
                precioPiso2: (autobus?.pisos?.length == 2) ? parseFloat(precio2) : 0
            };
            await http.post('empresa/viajes/create', formData)
            navigate(-1)
            return
        } catch (erro: CustomAxiosResponse | any) {
            if (erro.status == 422) {
                const formError = processErro422(erro)
                setErros(formError)
            } else if (erro.status == 409) {
                alert(erro.response.data.conteudo)
            } else alert("Hubo un error en la solicitud...")
        }
    }

    const processErro422 = (errorAxios: CustomAxiosResponse) => {
        let errors: Record<string, string> = {}
        if (errorAxios.status != 422) return {}
        const data = errorAxios.response?.data
        if (data?.errors)
            data.errors.forEach(error => errors[error.name] = error.message)
        return errors
    }

    return <ContainerShowTemplate
        header={
            <h1 className="text-2xl font-semibold text-center w-full">
                Registre los datos del nuevo Viaje
            </h1>
        }>
        <div className="max-w-2xl mx-auto">
            <form className="bg-white border p-5 flex flex-col rounded" onSubmit={enviar}>
                <h2 className="text-xl font-semibold mb-3">
                    Datos del Viaje
                </h2>
                <SelectComponent className="mb-2.5" labelValue="Autobus" onChange={e => setIdAutobus(e.target.value)}>
                    {autobuses.map(autobus =>
                        <option key={autobus.id} value={autobus.id}>
                            {autobus.placa}
                        </option>
                    )}
                </SelectComponent>
                <div className="flex gap-3">
                    <div className="block">
                        <TextInputEmpresa className="w-20" labelValue="Carril" value={carril} setValue={setCarril} />
                        <InputError className="w-full ml-2" message={erros.plataforma} />
                    </div>
                    <div className="block w-full">
                        <TextInputEmpresa className="w-full" labelValue="Fecha Salida" type="datetime-local" value={fechaSalida} setValue={setFechaSalida} />
                        <InputError className="w-full ml-2" message={erros.fechaSalida} />
                    </div>
                    <div className="block">
                        <TextInputEmpresa className="w-42" labelValue="Horas de Viaje" value={horasViaje} setValue={setHorasViaje} />
                        <InputError className="w-full ml-2" message={erros.horasViaje} />
                    </div>
                </div>
                <div className="grid grid-cols-2 gap-3 mt-3">
                    <div className="space-y-3">
                        <p className="font-semibold">Origen</p>
                        <SelectCiudad labelValue="Ciudad" ciudadElejida={ciudadSalida} setCiudadElejida={setCiudadSalida} />
                        <SelectComponent labelValue="Lugar" value={idLugarSalida} onChange={e => setIdLugarSalida(e.target.value)}>
                            {lugaresSalida.map(lugar => <option key={lugar.id} value={lugar.id}>
                                {lugar.nombre}
                            </option>)}
                        </SelectComponent>
                        <InputError className="w-full ml-2" message={erros.idLugarSalida} />
                    </div>
                    <div className="space-y-3">
                        <p className="font-semibold">Destino</p>
                        <SelectCiudad labelValue="Ciudad" ciudadElejida={ciudadDestino} setCiudadElejida={setCiudadDestino} />
                        <SelectComponent labelValue="Lugar" value={idLugarDestino} onChange={e => setIdLugarDestino(e.target.value)}>
                            {lugaresDestino.map(lugar => <option key={lugar.id} value={lugar.id}>
                                {lugar.nombre}
                            </option>)}
                        </SelectComponent>
                        <InputError className="w-full ml-2" message={erros.idLugarDestino} />
                    </div>
                </div>
                <section className=" flex justify-between items-center mt-5">
                    <p className="text-lg font-semibold my-2">Precio</p>
                    <div className="flex gap-2">
                        <div className="w-full">
                            <TextInputEmpresa className="w-44" value={precio1} setValue={setPrecio1} labelValue="Precio del piso 1 (Bs)" />
                            <InputError className="w-full ml-2" message={erros.precioPiso1} />
                        </div>
                        {autobus?.pisos?.length == 2 && <div className="w-full">
                            <TextInputEmpresa className="w-44" value={precio2} setValue={setPrecio2} labelValue="Precio del piso 2 (Bs)" />
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