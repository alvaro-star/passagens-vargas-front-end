export default interface IPasaje {
    carnet: string;
    nombre: string;
    nascimento: string;
    nSilla: number;
    [key: string]: string | number;
}