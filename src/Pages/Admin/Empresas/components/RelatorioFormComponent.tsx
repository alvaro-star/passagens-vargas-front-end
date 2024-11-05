import PrimaryButton from "@/Components/Buttons/PrimaryButton";
import TextInput234 from "@/Components/FormComponents/TextInput234";
import http from "@/http";
import { useState } from "react";

interface Props {
    idEmpresa: string
    closeModal: () => void
}
export default function RelatorioFormComponent({ idEmpresa, closeModal }: Props) {
    const [dataAnalize, setDataAnalize] = useState((new Date()).toString())

    const onSubmit = (e: React.FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        downloadRelatorio(idEmpresa)
    }
    const downloadRelatorio = (id: string | number) => {
        http.post(`facturas/${id}`, { fecha: dataAnalize }, { responseType: 'blob' })
            .then(response => {
                const blob = new Blob([response.data], { type: 'application/pdf' });
                const url = window.URL.createObjectURL(blob);
                closeModal()
                window.open(url, '_blank');
            })
            .catch(() => console.error('Erro ao abrir o PDF...'));
    }
    return <div className="border text-center w-64 bg-white border-1 border-gray-400">
        <form action="" onSubmit={onSubmit} className="p-5">
            <h2 className="text-lg font-semibold mb-5">Fecha de Analizis</h2>
            <TextInput234 className="rounded" type="date" value={dataAnalize} setValue={setDataAnalize} labelValue="Fecha de Analizis" />
            <PrimaryButton className="rounded-none mt-4" type="submit">
                Enviar
            </PrimaryButton>
        </form>
    </div>
}