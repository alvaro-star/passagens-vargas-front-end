import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Publico/Home";
import Header from "../Components/Header";
import Login from "../Pages/Auth/Login";
import Register from "../Pages/Auth/Register";

const AppRouter = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
                <Route path="/registrar" element={<Register />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;