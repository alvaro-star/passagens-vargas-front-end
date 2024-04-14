export default interface IAutobusForm {
    id: number | null,
    placa: string,
    idEmpresa: string,
    pisos: IPisoForm[]
}