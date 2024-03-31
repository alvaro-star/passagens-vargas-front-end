import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Publico/Home";
import Header from "../Components/Header";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";
import NotFound from "../Pages/NotFound";
import ViajeShow from "../Pages/Publico/ViajeShow";

const AppRouter = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registrar" element={<Register />} />
                <Route path="*" element={<NotFound />} />
                <Route path="/viaje/:id" element={<ViajeShow />}/>
            </Routes>
        </Router>
    )
}

export default AppRouter;