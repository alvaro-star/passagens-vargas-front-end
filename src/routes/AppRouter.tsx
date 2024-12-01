import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import React, { Suspense } from "react";

const Login = React.lazy(() => import('../Pages/Auth/Login'));
const Register = React.lazy(() => import('../Pages/Auth/Register'));
const NotFound = React.lazy(() => import('../Pages/NotFound'));
const PassagensList = React.lazy(() => import('../Pages/Publico/PassagensList'));
const ViajesPage = React.lazy(() => import('../Pages/Publico/ViajesPage'));
const SobrePage = React.lazy(() => import('../Pages/Publico/SobrePage'));
const Dashboard = React.lazy(() => import('../Pages/Admin/Dashboard'));
const EmpresasFormPage = React.lazy(() => import('../Pages/Admin/Empresas/EmpresasFormPage'));
const EmpresaAdminLayout = React.lazy(() => import('../Pages/Layout/EmpresaAdminLayout'));
const HomeEmpresaPage = React.lazy(() => import('../Pages/Empresa/HomeEmpresaPage'));
const AutobusesIndexPage = React.lazy(() => import('../Pages/Empresa/Autobuses/AutobusesIndexPage'));
const CiudadesIndexPage = React.lazy(() => import('../Pages/Admin/Ciudades/CiudadesIndexPage'));
const EmpresaIndexPage = React.lazy(() => import('../Pages/Admin/Empresas/EmpresaIndexPage'));
const AdminLayout = React.lazy(() => import('../Pages/Layout/AdminLayout'));
const CiudadesFormPage = React.lazy(() => import('../Pages/Admin/Ciudades/CiudadesFormPage'));
const CiudadesShowPage = React.lazy(() => import('../Pages/Admin/Ciudades/CiudadesShowPage'));
const AutobusesFormPage = React.lazy(() => import('../Pages/Empresa/Autobuses/AutobusFormPage'));
const AutobusesShowPage = React.lazy(() => import('../Pages/Empresa/Autobuses/AutobusesShowPage'));
const LugaresFormPage = React.lazy(() => import('../Pages/Admin/Lugares/LugaresFormPage'));
const ViajesShowPage = React.lazy(() => import('../Pages/Empresa/Viajes/ViajesShowPage'));
const ViajesIndexPage = React.lazy(() => import('../Pages/Empresa/Viajes/ViajesIndexPage'));
const SwitchSillasPage = React.lazy(() => import('../Pages/Publico/SwitchSillasPage'));
const FuncionariosListPage = React.lazy(() => import('../Pages/Empresa/Admin/FuncionariosListPage'));
const FuncionariosFormPage = React.lazy(() => import('../Pages/Empresa/Admin/FuncionariosFormPage'));
const ViajesFuncionarioPage = React.lazy(() => import('../Pages/Empresa/Viajes/ViajesFuncionarioPage'));
const ParadaEditPage = React.lazy(() => import('../Pages/Empresa/Paradas/ParadaEditPage'));
const ViajesVentaPage = React.lazy(() => import('../Pages/Empresa/Viajes/ViajesVentaPage'));
const ViajesPagosPage = React.lazy(() => import('../Pages/Empresa/Viajes/ViajesPagosPage'));
const ValidarUser = React.lazy(() => import('../Pages/Auth/ValidarUser'));
const AdminEmpresaShowPage = React.lazy(() => import('../Pages/Admin/Empresas/AdminEmpresaShowPage'));
const AdminForm = React.lazy(() => import('../Pages/Admin/Empresas/AdminForm'));
const ViajesCreatePage = React.lazy(() => import('@/Pages/Empresa/Autobuses/ViajesCreatePage'));
const ResetPassword = React.lazy(() => import('@/Pages/Auth/ResetPassword'));
const Welcome = React.lazy(() => import("@/Pages/Publico/Welcome"));

import Loading from "@/Pages/Publico/Loading";
import Profile from "@/Pages/Auth/AdminPage/Profile";
import Home from "@/Pages/Publico/Home";
const AppRouter = () => {
    return (
        <Router>
            <Suspense fallback={<Loading />}>
                <Routes>
                    <Route path="/">
                        <Route index element={<Welcome />} />
                        <Route path="reset/password" element={<ResetPassword />} />
                        <Route path="login" element={<Login />} />
                        <Route path="registrar" element={<Register />} />
                        <Route path="validar" element={<ValidarUser />} />

                        <Route path="home" element={<Home />} />
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
                        <Route path="perfil">
                            <Route path="update" element={<Profile />} />
                        </Route>
                    </Route>
                    <Route path="*" element={<NotFound />} />
                </Routes>
            </Suspense>
        </Router>
    )
}

export default AppRouter;