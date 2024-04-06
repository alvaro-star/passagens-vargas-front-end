import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Publico/Home";
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

const AppRouter = () => {
    return (
        <Router>
            <Routes>
                <Route path="/" element={<LayoutPublicClass />}>
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
                    <Route path="empresas" element={<ListPage />} />
                    <Route path="empresas/create" element={<EmpresasFormPage />} />
                </Route>
                <Route path="/empresa" >

                </Route>
                <Route path="*" element={<NotFound />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;