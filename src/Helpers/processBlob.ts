import { AxiosResponse } from "axios";
const processBlob = (response: AxiosResponse) => {
    const blob = new Blob([response.data], { type: 'application/pdf' });
    const url = window.URL.createObjectURL(blob);
    window.open(url, '_blank');
}

export default processBlob