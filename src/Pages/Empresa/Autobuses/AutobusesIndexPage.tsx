import { useEffect, useState } from "react"
import IAutobus from "@/Types/IAutobus"
import IPage from "@/Types/IPage"
import http from "@/http"
import PrimaryButton from "@/Components/PrimaryButton"
import AutobusesFormPage from "./AutobusFormPage"
import IEmpresa from "@/Types/IEmpresa"


const AutobusesIndexPage = () => {
    const idEmpresa = sessionStorage.getItem('idEmpresa')
    const [empresa, setEmpresa] = useState<IEmpresa>()
    const [autobuses, setAutobuses] = useState<IAutobus[]>([])
    const [openFormCreate, setOpenFormCreate] = useState<boolean>(false)
    const addAutobus = (autobus: IAutobus) => {
        setAutobuses([...autobuses, autobus])
        setOpenFormCreate(false)
    }
    useEffect(() => {
        http.get<IEmpresa>(`empresas/${idEmpresa}`)
            .then(resposta => {
                setEmpresa(resposta.data)
            })
        http.get<IPage<IAutobus>>(`autobuses/from/${idEmpresa}`)
            .then(resposta => setAutobuses(resposta.data.content))
    }, [])
    return (
        <>
            {!openFormCreate ?
                <div className="py-10">
                    <div className="mx-10 mb-10 p-5 bg-gray-400 text-white rounded flex items-center justify-between">
                        <div className="flex items-center">
                            <img src={empresa?.logo} alt="logo da empresa" className="h-14 rounded-lg" />
                            <p className="text-xl ml-2 font-semibold w-full">
                                {empresa?.nombre}
                            </p>
                        </div>
                        <PrimaryButton onClick={() => setOpenFormCreate(true)}>+ Autobus</PrimaryButton>
                    </div>
                    <div className="mx-10 grid gap-4">
                        {autobuses.map(autobus =>
                            <div key={autobus.id} className="p-5 bg-white rounded-lg flex justify-between items-center">
                                {autobus.placa}
                                <PrimaryButton className="bg-blue-500">Ver</PrimaryButton>
                            </div>
                        )}
                    </div>
                </div >
                :
                <div className="relative inset-0 m-6 rounded bg-slate-100 text-black">
                    <div className="absolute right-0">
                        <PrimaryButton className="h-10 w-10 text-center bg-red-500" onClick={() => setOpenFormCreate(false)}> X </PrimaryButton>
                    </div>
                    {idEmpresa && <AutobusesFormPage idEmpresa={idEmpresa} aposCriar={addAutobus} />}
                </div>
            }

        </>
    )
}


export default AutobusesIndexPage