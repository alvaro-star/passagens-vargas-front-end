import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import NotFound from "../Pages/NotFound";
import PassagensList from "../Pages/Publico/PassagensList";
import ViajesPage from "../Pages/Publico/ViajesPage";
import SobrePage from "../Pages/Publico/SobrePage";
import Dashboard from "../Pages/Admin/Dashboard";
import EmpresasFormPage from "../Pages/Admin/Empresas/EmpresasFormPage";
import EmpresaAdminLayout from "../Pages/Layout/EmpresaAdminLayout";
import Home from "../Pages/Publico/Home";
import HomeEmpresaPage from "../Pages/Empresa/HomeEmpresaPage";
import AutobusesIndexPage from "../Pages/Empresa/Autobuses/AutobusesIndexPage";
import CiudadesIndexPage from "../Pages/Admin/Ciudades/CiudadesIndexPage";
import EmpresaIndexPage from "../Pages/Admin/Empresas/EmpresaIndexPage";
import AdminLayout from "../Pages/Layout/AdminLayout";
import CiudadesFormPage from "../Pages/Admin/Ciudades/CiudadesFormPage";
import CiudadesShowPage from "../Pages/Admin/Ciudades/CiudadesShowPage";
import AutobusesFormPage from "../Pages/Empresa/Autobuses/AutobusFormPage";
import AutobusesShowPage from "../Pages/Empresa/Autobuses/AutobusesShowPage";
import LugaresFormPage from "../Pages/Admin/Lugares/LugaresFormPage";
import ViajesShowPage from "../Pages/Empresa/Viajes/ViajesShowPage";
import ViajesIndexPage from "../Pages/Empresa/Viajes/ViajesIndexPage";
import SwitchSillasPage from "../Pages/Publico/SwitchSillasPage";
import FuncionariosListPage from "../Pages/Empresa/Admin/FuncionariosListPage";
import FuncionariosFormPage from "../Pages/Empresa/Admin/FuncionariosFormPage";
import ViajesFuncionarioPage from "../Pages/Empresa/Viajes/ViajesFuncionarioPage";
import ParadaEditPage from "../Pages/Empresa/Paradas/ParadaEditPage";
import ViajesVentaPage from "../Pages/Empresa/Viajes/ViajesVentaPage";
import ViajesPagosPage from "../Pages/Empresa/Viajes/ViajesPagosPage";
import ValidarUser from "../Pages/Auth/ValidarUser";
import AdminEmpresaShowPage from "../Pages/Admin/Empresas/AdminEmpresaShowPage";
import AdminForm from "../Pages/Admin/Empresas/AdminForm";
import ViajesCreatePage from "@/Pages/Empresa/Autobuses/ViajesCreatePage";
import ResetPassword from "@/Pages/Auth/ResetPassword";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <Route index element={<Home />} />
                    <Route path="reset/password" element={<ResetPassword />} />
                    <Route path="login" element={<Login />} />
                    <Route path="registrar" element={<Register />} />
                    <Route path="validar" element={<ValidarUser />} />
                    <Route path="viajes" element={<ViajesPage />} />
                    <Route path="viaje" element={<SwitchSillasPage />} />
                    <Route path="viaje/step3/:id" element={<PassagensList />} />
                    <Route path="sobre" element={<SobrePage />} />
                </Route>
                <Route path="/admin" element={<AdminLayout />}>
                    <Route index element={<Dashboard />} />
                    <Route path="empresas">
                        <Route index element={<EmpresaIndexPage />} />
                        <Route path="create" element={<EmpresasFormPage />} />
                        <Route path=":id" element={<AdminEmpresaShowPage />} />
                        <Route path=":id/create" element={<AdminForm />} />
                    </Route>
                    <Route path="ciudades">
                        <Route index element={<CiudadesIndexPage />} />
                        <Route path="create" element={<CiudadesFormPage />} />
                        <Route path=":id" element={<CiudadesShowPage />} />
                        <Route path=":id/edit" element={<CiudadesFormPage />} />
                    </Route>
                    <Route path="lugares">
                        <Route path=":id/edit" element={<LugaresFormPage />} />
                    </Route>
                </Route>
                <Route path="/empresa" element={<EmpresaAdminLayout />}>
                    <Route index element={<HomeEmpresaPage />} />
                    <Route path="admin">
                        <Route path="autobuses">
                            <Route path="create" element={<AutobusesFormPage />} />
                        </Route>
                        <Route path="funcionarios">
                            <Route index element={<FuncionariosListPage />} />
                            <Route path="create" element={<FuncionariosFormPage />} />
                        </Route>
                        <Route path="viajes">
                            <Route index element={<ViajesIndexPage />} />
                        </Route>
                    </Route>
                    <Route path="autobuses">
                        <Route index element={<AutobusesIndexPage />} />
                        <Route path=":id" element={<AutobusesShowPage />} />
                        <Route path=":id/viaje/create" element={<ViajesCreatePage />} />
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
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;