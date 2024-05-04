import React, { FormHTMLAttributes, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa";
import InputError from "@/Components/InputError"
import IFormViaje from "../Types/IFormViaje"
import SelectCiudad from "../../../Components/SelectCiudad";
import IType from "@/Types/IType"
import dataConvert from "@/Helpers/Date/dateConvert"
import DatePickerCostumized from "@/Components/DatePickerCostumized"

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
    formData?: IFormViaje
    ciudadSalidaProps: IType | null
    ciudadDestinoProps: IType | null
}

interface Erros {
    ciudadSalida: string,
    ciudadDestino: string,
    fechaIda: string,
    fechaVuelta: string
}
const FormInlineTemplate = ({ ciudadSalidaProps, ciudadDestinoProps, formData, className = '', ...props }: Props) => {
    const navigate = useNavigate();
    const [ciudadSalida, setCiudadSalida] = useState<IType | null>(null);
    const [ciudadDestino, setCiudadDestino] = useState<IType | null>(null);
    const [fechaIda, setFechaIda] = useState<Date | null>(new Date());
    const [fechaVuelta, setFechaVuelta] = useState<Date | null>(new Date());
    const [errors, setErrors] = useState<Erros>({
        ciudadSalida: '',
        ciudadDestino: '',
        fechaIda: '',
        fechaVuelta: ''
    });

    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault();
        let erros: Erros = {
            ciudadSalida: !ciudadSalida ? 'Escoje una ciudad válida' : '',
            ciudadDestino: !ciudadDestino ? 'Escoje una ciudad válida' : '',
            fechaIda: !fechaIda ? 'Valor inválido' : '',
            fechaVuelta: ''
        };

        if (ciudadSalida && ciudadDestino && ciudadSalida.value === ciudadDestino.value) {
            erros.ciudadSalida = 'La salida es igual al destino';
            erros.ciudadDestino = 'El destino es igual a la salida';
        }

        if (!Object.values(erros).some(error => !!error)) {
            const formViajes = {
                idCiudadSalida: ciudadSalida!.value,
                idCiudadDestino: ciudadDestino!.value,
                fechaSalida: dataConvert(fechaIda!),
                fechaVuelta: dataConvert(fechaVuelta!)
            };

            sessionStorage.setItem("formViaje", JSON.stringify(formViajes));
            navigate('/viajes');
        }

        setErrors(erros);
    };

    useEffect(() => {
        if (formData && ciudadSalidaProps && ciudadDestinoProps) {
            setCiudadSalida(ciudadSalidaProps)
            setCiudadDestino(ciudadDestinoProps)
            setFechaIda(new Date(formData.fechaSalida + "T00:00:00"));
            setFechaVuelta(new Date(formData.fechaVuelta + "T00:00:00"));
        }
    }, [formData, ciudadSalidaProps, ciudadDestinoProps, navigate]);

    return (
        <form className={`max-w-5xl p-5 mx-auto shadow-xl bg-white flex items-center justify-between gap-5 rounded ${className}`}
            {...props}
            onSubmit={enviar}>
            <div className="w-full">
                <SelectCiudad option={ciudadSalida} setOption={setCiudadSalida} labelValue="Salida" placeholder="Ciudad de Origen" />
                <InputError message={errors.ciudadSalida} />
            </div>
            <div className="w-full">
                <SelectCiudad option={ciudadDestino} setOption={setCiudadDestino} labelValue="Destino" placeholder="Ciudad de Destino" />
                <InputError message={errors.ciudadDestino} />
            </div>
            <div>
                <DatePickerCostumized dataExtern={fechaIda} setDataExtern={setFechaIda} labelValue="Fecha Ida" />
                <InputError message={errors.fechaIda} />
            </div>
            <div>
                <DatePickerCostumized dataExtern={fechaVuelta} setDataExtern={setFechaVuelta} labelValue="Fecha Vuelta" />
                <InputError message={errors.fechaVuelta} />
            </div>
            <div className="flex items-center h-full justify-center">
                <button className="h-9 w-9 rounded bg-cyan-500 text-white grid place-content-center">
                    <FaSearch />
                </button>
            </div>
        </form>
    );
};


export default FormInlineTemplate