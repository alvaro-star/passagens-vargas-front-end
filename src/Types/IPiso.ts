export default interface IPiso {
    id: number,
    nLinhas: number,
    nColunas: number,
    distribuicaoFileira: string,
    nPiso: number,
    inicioContagem: string,
    nSillas: number,
    primeraSilla: number,
    idAutobus: number,
    posicoesIndisponiveis: number[]
}
