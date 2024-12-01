import { AxiosError } from "axios";
import IError from "../IErrors/IError";
interface ErrorDetails {
    timestamp: number;
    status: number;
    error: string;
    message: string;
    conteudo: string;
    path: string;
    errors?: IError[]
}

type CustomAxiosResponse = AxiosError<ErrorDetails>

export default CustomAxiosResponse