export default function capitalizeFirstLetter(str: string) {
    // Divide a string em palavras separadas por espaço
    let words = str.toLowerCase().split(' ');

    // Itera sobre cada palavra e capitaliza a primeira letra
    for (let i = 0; i < words.length; i++) {
        words[i] = words[i].charAt(0).toUpperCase() + words[i].slice(1);
    }

    // Junta as palavras de volta em uma string e retorna
    return words.join(' ');
}