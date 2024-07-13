import IPrecio2 from "@/Types/IViaje/IPrecio2";
import IPasajeComplete from "./IPasajeComplete";

export default interface IPrecioPasajeros extends IPrecio2 {
    pasajeros: IPasajeComplete[]
}