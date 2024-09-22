import DataHora from "@/Classes/DataHora"
import ButtonOptionsMenu from "@/Components/ButtonOptionsMenu"
import CloseButton from "@/Components/CloseButton"
import PrimaryButtonEmpresa from "@/Components/PrimaryButtonEmpresa"
import TableComponent from "@/Components/Table/TableComponent"
import TdComponent from "@/Components/Table/TdComponent"
import ThComponent from "@/Components/Table/ThComponent"
import capitalizeFirstLetter from "@/Helpers/CapitalizeFirstLetter"
import IParada2 from "@/Types/IViaje/IParada2"
import { FaBars } from "react-icons/fa"
import { Link } from "react-router-dom"

interface Props {
    mostrarOptions: boolean
    paradas: IParada2[]
    closeModal: () => void
    eliminarParada: (id: number) => void
    setOpenFormCreate: (value: boolean) => void
}
const ParadasTableComponent = ({ mostrarOptions, paradas, closeModal, eliminarParada, setOpenFormCreate }: Props) => {
    return <div className="max-w-7xl mx-auto my-auto">
        <TableComponent
            header={<div className="flex items-center justify-between pt-5 pb-3">
                <h2 className="text-xl font-semibold">Paradas del viaje</h2>
                <CloseButton onClick={closeModal} />
            </div>}
            thead={<>
                <ThComponent text="Salida" />
                <ThComponent text="Destino" />
                <ThComponent text="Fecha y Hora" />
                {mostrarOptions &&
                    <ThComponent text="" />
                }
            </>}
            tbody={<>
                {paradas.map(parada =>
                    <tr className="hover:bg-slate-300" key={parada.id}>
                        <TdComponent>
                            {capitalizeFirstLetter(parada.ciudad)}, {parada.abreviacion} - {capitalizeFirstLetter(parada.lugar)}
                        </TdComponent>
                        <TdComponent>
                            {parada.plataforma}
                        </TdComponent>
                        <TdComponent>
                            {new DataHora(parada.dataHora).imprimir()}
                        </TdComponent>
                        {mostrarOptions &&
                            <TdComponent className="w-full flex justify-end">
                                <ButtonOptionsMenu classNameButton="bg-white shadow-none outiline-none" children={<FaBars className="text-black" />}
                                    optionsMenu={<>
                                        <Link to={"/empresa/paradas/" + parada.id + "/edit"} className="text-white font-semibold bg-yellow-400 p-1.5 px-3 uppercase">
                                            Editar
                                        </Link>
                                        <button disabled={parada.tipo !== 'CAMINO'} onClick={() => eliminarParada(parada.id)} className="text-white text-start font-semibold bg-red-500 p-1.5 px-3 uppercase disabled:opacity-25">
                                            Eliminar
                                        </button>
                                    </>}
                                />
                            </TdComponent>
                        }
                    </tr>
                )}
            </>}

        />
        <div className="pt-2 flex justify-center">
            {mostrarOptions &&
                <PrimaryButtonEmpresa onClick={() => setOpenFormCreate(true)}>registrar una parada</PrimaryButtonEmpresa>
            }
        </div>
    </div>
}

export default ParadasTableComponent