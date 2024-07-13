import IAutobus from "@/Types/IAutobus";
import IPisoApiResponse from "./IPisoApiResponse";

export default interface IAutobusExtendsApi extends IAutobus {
    pisos: IPisoApiResponse[]
}