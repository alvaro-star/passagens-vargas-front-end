import { useEffect, useState } from "react";
import IParadaForm from "../Viajes/Types/IParadaForm";
import IParadaFormErro from "../Viajes/Types/IParadaFormErro";
import http from "@/http";

import IParada2 from "@/Types/IViaje/IParada2";
import { useNavigate, useParams } from "react-router-dom";
import TextInputObject from "@/Pages/Publico/Components/TextInputObject";
import InputError from "@/Components/InputError";
import SelectCostumized from "@/Components/SelectCostumized";
import ICiudad from "@/Types/ICiudad";
import ILugar from "@/Types/ILugar";
import PrimaryButton from "@/Components/PrimaryButton";
import IError from "@/Types/IErrors/IError";

const ParadaEditPage = () => {
    const novoParadaForm = () => {
        return { plataforma: '', dataHora: '', idLugar: '', id: "" };
    };

    const [parada, setParada] = useState<IParadaForm>(novoParadaForm());
    const [idViaje, setIdViaje] = useState("");
    const [paradaErros, setParadaErros] = useState<IParadaFormErro>(novoParadaForm());
    const [ciudad, setCiudad] = useState<ICiudad | null>(null);
    const [lugares, setLugares] = useState<ILugar[]>([]);
    const { id } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        if (id) {
            http.get<IParada2>("paradas/" + id)
                .then(resposta => {
                    const paradaN = novoParadaForm();
                    paradaN.dataHora = resposta.data.dataHora;
                    paradaN.id = resposta.data.id.toString();
                    paradaN.idLugar = resposta.data.idLugar.toString();
                    paradaN.plataforma = resposta.data.plataforma.toString();
                    setIdViaje(resposta.data.idViaje);
                    setParada(paradaN);
                    http.get<ILugar>("lugares/" + resposta.data.idLugar.toString())
                        .then(resposta2 => {
                            setLugares([resposta2.data]);
                            http.get<ICiudad>("ciudades/" + resposta2.data.idCiudad)
                                .then(resposta3 => setCiudad(resposta3.data));
                        });
                });
        }
    }, [id, navigate]);

    const enviar = async (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault();
        let erros: IParadaFormErro = novoParadaForm();
        const haErros = parada.dataHora === '' || parada.plataforma === '' || parada.idLugar === '';
        if (!haErros) {
            await http.put<IParada2>('paradas/' + id, parada)
                .then(() => {
                    if (idViaje !== "") {
                        navigate("/empresa/viajes/" + idViaje);
                    }
                })
                .catch(erro => {
                    if (erro.response.data.errors) {
                        erro.response.data.errors.forEach((er: IError) => {
                            erros[er.name] = er.message;
                        });
                    }
                });
        }
        setParadaErros(erros);
    };

    useEffect(() => {
        if (ciudad) {
            http.get<ILugar[]>('ciudades/' + ciudad.id + '/lugares')
                .then(resposta => {
                    setLugares(resposta.data);
                    if (resposta.data.length > 0) {
                        editar('idLugar', resposta.data[0].id.toString());
                    }
                });
        }
    }, [ciudad]);

    const editar = (campo: string, value: string) => {
        const paradaAux: IParadaForm = { ...parada };
        paradaAux[campo] = value;
        setParada(paradaAux);
    };

    return (
        <div className="w-full grid place-content-center pt-10">
            <form onSubmit={enviar} className="w-full flex justify-center flex-col p-5 bg-gray-300 rounded-lg">
                <div className="my-2 w-full flex justify-between items-center">
                    <h2 className="pb-2 text-gray-800 text-lg font-semibold">Editar Parada</h2>
                </div>
                <div className="text-center mt-2">
                    <div className="flex items-center space-x-4">
                        <div className="w-24">
                            <TextInputObject className="text-center" type="text" min={1} value={parada.plataforma} onChange={(eve) => editar('plataforma', eve.target.value)} labelValue="Plataforma" />
                            <InputError className="absolute text-wrap" message={paradaErros.plataforma} />
                        </div>
                        <div className="relative">
                            <TextInputObject type="datetime-local" value={parada.dataHora} onChange={(eve) => editar('dataHora', eve.target.value)} labelValue="Fecha de llegada" />
                            <InputError className="absolute text-wrap" message={paradaErros.dataHora} />
                        </div>
                        <div className="w-64 text-black">
                            <SelectCostumized ciudadElejida={ciudad} setCiudadElejida={setCiudad} labelValue="Nombre Dela Ciudad" />
                        </div>
                        <div className="relative">
                            <select disabled={ciudad == null}
                                value={parada.idLugar} onChange={eve => editar('idLugar', eve.target.value)}
                                className="w-64 block px-2.5 py-2.5 h-11 text-gray-900 bg-white rounded border border-gray-400 appearance-none focus:outline-blue-500 focus:ring-blue-500 focus:border-blue-500 peer">
                                {lugares.map(lugar =>
                                    <option key={lugar.id} value={lugar.id}>{lugar.nombre}</option>
                                )}
                            </select>
                            <label
                                className="absolute text-sm text-gray-500 rounded-t bg-white duration-300 transform -translate-y-4 scale-75 top-2 z-10 origin-[0]  px-2 peer-focus:px-2 peer-focus:text-blue-600 peer-placeholder-shown:scale-100 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:top-1/2 peer-focus:top-2 peer-focus:scale-75 peer-focus:-translate-y-4 rtl:peer-focus:translate-x-1/4 rtl:peer-focus:left-auto start-1">Elije un lugar</label>
                            <InputError className="absolute w-full text-wrap" message={paradaErros.idLugar} />
                        </div>
                    </div>
                    <PrimaryButton type="submit" className="rounded-none mt-5 bg-yellow-500">Enviar</PrimaryButton>
                </div>
            </form>
        </div>
    );
};

export default ParadaEditPage;
