import React, { FormHTMLAttributes, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa";
import InputError from "@/Components/InputError"
import dataConvert from "@/Helpers/Date/dateConvert"
import DatePickerCostumized from "@/Components/DatePickerCostumized"
import IFormViajeFuncionario from "../Types/IFormViajeFuncionario";
import SelectCostumized from "@/Components/SelectCostumized";
import ICiudad from "@/Types/ICiudad";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
    formData?: IFormViajeFuncionario
    ciudadSalidaProps?: ICiudad | null
    ciudadDestinoProps?: ICiudad | null
}

interface Erros {
    ciudadSalida: string,
    ciudadDestino: string,
    fechaIda: string
}

const FormInlineTemplateFuncionario = ({ ciudadSalidaProps, ciudadDestinoProps, formData, className = '', ...props }: Props) => {
    const navigate = useNavigate();
    const [ciudadSalida, setCiudadSalida] = useState<ICiudad | null>(null);
    const [ciudadDestino, setCiudadDestino] = useState<ICiudad | null>(null);
    const [fechaIda, setFechaIda] = useState<Date | null>(new Date());
    const [errors, setErrors] = useState<Erros>({
        ciudadSalida: '',
        ciudadDestino: '',
        fechaIda: ''
    });

    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault();
        let erros: Erros = {
            ciudadSalida: !ciudadSalida ? 'Escoje una ciudad válida' : '',
            ciudadDestino: !ciudadDestino ? 'Escoje una ciudad válida' : '',
            fechaIda: !fechaIda ? 'Valor inválido' : ''
        };

        if (ciudadSalida && ciudadDestino && ciudadSalida.id === ciudadDestino.id) {
            erros.ciudadSalida = 'La salida es igual al destino';
            erros.ciudadDestino = 'El destino es igual a la salida';
        }

        if (!Object.values(erros).some(error => !!error)) {
            const formViajes = {
                idCiudadSalida: ciudadSalida!.id,
                idCiudadDestino: ciudadDestino!.id,
                fechaSalida: dataConvert(fechaIda!)
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
        }
    }, [formData, ciudadSalidaProps, ciudadDestinoProps, navigate]);

    return (
        <form className={`max-w-5xl p-5 mx-auto shadow-xl bg-white flex items-center justify-between gap-5 rounded ${className}`}
            {...props}
            onSubmit={enviar}>
            <div className="w-full">
                <SelectCostumized ciudadElejida={ciudadSalida} setCiudadElejida={setCiudadSalida} labelValue="Ciudad de Origen" />
                <InputError message={errors.ciudadSalida} />
            </div>
            <div className="w-full">
                <SelectCostumized ciudadElejida={ciudadDestino} setCiudadElejida={setCiudadDestino} labelValue="Ciudad de Destino" />
                <InputError message={errors.ciudadDestino} />
            </div>
            <div>
                <DatePickerCostumized dataExtern={fechaIda} setDataExtern={setFechaIda} labelValue="Fecha Ida" />
                <InputError message={errors.fechaIda} />
            </div>
            <div className="flex items-center h-full justify-center">
                <button className="h-9 w-9 rounded bg-cyan-500 text-white grid place-content-center">
                    <FaSearch />
                </button>
            </div>
        </form>
    );
};


export default FormInlineTemplateFuncionario