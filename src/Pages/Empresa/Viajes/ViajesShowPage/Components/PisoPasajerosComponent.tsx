import IPasajeComplete from "../Types/IPasajeComplete";

interface Props {
    pasajeros: IPasajeComplete[];
    downloadPasaje?: (id: string | number) => void;
}

const PisoPasajerosComponent = ({ pasajeros, downloadPasaje }: Props) => {
    return (
        <table style={{ width: '100%' }}>
            <thead>
                <tr style={{ textAlign: 'start' }}>
                    <th style={{ textAlign: 'start' }}>NSilla</th>
                    <th style={{ textAlign: 'start' }}>Carnet</th>
                    <th style={{ textAlign: 'start' }}>Nombre</th>
                    <th style={{ textAlign: 'start' }}>Fecha de Nascimiento</th>
                    <th style={{ textAlign: 'start' }}>Salida</th>
                    <th style={{ textAlign: 'start' }}>Destino</th>
                    {downloadPasaje && <th>Actions</th>}
                </tr>
            </thead>
            <tbody>
                {pasajeros.map(pasajero => (
                    <tr className="hover:bg-slate-100" key={pasajero.id}>
                        <td style={{ paddingLeft: '1rem', paddingTop: '1rem', paddingBottom: '1rem' }}>
                            {pasajero.nSilla}
                        </td>
                        <td>{pasajero.carnet}</td>
                        <td>{pasajero.nombre}</td>
                        <td>
                            {new Date(pasajero.nascimento).toLocaleDateString()} {/* Exemplo de formatação de data */}
                        </td>
                        <td>
                            {`${pasajero.salida.ciudad} - ${pasajero.salida.abreviacion}`}
                        </td>
                        <td>
                            {`${pasajero.destino.ciudad} - ${pasajero.destino.abreviacion}`}
                        </td>
                        {downloadPasaje && (
                            <td style={{ textAlign: 'center' }}>
                                <button style={{ borderRadius: '0' }} onClick={() => downloadPasaje(pasajero.id)}>descargar pasaje</button>
                            </td>
                        )}
                    </tr>
                ))}
                {pasajeros.length === 0 && (
                    <tr>
                        <td colSpan={7} style={{ padding: '1rem', textAlign: 'center' }}>
                            No hay Pasajeros Registrados
                        </td>
                    </tr>
                )}
            </tbody>
        </table>
    );
}

export default PisoPasajerosComponent;
