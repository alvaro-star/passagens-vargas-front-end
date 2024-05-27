import PrimaryButton from "@/Components/PrimaryButton"

const FuncionariosListPage = () => {

    return <div className="w-full p-5">
        <div className="max-7xl">
            <div className="p-5 bg-white rounded">
                <h1 className="font-bold text-xl pb-2">Lista de Funcionarios dela Empresa</h1>
                <table className="w-full ">
                    <thead>
                        <tr className="">
                            <th className="font-semibold text-start">Nombre</th>
                            <th className="font-semibold text-start">Fecha Nascimineto</th>
                            <th className="font-semibold text-center w-32">Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>
                                Steve de marques
                            </td>
                            <td>
                                23/04/2006
                            </td>
                            <td className="text-center">
                                <PrimaryButton>
                                    Ver Mas
                                </PrimaryButton>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
}


export default FuncionariosListPage