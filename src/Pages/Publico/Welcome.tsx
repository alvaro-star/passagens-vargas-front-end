import { Link, useNavigate } from "react-router-dom"

const Welcome = () => {
    const navigate = useNavigate()
    const token = sessionStorage.getItem('token')
    const logout = () => {
        sessionStorage.removeItem('token')
        navigate('/')
    }
    return <div className="bg-slate-400 min-h-screen grid place-content-center">
        <div className="w-96 rounded bg-white p-5">
            <h1 className="text-2xl font-semibold">Bienvenido!</h1>
            <p>¡Hola! Gracias por visitar nuestra página.</p>
            <p>Estamos encantados de tenerte aquí. Esperamos que disfrutes tu visita.</p>
            <div className="w-full mt-2 flex items-center space-x-4 justify-center text-white">
                {!token
                    ? <>
                        <Link to='/registrar'
                            className="rounded bg-slate-500 px-3 py-1.5 hover:font-semibold hover:bg-gray-400">REGISTRAR</Link>
                        <Link to='/login'
                            className="rounded bg-gray-400 text-white px-3 py-1.5">ENTRAR</Link>
                    </>
                    : <button onClick={logout}
                        className="bg-slate-500  rounded text-white px-3 py-1.5">
                        SALIR
                    </button>
                }
            </div>
        </div>
    </div>
}

export default Welcome