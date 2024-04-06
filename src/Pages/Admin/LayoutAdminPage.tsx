import { Outlet, useNavigate } from "react-router-dom"
import SecondaryButton from "../../Components/SecondaryButton"
import ApplicationLogo from "../../Components/ApplicationLogo"
import NavLink from "../../Components/NavLink"


const LayoutAdminPage = () => {
    const navigate = useNavigate()
    const rotas = [{
        label: 'Empresas',
        url: '/admin/empresas'
    }]

    const deslogar = () => {
        sessionStorage.removeItem('token')
        navigate('/login')
    }

    return (
        <>
            <header className="w-full bg-black text-white p-5 flex justify-between">
                <div className="flex items-center gap-5">
                    <ApplicationLogo className="h-10 invert" />
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
            <footer className="w-full bg-black text-white p-5">
                Teste
            </footer>
        </>
    )
}
export default LayoutAdminPage