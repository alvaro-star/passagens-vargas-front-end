const isDateValid = (data: string): boolean => {
    if (data === '') {
        return false;
    }
    const dataParticionada = data.split('/');

    if (dataParticionada.length !== 3) {
        return false;
    }
    if (dataParticionada[0].length != 2 || dataParticionada[1].length != 2 || dataParticionada[2].length != 4) {
        return false;
    }
    
    const dia = parseInt(dataParticionada[0]);
    const mes = parseInt(dataParticionada[1]);
    const ano = parseInt(dataParticionada[2]);

    if (isNaN(dia) || isNaN(mes) || isNaN(ano)) {
        return false;
    }

    const date = new Date(ano, mes - 1, dia); // Mês é baseado em zero, então subtraímos 1

    return (
        date.getFullYear() === ano &&
        date.getMonth() === mes - 1 &&
        date.getDate() === dia
    );
};

export default isDateValid;