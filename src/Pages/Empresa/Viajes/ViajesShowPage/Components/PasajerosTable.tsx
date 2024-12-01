import DataHora from "@/Classes/DataHora";
import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import http from "@/http";
import { useEffect, useState } from "react";
import IPasajeComplete from "../Types/IPasajeComplete";
import TableComponent from "@/Components/Table/TableComponent";
import ThComponent from "@/Components/Table/ThComponent";
import TdComponent from "@/Components/Table/TdComponent";
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter";
interface Props {
    idsPrecio: string[]
    setMostrarOptions: (value: boolean) => void
}
const PasajerosTable = ({ idsPrecio, setMostrarOptions }: Props) => {
    const [pasajeros, setPasajeros] = useState<IPasajeComplete[]>([])

    const downloadPasaje = (id: string | number) => {
        http.get(`pasajes/${id}/download`, { responseType: 'blob' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                window.open(url, '_blank');
            })
            .catch(() => console.error('Erro ao abrir o PDF...'));
    }

    const rembolsarPasaje = (id: string | number) => {
        http.delete(`pasajes/${id}`)
            .then(() => {
                setPasajeros((prevPasajes) =>
                    prevPasajes.map((pasaje) => pasaje.id === id ? { ...pasaje, rembolsado: true } : pasaje)
                );
            })
            .catch(({ error }) => {
                if (error.response.data.conteudo)
                    alert(error.response.data.conteudo)
                console.error('Erro ao reembolsar o pasaje:', error);
            });
    };


    const fetchPasajeros = async (idsPrecio: string[]) => {
        let promisesResponse = [];
        try {
            const promises = idsPrecio.map(async (idPrecio) => {
                let { data } = await http.get(`pasajes/from/${idPrecio}`);
                if (data.length > 0) setMostrarOptions(false);
                return data; // Devuelve los datos para recogerlos más tarde
            });

            promisesResponse = await Promise.all(promises);
        } catch (error) {
            console.log("Hubo un error en la búsqueda", error);
            return [];
        }

        let pasajeros: IPasajeComplete[] = [];
        promisesResponse.forEach(lista => pasajeros = pasajeros.concat(lista))
        return pasajeros;
    };

    useEffect(() => {
        fetchPasajeros(idsPrecio).then(t => setPasajeros(t))
    }, [idsPrecio])

    return (
        <div className="mt-3">
            <TableComponent
                header={<div className="py-2 flex items-center justify-between">
                    <h2>Lista de Pasajeros</h2>
                </div>}
                thead={<>
                    <ThComponent text="Asiento" />
                    <ThComponent text="Carnet" />
                    <ThComponent text="Nombre" />
                    <ThComponent text="Fecha de Nacimiento" />
                    <ThComponent text="Salida" />
                    <ThComponent text="Destino" />
                    <ThComponent text="" />
                </>}
                tbody={<>
                    {pasajeros.map((pasajero, index) =>
                        <tr key={pasajero.id} className={`${(index % 2 ? "" : "bg-gray-100")} hover:bg-slate-200`}>
                            <TdComponent>{pasajero.nSilla}</TdComponent>
                            <TdComponent>{pasajero.carnet}</TdComponent>
                            <TdComponent>{pasajero.nombre}</TdComponent>
                            <TdComponent>{(new DataHora(pasajero.nascimento)).data.imprimir()}</TdComponent>
                            <TdComponent>{capitalizeFirstLetter(pasajero.salida.ciudad) + ", " + pasajero.salida.abreviacion}</TdComponent>
                            <TdComponent>{capitalizeFirstLetter(pasajero.destino.ciudad) + ", " + pasajero.destino.abreviacion}</TdComponent>
                            <TdComponent className="text-center flex justify-center">
                                <div className="flex items-center gap-2">
                                    {!pasajero.rembolsado ?
                                        <>
                                            <PrimaryButton className="rounded-none bg-red-500" onClick={() => rembolsarPasaje(pasajero.id)}>
                                                rembolsar
                                            </PrimaryButton>
                                            <PrimaryButton className="rounded-none" onClick={() => downloadPasaje(pasajero.id)}>descargar pasaje</PrimaryButton>
                                        </>
                                        :
                                        <PrimaryButton disabled className="rounded-none">
                                            REMBOLSADO
                                        </PrimaryButton>
                                    }
                                </div>
                            </TdComponent>
                        </tr>
                    )}
                    {pasajeros.length == 0 && <tr>
                        <td colSpan={7} className="py-2 text-center font-semibold">
                            No hay Pasageros Registrados
                        </td>
                    </tr>}
                </>}
            />
        </div >
    )
}
export default PasajerosTable