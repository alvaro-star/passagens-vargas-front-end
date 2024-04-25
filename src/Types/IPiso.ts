export default interface IPiso {
    id: number | null,
    nLinhas: number,
    nColunas: number,
    distribuicaoFileira: string,
    nPiso: number,
    inicioContagem: string,
    nSillas: number | null,
    primeraSilla: number,
    idAutobus: number | null,
    posicoesBloqueadas: number[]
}
