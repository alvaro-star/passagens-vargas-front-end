import { Link, Outlet, useNavigate } from "react-router-dom"
import SecondaryButton from "../../Components/SecondaryButton"
import NavLink from "../../Components/NavLink"


const EmpresaAdminLayout = () => {
    const navigate = useNavigate()
    const tipoUsuario = sessionStorage.getItem("role")
    const rotas = [{
        label: 'Autobuses',
        url: '/empresa/autobuses'
    }, {
        label: 'Viajes Administrador',
        url: '/empresa/admin/viajes'
    }, {
        label: 'Viajes Funcionarios',
        url: '/empresa/viajes'
    }, {
        label: 'Funcionários',
        url: '/empresa/admin/funcionarios'
    }]

    const rotasFuncionario = [{
        label: 'Autobuses',
        url: '/empresa/autobuses'
    }, {
        label: 'Viajes',
        url: '/empresa/viajes'
    }]

    const deslogar = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('idEmpresa')
        navigate('/')
    }

    return (
        <section className="min-h-screen bg-gray-100">
            <header className="w-full bg-blue-900 text-white p-5 flex justify-between">
                <div className="flex items-center gap-5">
                    <Link to="/empresa" className="text-2xl font-bold">
                        VP
                    </Link>
                    {tipoUsuario === "ROLE_EMPRESA_ADMIN" && rotas.map((link, index) =>
                        <NavLink active={true} to={link.url} key={index} className="text-white">
                            {link.label}
                        </NavLink>
                    )}
                    {tipoUsuario === "ROLE_EMPRESA_FUNCIONARIO" && rotasFuncionario.map((link, index) =>
                        <NavLink active={true} to={link.url} key={index} className="text-white">
                            {link.label}
                        </NavLink>
                    )}
                </div>
                <div className="mr-5">
                    <SecondaryButton className="bg-white rounded-none" onClick={deslogar}>
                        log out
                    </SecondaryButton>
                </div>
            </header>
            <Outlet />
        </section>
    )
}
export default EmpresaAdminLayout