const dataConvert = (fecha: Date | null): string => {
    if (!fecha)
        fecha = new Date()
    const year = fecha.getFullYear();
    const month = String(fecha.getMonth() + 1).padStart(2, "0");
    const day = String(fecha.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`;
}
export default dataConvert