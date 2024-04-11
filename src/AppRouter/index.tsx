import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import LayoutPublicClass from "../Pages/Layout/LayoutPublicClass";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import NotFound from "../Pages/NotFound";
import ViajeShow from "../Pages/Publico/ViajeShow";
import PassagensList from "../Pages/Publico/PassagensList";
import ViajesPage from "../Pages/Publico/ViajesPage";
import SobrePage from "../Pages/Publico/SobrePage";
import LayoutAdminPage from "../Pages/Admin/LayoutAdminPage";
import Dashboard from "../Pages/Admin/Dashboard";
import ListPage from "../Pages/Admin/Empresas/ListPage";
import EmpresasFormPage from "../Pages/Admin/Empresas/EmpresasFormPage";
import EmpresaLayout from "../Pages/Layout/EmpresaLayout";
import Home from "../Pages/Publico/Home";
import HomeEmpresaPage from "../Pages/Empresa/HomeEmpresaPage";
import AutobusesIndexPage from "../Pages/Admin/Autobuses/AutobusesIndexPage";
import AutobusesFormPage from "../Pages/Admin/Autobuses/AutobusesFormPage";
import CiudadesIndexPage from "../Pages/Admin/Ciudades/CiudadesIndexPage";

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/">
                    <Route index element={<Home />} />
                    <Route path="login" element={<Login />} />
                    <Route path="registrar" element={<Register />} />
                    <Route path="viajes" element={<ViajesPage />} />
                    <Route path="viaje/:id" element={<ViajeShow />} />
                    <Route path="viaje/step3/:id" element={<PassagensList />} />
                    <Route path="sobre" element={<SobrePage />} />
                </Route>
                <Route path="/admin" element={<LayoutAdminPage />}>
                    <Route index element={<Dashboard />} />
                    <Route path="empresas">
                        <Route index element={<ListPage />} />
                        <Route path="create" element={<EmpresasFormPage />} />
                    </Route>
                    <Route path="autobuses">
                        <Route index element={<AutobusesIndexPage />} />
                        <Route path="create" element={<AutobusesFormPage />} />
                    </Route>
                    <Route path="ciudades">
                        <Route index element={<CiudadesIndexPage />} />
                        <Route path="create" element={<AutobusesFormPage />} />
                    </Route>
                </Route>
                <Route path="/empresa" element={<EmpresaLayout />}>
                    <Route index element={<HomeEmpresaPage />} />
                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;