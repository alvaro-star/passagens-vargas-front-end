import PrimaryButton from "@/Components/PrimaryButton"
import IPiso from "@/Types/IPiso"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextInput234 from "@/Components/TextInput234"
import IViajeResponse from "./Types/IViajeResponse"
import TextInputObject from "./Components/TextInputObject"
import IError from "@/Types/IErrors/IError"
import IErrorList from "@/Types/IErrors/IErrorList"
import InputError from "@/Components/InputError"

interface IPasaje {
    carnet: string;
    nombre: string;
    nascimento: string;
    nSilla: number;
    [key: string]: string | number;
}

interface IPasajeError {
    carnet: string;
    nombre: string;
    nascimento: string;
    nSilla: string;
    [key: string]: string;
}

interface IPasajeList {
    values: IPasaje
    errors: IPasajeError
}

interface IContactoError {
    email: string
    nombre: string
    telefono: string
    confirmarEmail: string
    [key: string]: string;
}

interface IPrecio {
    id: string,
    precio: number,
    nPiso: number,
    lleno: boolean,
    nSillasDisponibles: number,
    piso: IPiso
    sillasOcupadas: number[],
    idViaje: number
}

const PassagensList = () => {
    const { id } = useParams();
    const metodos = ['QR', 'DEB', 'CRE'];
    const [viaje, setViaje] = useState<IViajeResponse | null>(null);
    const [pasajes, setPasajes] = useState<IPasajeList[]>([]);
    const [precio, setPrecio] = useState<IPrecio | null>(null);
    const navigate = useNavigate();

    const initialContactoError = () => ({
        email: '', nombre: '', telefono: '', confirmarEmail: ''
    });

    const [contactoError, setContactoError] = useState<IContactoError>(initialContactoError);
    const [email, setEmail] = useState<string>('');
    const [nombre, setNombre] = useState<string>('');
    const [telefono, setTelefono] = useState<string>('');
    const [confirmarEmail, setConfirmarEmail] = useState<string>('');

    const handleEdit = (indexPasaje: number, campo: string, value: string) => {
        const updatedPasajes = [...pasajes];
        updatedPasajes[indexPasaje].values[campo] = value;
        setPasajes(updatedPasajes);
    };

    const formatDate = (dateTime: string) => {
        const [hora, minutos] = dateTime.split('T')[1].split(':');
        return `${hora}:${minutos}`;
    };

    useEffect(() => {
        const savedSillas = sessionStorage.getItem("sillasFromViaje");
        const savedViaje = sessionStorage.getItem("viajeData");

        if (!savedViaje) {
            navigate('/');
            return;
        }

        const viajeData = JSON.parse(savedViaje);
        setViaje(viajeData);

        if (!savedSillas) {
            navigate('/');
        } else {
            const sillasList = savedSillas.split(',');
            const pasajesData: IPasajeList[] = sillasList.map(nSilla => ({
                values: { carnet: '', nombre: '', nascimento: '', nSilla: parseInt(nSilla) },
                errors: { carnet: '', nombre: '', nascimento: '', nSilla: '' }
            }));
            setPasajes(pasajesData);

            if (id)
                http.get<IPrecio>(`precios/${id}/vender`).then(response => setPrecio(response.data));
            else
                navigate('/');
        }
    }, [id, navigate]);

    const primeiraLetraMayuscula = (palavra: string) => {
        return palavra.charAt(0).toUpperCase() + palavra.slice(1);
    }

    const handleSubmit = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
        e.preventDefault();

        let updatedPasajes: IPasajeList[] = pasajes.map(pasaje => ({
            ...pasaje,
            errors: { carnet: '', nombre: '', nascimento: '', nSilla: '' }
        }));

        let hasError = false;
        const newContactoError = initialContactoError();

        if (email !== confirmarEmail) {
            newContactoError.confirmarEmail = "El email es distinto";
            hasError = true;
        }

        if (!precio || !viaje || hasError) return;

        const pasajeData = {
            idPrecio: precio.id,
            descuento: 0,
            contacto: { nombre, email, telefono },
            idLugarSalida: viaje.salida.idLugar,
            idLugarDestino: viaje.destino.idLugar,
            pasajes: pasajes.map(p => p.values)
        };
        console.log("Cheguei");

        console.log(pasajeData);

        http.post('pasajes', pasajeData).then(() => {
            setContactoError(newContactoError);
            sessionStorage.removeItem('sillasFromViaje');
            sessionStorage.removeItem('viajeData');
            alert("Registrado con exito");
        }).catch(error => {

            const newContactoError: IContactoError = initialContactoError();
            if (error.response.data.errors) {
                error.response.data.errors.forEach((err: IError) => {
                    if (err.name.startsWith("contacto.")) {
                        newContactoError[err.name.substring(9)] = primeiraLetraMayuscula(err.message);
                    }
                });
                setContactoError(newContactoError);
            }
            if (error.response.data.errorsList.length != 0) {
                const errorsList: IErrorList = error.response.data.errorsList[0];
                if (errorsList.name === 'pasajes') {
                    errorsList.itens.forEach(item => {
                        item.errors.forEach(errInItem => {
                            updatedPasajes[item.index].errors[errInItem.name] = primeiraLetraMayuscula(errInItem.message);
                        });
                    });
                }
                setPasajes(updatedPasajes);
            }
        });
    };

    return (
        <div className="text-gray-900 flex justify-center px-20 py-10 bg-gray-100 gap-4">
            <section className="w-3/4 flex flex-col items-center gap-10">
                {pasajes.map((pasaje, index) => (
                    <section key={index} className="w-full border-2 border-gray-300 rounded-lg p-5">
                        <div className="flex items-center justify-between gap-4">
                            <p className="text-2xl font-semibold">Pasagero</p>
                            <div className="p-2 bg-blue-300 w-10 h-10 grid place-content-center rounded border border-blue-500">
                                {pasaje.values.nSilla}
                            </div>
                        </div>
                        <div className="mt-2 relative">
                            <TextInputObject className="rounded-lg" value={pasaje.values.nombre} onChange={e => handleEdit(index, 'nombre', e.target.value)} labelValue="Nombre" />
                            <InputError className="absolute" message={pasaje.errors.nombre} />
                        </div>
                        <div className="w-full mt-5 grid grid-cols-2 gap-5">
                            <div className="relative">
                                <TextInputObject className="rounded-lg" placeholder="N° de carnet" value={pasaje.values.carnet} onChange={e => handleEdit(index, 'carnet', e.target.value)} labelValue="N° Carnet" />
                                <InputError className="absolute" message={pasaje.errors.carnet} />
                            </div>
                            <div className="relative">
                                <TextInputObject className="rounded-lg" type="date" value={pasaje.values.nascimento} onChange={e => handleEdit(index, 'nascimento', e.target.value)} labelValue="Nascimiento" />
                                <InputError className="absolute" message={pasaje.errors.nascimento} />
                            </div>
                        </div>
                    </section>
                ))}

                <section className="w-full">
                    <div className="border-2 border-gray-300 rounded-lg p-5">
                        <p className="text-2xl font-semibold mb-2">Detalles del contacto</p>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="mt-2 relative">
                                <TextInput234 value={nombre} setValue={setNombre} labelValue="Nombre" />
                                <InputError className="absolute" message={contactoError.nombre} />
                            </div>
                            <div className="mt-2 relative">
                                <TextInput234 value={email} setValue={setEmail} labelValue="E-mail" />
                                <InputError className="absolute" message={contactoError.email} />
                            </div>
                            <div className="mt-2 relative">
                                <TextInput234 value={telefono} setValue={setTelefono} labelValue="Telefono" />
                                <InputError className="absolute" message={contactoError.telefono} />
                            </div>
                            <div className="mt-2 relative">
                                <TextInput234 value={confirmarEmail} setValue={setConfirmarEmail} labelValue="Confirmar Email" />
                                <InputError className="absolute" message={contactoError.confirmarEmail} />
                            </div>
                        </div>
                    </div>
                </section>
                <section className="my-5">
                    <PrimaryButton onClick={handleSubmit}>
                        Mandar Dados
                    </PrimaryButton>
                </section>
            </section>
            <section className="w-96 ">
                <div className="w-full p-5 text-2xl font-semibold rounded-t-lg border-2 border-gray-300">Datos del Viaje</div>
                {viaje &&
                    <section className="px-6 py-4 border-x-2 border-gray-300">
                        <div className="w-full flex flex-col">
                            <div className="flex items-center">
                                <p className="w-20 text-black text-3xl font-bold">{formatDate(viaje?.salida.dataHora)}</p>
                                <div className="w-10 flex justify-center">
                                    <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
                                </div>
                                <p className="text-2xl font-semibold">{viaje?.salida.ciudad}</p>
                            </div>
                            <div className="flex">
                                <p className="w-20"></p>
                                <div className="w-10 flex justify-center">
                                    <div className="border-r-2 border-black h-24">
                                    </div>
                                </div>
                                <div>
                                    <p>{viaje?.salida.departamento}, {viaje?.salida.abreviacion}</p>
                                    <p>{viaje?.salida.lugar}</p>
                                </div>
                            </div>
                            <div className="flex items-center">
                                <p className="w-20 text-black text-3xl font-bold">{formatDate(viaje?.destino.dataHora)}</p>
                                <div className="w-10 flex justify-center">
                                    <div className="h-3 w-3 bg-gray-600 rounded-full"></div>
                                </div>
                                <p className="text-2xl font-semibold">{viaje?.destino.ciudad}</p>
                            </div>
                            <div className="flex items-center">
                                <p className="w-20 text-3xl font-bold"></p>
                                <div className="w-10 flex justify-center">
                                </div>
                                <div>
                                    <p>{viaje?.destino.departamento}, {viaje?.destino.abreviacion}</p>
                                    <p>{viaje?.destino.lugar}</p>
                                </div>
                            </div>
                        </div>
                    </section>
                }
                <div className="w-full p-5 text-2xl font-semibold border-2 border-gray-300">
                    Resumen de Factura
                </div>
                {precio &&
                    <>
                        <section className="border-x-2 px-5 py-3 border-gray-300">
                            <p className="text-2xl font-semibold">
                                {viaje?.salida.ciudad + ' -> ' + viaje?.destino.ciudad}
                            </p>
                            <div className="border-b-2 border-gray-300 text-lg py-2">
                                {pasajes.map((pasajero, index) => <div key={index} className="font-semibold flex justify-between">
                                    <p>
                                        Pasajero {index + 1} - Silla {pasajero.values.nSilla}
                                    </p>
                                    <p>Bs {precio.precio.toFixed(2)}</p>
                                </div>)}
                            </div>
                            <div className="text-lg font-semibold flex justify-between">
                                <p>
                                    Tasa de Servicio
                                </p>
                                <p>
                                    Bs {(precio.precio * pasajes.length * 0.1).toFixed(2)}
                                </p>
                            </div>
                        </section>
                        <div className="px-5 py-3 border-2 border-gray-300 flex items-center justify-between text-2xl font-semibold">
                            <p>
                                Total:
                            </p>
                            <p className="font-semibold">
                                Bs {(precio.precio * pasajes.length * 1.1).toFixed(2)}
                            </p>
                        </div>
                        <div className="px-5 py-3 border-2 border-t-0 rounded-b-lg border-gray-300 text-center">
                            <p className="text-lg font-semibold mb-2">
                                Método de Pago
                            </p>
                            <div className="flex justify-center gap-2">
                                {metodos.map((metodo, index) =>
                                    <div key={index} className="w-10 h-10 bg-white rounded font-bold flex items-center justify-center hover:bg-black hover:text-white">
                                        {metodo}
                                    </div>
                                )}
                            </div>
                        </div>
                    </>
                }
            </section>
        </div>
    )
}

export default PassagensList