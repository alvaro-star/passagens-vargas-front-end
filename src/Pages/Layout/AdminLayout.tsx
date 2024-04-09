import { Link, useNavigate } from "react-router-dom"
import ApplicationLogo from "../../Components/ApplicationLogo"
import NavLink from "../../Components/NavLink"
import PrimaryButton from "../../Components/PrimaryButton"

const AdminLayout = () => {
    const navihate = useNavigate()
    const links = [{
        label: 'Pasages',
        url: '/pasages'
    }, {
        label: 'Viajes',
        url: '/viajes'
    }, {
        label: 'Sobre',
        url: '/sobre'
    }]
    
    let token = sessionStorage.getItem("token")
    const sair = () => {
        sessionStorage.removeItem("token")
        navihate("/login")
    }

    return (
        <header className="bg-red-100 p-6 flex justify-between items-center">
            <div className="flex items-center justify-center gap-2">
                <ApplicationLogo className="h-5" />
                {links.map((link, index) =>
                    <NavLink active={true} to={link.url} key={index}>
                        {link.label}
                    </NavLink>
                )}
            </div>
            <div className="text-white flex items-center gap-2">
                {token ?
                    <PrimaryButton onClick={sair}>
                        Log Out
                    </PrimaryButton>
                    :
                    <>
                        <Link to="/login" className="inline-flex items-center px-4 py-2 bg-gray-800 border border-transparent rounded-md font-semibold text-xs text-white uppercase tracking-widest hover:bg-gray-700 focus:bg-gray-700 active:bg-gray-900 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition ease-in-out duration-150">
                            Login
                        </Link>
                        <Link to="/registrar" className="inline-flex items-center px-4 py-2 bg-white border border-gray-300 rounded-md font-semibold text-xs text-gray-700 uppercase tracking-widest shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-25 transition ease-in-out duration-150">
                            Register
                        </Link>
                    </>
                }
            </div>
        </header>
    )
}
export default AdminLayout