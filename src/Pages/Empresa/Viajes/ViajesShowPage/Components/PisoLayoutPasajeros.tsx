import IPiso from "@/Types/IPiso";
import ISillaType from "../Types/ISillaType";

interface Props {
    piso: IPiso
    sillas: ISillaType[]
    className?: string
}
const PisoLayoutPasajeros = ({ piso, sillas, className = '' }: Props) => {
    return <div className={"p-5 rounded grid place-content-center " + className}>
        <div className="p-2 h-14 bg-gray-500  text-white text-center rounded-t-3xl">
        </div>
        <div className="p-5 bg-gray-200 grid grid-cols-4 gap-3 place-content-center">
            <div></div>
            {(piso.nColunas == 3 && piso.distribuicaoFileira == 'DERECHA')
                ? <div style={{ gridRow: `span ${piso.nLinhas + 1} / span ${piso.nLinhas + 1}` }}></div>
                : <div></div>
            }
            {(piso.nColunas == 3 && piso.distribuicaoFileira == 'IZQUIERDA')
                ? <div style={{ gridRow: `span ${piso.nLinhas + 1} / span ${piso.nLinhas + 1}` }}></div>
                : <div></div>
            }
            <div></div>
            {sillas.map((silla, index) =>
                <div key={index}
                    className={silla.numero != -1
                        ? "bg-white relative w-40 h-28 rounded border-2 border-gray-400"
                        : ''}>
                    {silla.ocupado
                        ? <div className="ml-1">
                            {silla.numero} - CI: {silla.pasajero?.carnet}
                            <br />
                            Nombre: {silla.pasajero?.nombre}
                        </div>
                        : <div className="p-1">
                            {silla.numero != -1 && silla.numero}
                        </div>
                    }
                </div>
            )}
        </div>
        <div className="p-2 h-10 text-white bg-gray-500 text-center rounded-b">
        </div>
    </div>
}

export default PisoLayoutPasajeros;