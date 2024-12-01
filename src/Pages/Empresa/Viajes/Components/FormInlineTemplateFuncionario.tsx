import React, { FormHTMLAttributes, useEffect, useState } from "react"
import { FaSearch } from "react-icons/fa";
import InputError from "@/Components/FormComponents/InputError"
import dataConvert from "@/Helpers/Date/dateConvert"
import DatePickerCostumized from "@/Components/DatePickerCostumized"
import ICiudad from "@/Types/ICiudad";
import IFormViaje from "@/Pages/Publico/Types/IFormViaje";
import http from "@/http";
import IViaje from "../Types/IViajeIndex";
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter";
import SelectCiudad from "@/Components/FormComponents/SelectCiudad";
import IType from "@/Types/IType";
import CookieEmpresaId from "@/Helpers/CookieGenerate/CookieEmpresaId";

interface Props extends FormHTMLAttributes<HTMLFormElement> {
    className?: string,
    setViajes: (ciudades: IViaje[]) => void
}

interface Erros {
    ciudadSalida: string,
    ciudadDestino: string,
    fechaIda: string
}

const FormInlineTemplateFuncionario = ({ className = '', setViajes, ...props }: Props) => {
    const [ciudadSalida, setCiudadSalida] = useState<IType | null>(null);
    const [ciudadDestino, setCiudadDestino] = useState<IType | null>(null);
    const [fechaIda, setFechaIda] = useState<Date | null>(new Date());
    const [errors, setErrors] = useState<Erros>({
        ciudadSalida: '',
        ciudadDestino: '',
        fechaIda: ''
    });

    const enviar = (eve: React.FormEvent<HTMLFormElement>) => {
        eve.preventDefault();
        let cookie2 = CookieEmpresaId.get()
        let idEmpresa = cookie2 ? cookie2 : ""
        let erros: Erros = {
            ciudadSalida: !ciudadSalida ? 'Escoje una ciudad válida' : '',
            ciudadDestino: '',
            fechaIda: !fechaIda ? 'Valor inválido' : ''
        };

        if (ciudadSalida && ciudadDestino && ciudadSalida.value === ciudadDestino.value) {
            erros.ciudadSalida = 'La salida es igual al destino';
            erros.ciudadDestino = 'El destino es igual a la salida';
        }

        if (!Object.values(erros).some(error => !!error) && idEmpresa != "") {
            const formViajes = {
                idCiudadSalida: ciudadSalida!.value,
                idCiudadDestino: ciudadDestino ? ciudadDestino.value : 0,
                fechaSalida: dataConvert(fechaIda!)
            };

            http.post<IViaje[]>("empresa/viajes/" + idEmpresa, formViajes)
                .then(resposta => {
                    setViajes(resposta.data)
                })
                .catch(() => {
                    setViajes([])
                    alert("Ocurrio un error")
                })
            localStorage.setItem("formViajeFuncionarios", JSON.stringify(formViajes));
        }

        setErrors(erros);
    };

    const findCiudadById = (id: number, setCiudad: (c: IType | null) => void) => {
        http.get<ICiudad>("ciudades/" + id)
            .then(({ data }) => { setCiudad(({ value: data.id, label: capitalizeFirstLetter(data.nombre) })) })
            .catch(() => setCiudad(null))
    }



    useEffect(() => {
        let cookie1 = localStorage.getItem("formViajeFuncionarios")
        let cookie2 = CookieEmpresaId.get()
        let formData = cookie1 ? cookie1 : ""
        let idEmpresa = cookie2 ? cookie2 : ""
        if (formData != "" && idEmpresa != "") {
            let object: IFormViaje = JSON.parse(formData)
            if (object.idCiudadDestino != 0) {
                findCiudadById(object.idCiudadDestino, setCiudadDestino)
            }

            findCiudadById(object.idCiudadSalida, setCiudadSalida)
            setFechaIda(new Date(object.fechaSalida + "T00:00:00"));
            http.post<IViaje[]>("empresa/viajes/" + idEmpresa, object)
                .then(resposta => {
                    setViajes(resposta.data)
                })
                .catch(() => {
                    setViajes([])
                    alert("Ocurrio un error")
                })
        }
    }, []);

    return (
        <form className={`max-w-5xl p-5 mx-auto shadow-xl bg-white flex items-center justify-between gap-5 rounded ${className}`}
            {...props}
            onSubmit={enviar}>
            <div className="w-full relative">
                <SelectCiudad labelValue="Origen" ciudadElejida={ciudadSalida} setCiudadElejida={setCiudadSalida} />
                <InputError className="absolute pl-2" message={errors.ciudadSalida} />
            </div>
            <div className="w-full relative">
                <SelectCiudad labelValue="Destino" ciudadElejida={ciudadDestino} setCiudadElejida={setCiudadDestino} />
                <InputError className="absolute pl-2" message={errors.ciudadDestino} />
            </div>
            <div className="relative">
                <DatePickerCostumized dataExtern={fechaIda} setDataExtern={setFechaIda} labelValue="Fecha Ida" />
                <InputError className="absolute pl-2" message={errors.fechaIda} />
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