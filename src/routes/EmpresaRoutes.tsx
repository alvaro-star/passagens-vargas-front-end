import FuncionariosFormPage from "@/Pages/Empresa/Admin/FuncionariosFormPage"
import FuncionariosListPage from "@/Pages/Empresa/Admin/FuncionariosListPage"
import AutobusesIndexPage from "@/Pages/Empresa/Autobuses/AutobusesIndexPage"
import AutobusesShowPage from "@/Pages/Empresa/Autobuses/AutobusesShowPage"
import AutobusesFormPage from "@/Pages/Empresa/Autobuses/AutobusFormPage"
import HomeEmpresaPage from "@/Pages/Empresa/HomeEmpresaPage"
import ParadaEditPage from "@/Pages/Empresa/Paradas/ParadaEditPage"
import ViajesFuncionarioPage from "@/Pages/Empresa/Viajes/ViajesFuncionarioPage"
import ViajesIndexPage from "@/Pages/Empresa/Viajes/ViajesIndexPage"
import ViajesShowPage from "@/Pages/Empresa/Viajes/ViajesShowPage"
import ViajesVentaPage from "@/Pages/Empresa/Viajes/ViajesVentaPage"
import EmpresaAdminLayout from "@/Pages/Layout/EmpresaAdminLayout"
import ViajesPagosPage from "../Pages/Empresa/Viajes/ViajesPagosPage";
import { Route } from "react-router-dom"

interface Props {
    name: string
}

const EmpresaRoutes = ({ name }: Props) => {
    return (
        <Route path={`/${name}`} element={<EmpresaAdminLayout />}>
            <Route index element={<HomeEmpresaPage />} />
            <Route path="admin">
                <Route path="autobuses">
                    <Route index element={<AutobusesIndexPage />} />
                    <Route path="create" element={<AutobusesFormPage />} />
                    <Route path=":id" element={<AutobusesShowPage />} />
                </Route>
                <Route path="funcionarios">
                    <Route index element={<FuncionariosListPage />} />
                    <Route path="create" element={<FuncionariosFormPage />} />
                </Route>
                <Route path="viajes">
                    <Route index element={<ViajesIndexPage />} />
                </Route>
            </Route>
            <Route path="paradas">
                <Route path=":id/edit" element={<ParadaEditPage />} />
            </Route>
            <Route path="viajes">
                <Route index element={<ViajesFuncionarioPage />} />
                <Route path=":id" element={<ViajesShowPage />} />
                <Route path=":id/vender" element={<ViajesVentaPage />} />
                <Route path=":id/pagar" element={<ViajesPagosPage />} />
            </Route>
        </Route>
    )
}

export default EmpresaRoutes