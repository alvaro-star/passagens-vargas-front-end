import IPasaje from "./IPasaje"
import IPasajeError from "./IPasajeError"

export default interface IPasajeList {
    values: IPasaje
    errors: IPasajeError
}