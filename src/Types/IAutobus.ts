import IPiso from "./IPiso";

export default interface IAutobus {
    id: number,
    placa: string,
    enabled: boolean,
    idEmpresa: string,
    pisos?: IPiso[]
}