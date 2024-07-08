import React, { FormHTMLAttributes, useEffect, useState } from "react"
import { useNavigate } from "react-router-dom"
import { FaSearch } from "react-icons/fa";
import InputError from "@/Components/InputError"
import dataConvert from "@/Helpers/Date/dateConvert"
import DatePickerCostumized from "@/Components/DatePickerCostumized"
import SelectCostumized from "@/Components/SelectCostumized";
import ICiudad from "@/Types/ICiudad";
import http from "@/http";
import IFormViaje from "../Types/IFormViaje";
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
}

interface Erros {
    ciudadSalida: string,
    ciudadDestino: string,
    fechaIda: string,
    fechaVuelta: string
}

const FormInlineTemplateIndependent = ({ className = '', ...props }: Props) => {
    const navigate = useNavigate();
    const [ciudadSalida, setCiudadSalida] = useState<ICiudad | null>(null);
    const [ciudadDestino, setCiudadDestino] = useState<ICiudad | null>(null);
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

        if (ciudadSalida && ciudadDestino && ciudadSalida.id === ciudadDestino.id) {
            erros.ciudadSalida = 'La salida es igual al destino';
            erros.ciudadDestino = 'El destino es igual a la salida';
        }

        if (!Object.values(erros).some(error => !!error)) {
            const formViajes = {
                idCiudadSalida: ciudadSalida!.id,
                idCiudadDestino: ciudadDestino!.id,
                fechaSalida: dataConvert(fechaIda!),
                fechaVuelta: dataConvert(fechaVuelta!)
            };

            sessionStorage.setItem("formViaje", JSON.stringify(formViajes));
            navigate('/viajes');
        }

        setErrors(erros);
    };


    const fetchCiudad = (idCiudad: number, setter: React.Dispatch<React.SetStateAction<ICiudad | null>>) => {
        http.get<ICiudad>(`ciudades/${idCiudad}`)
            .then(resposta => {
                setter({ ...resposta.data, nombre: capitalizeFirstLetter(resposta.data.nombre) })
            });
    };
    useEffect(() => {
        let cookie1 = sessionStorage.getItem("formViaje");
        const formViaje: IFormViaje = cookie1 ? JSON.parse(cookie1) : {};
        if (formViaje && formViaje.idCiudadSalida && formViaje.idCiudadDestino) {
            fetchCiudad(formViaje.idCiudadSalida, setCiudadSalida)
            fetchCiudad(formViaje.idCiudadDestino, setCiudadDestino)
            let dataSalida = new Date(formViaje.fechaSalida + "T00:00:00")
            setFechaIda(dataSalida);
            setFechaVuelta(new Date(formViaje.fechaVuelta + "T00:00:00"));
        }
    }, []);

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


export default FormInlineTemplateIndependent