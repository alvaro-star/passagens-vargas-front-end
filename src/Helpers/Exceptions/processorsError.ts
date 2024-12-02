import CustomAxiosResponse from "@/Types/AxiosResponse/CustomAxiosResponse"

const processErro422 = (error: CustomAxiosResponse) => {
    const errors: Record<string, string> = {}

    const data = error.response?.data
    if (error.status != 422 || !(data?.errors))
        return errors
    data.errors.forEach(error => errors[error.name] = error.message)
    return errors
}
const proceccErroDefault = () => {
    alert("Hubo un error en la solicitud...")
}

export { processErro422, proceccErroDefault }