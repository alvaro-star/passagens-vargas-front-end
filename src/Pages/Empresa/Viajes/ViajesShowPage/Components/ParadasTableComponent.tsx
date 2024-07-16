import DataHora from "@/Classes/DataHora"
import PrimaryButton from "@/Components/PrimaryButton"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import IParada2 from "@/Types/IViaje/IParada2"
import { Link } from "react-router-dom"

interface Props {
    mostrarParadas: boolean
    mostrarOptions: boolean
    paradas: IParada2[]
    eliminarParada: (id: number) => void
    setOpenFormCreate: (value: boolean) => void
}
const ParadasTableComponent = ({ mostrarParadas, mostrarOptions, paradas, eliminarParada, setOpenFormCreate }: Props) => {
    return <div hidden={!mostrarParadas} className="py-5 bg-white">
        <table className="w-full text-center">
            <thead>
                <tr>
                    <th className="text-start pl-5">Ciudad</th>
                    <th>Plataforma</th>
                    <th>Fecha y Hora</th>
                    {mostrarOptions && <th>Acciones</th>}
                </tr>
            </thead>
            <tbody>
                {paradas.map(parada =>
                    <tr className=" hover:bg-slate-300" key={parada.id}>
                        <td className="pl-5 py-2 text-start"> {capitalizeFirstLetter(parada.ciudad)}, {parada.abreviacion} - {capitalizeFirstLetter(parada.lugar)}</td>
                        <td className="">{parada.plataforma}</td>
                        <td className="">{new DataHora(parada.dataHora).imprimir()}</td>
                        {mostrarOptions &&
                            <td className="">
                                <div className="text-white flex items-center justify-center">
                                    <Link to={"/empresa/paradas/" + parada.id + "/edit"} className="bg-yellow-400 p-1.5 px-3 uppercase">
                                        Editar
                                    </Link>
                                    <button onClick={() => eliminarParada(parada.id)} className="bg-red-500 p-1.5 px-3 uppercase">
                                        Eliminar
                                    </button>
                                </div>
                            </td>
                        }
                    </tr>
                )}
            </tbody>
        </table>
        <div className="pt-2 text-center">
            {mostrarOptions &&
                <PrimaryButton className="rounded-none" onClick={() => setOpenFormCreate(true)}>registrar una parada</PrimaryButton>
            }
        </div>
    </div>
}

export default ParadasTableComponent