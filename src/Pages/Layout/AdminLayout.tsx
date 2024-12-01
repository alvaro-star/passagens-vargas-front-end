import NavLink from "@/Components/NavLink"
import SecondaryButton from "@/Components/Buttons/SecondaryButton"
import { Outlet, useNavigate } from "react-router-dom"

const AdminLayout = () => {
    const navigate = useNavigate()
    const rotas = [{
        label: 'Empresas',
        url: '/admin/empresas'
    }, {
        label: 'Ciudades',
        url: '/admin/ciudades'
    }]

    const deslogar = () => {
        sessionStorage.removeItem('token')
        navigate('/')
    }

    return (
        <section className="min-h-screen relative bg-gray-100">
            <header className="w-full bg-black text-white p-5 flex justify-between">
                <div className="flex items-center gap-5">
                    V
                    {rotas.map((link, index) =>
                        <NavLink active={true} to={link.url} key={index} className="text-white">
                            {link.label}
                        </NavLink>
                    )}
                </div>
                <div className="mr-5">
                    <SecondaryButton onClick={deslogar}>
                        log out
                    </SecondaryButton>
                </div>
            </header>
            <Outlet />

        </section>
    )
}
export default AdminLayout