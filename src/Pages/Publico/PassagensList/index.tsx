import PrimaryButton from "@/Components/PrimaryButton"
import http from "@/http"
import { useEffect, useState } from "react"
import { useNavigate, useParams } from "react-router-dom"
import TextInput234 from "@/Components/TextInput234"
import IViajeResponse from "../Types/IViajeResponse"
import TextInputObject from "../Components/TextInputObject"
import IError from "@/Types/IErrors/IError"
import IErrorList from "@/Types/IErrors/IErrorList"
import InputError from "@/Components/InputError"
import IPrecio from "./Types/IPrecio"
import IPasajeList from "./Types/IPasajeList"
import FacturaComponent from "./Components/FacturaComponent"


interface IContactoError {
    email: string
    nombre: string
    telefono: string
    confirmarEmail: string
    [key: string]: string;
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
    }, [id]);

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
        <div className="bg-gray-100 min-h-full py-10">
            <div className="text-gray-900 max-w-7xl mx-2 sm:mx-auto flex flex-col sm:flex-row justify-center gap-4 ">
                <section className="sm:w-3/4 flex flex-col items-center gap-10">
                    {pasajes.map((pasaje, index) => (
                        <section key={index} className="w-full border-2 border-gray-300 rounded-lg p-5">
                            <div className="flex items-center justify-between gap-4">
                                <p className="text-2xl font-semibold">Pasagero</p>
                                <div className="p-2 bg-blue-300 w-10 h-10 grid place-content-center rounded border border-blue-500">
                                    {pasaje.values.nSilla}
                                </div>
                            </div>
                            <div className="grid grid-cols-2 gap-5 mt-2">
                                <div className="relative col-span-2">
                                    <TextInputObject className="rounded-lg" value={pasaje.values.nombre} onChange={e => handleEdit(index, 'nombre', e.target.value)} labelValue="Nombre" />
                                    <InputError className="absolute" message={pasaje.errors.nombre} />
                                </div>
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
                            <div className="grid sm:grid-cols-2 gap-4">
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
                    <section className="hidden sm:block -mt-5">
                        <PrimaryButton onClick={handleSubmit}>
                            Mandar Dados
                        </PrimaryButton>
                    </section>
                </section>
                <section className="sm:w-96">
                    {viaje && precio &&
                        <FacturaComponent viaje={viaje} precio={precio} pasajes={pasajes} metodos={metodos} />
                    }
                </section>
                <section className="sm:hidden mt-5 text-center">
                    <PrimaryButton onClick={handleSubmit}>
                        Mandar Dados
                    </PrimaryButton>
                </section>
            </div>
        </div>
    )
}

export default PassagensList