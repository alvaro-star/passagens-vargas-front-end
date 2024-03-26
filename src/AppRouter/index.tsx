import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "../Pages/Publico/Home";
import Header from "../Components/Header";
import Login from "../Pages/Auth/Login";

const AppRouter = () => {
    return (
        <Router>
            <Header />
            <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/login" element={<Login />} />
            </Routes>
        </Router>
    )
}

export default AppRouter;