class DataHora {
    data: Data
    hora: Hora
    constructor(dataInformatada: string) {
        let [data, time] = dataInformatada.split('T')
        this.data = new Data(data)
        this.hora = new Hora(time)
    }

    imprimir() {
        return `${this.data.imprimir()} alas ${this.hora.imprimir()}`
    }
}


class Data {
    ano: string;
    mes: string;
    dia: string;

    constructor(dataInformatada: string) {
        let [ano, mes, dia] = dataInformatada.split('-')
        this.ano = ano
        this.mes = mes
        this.dia = dia
    }

    imprimir() {
        return `${this.dia}/${this.mes}/${this.ano}`
    }
}

class Hora {
    hora: string
    minutos: string

    constructor(horaInformatada: string) {
        let [hora, minutos] = horaInformatada.split(':')
        this.hora = hora
        this.minutos = minutos
    }

    imprimir() {
        return `${this.hora}:${this.minutos}`
    }
}


export default DataHora