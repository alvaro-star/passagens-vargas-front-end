import { Link } from "react-router-dom"
import FormInlineTemplate from "./Components/FormInlineTemplate"

const Home = () => {
    
    const token = sessionStorage.getItem('token')

    return (
        <div className="w-full relative flex items-center justify-center flex-col">
            <div className="w-full ">
                <div className="m-10 text-white absolute right-0 left-0 flex justify-between">
                    <div className="text-2xl font-semibold">
                        Logo
                    </div>
                    {!token ?
                        <div className="flex items-center gap-4">
                            <Link to='/registrar' className="rounded px-3 py-1.5 hover:bg-white hover:text-black">REGISTRAR</Link>
                            <Link to='/login' className="rounded bg-white text-black px-3 py-1.5">ENTRAR</Link>
                        </div>
                        :
                        <div className="flex items-center gap-4">
                            <Link to='/login' className="rounded bg-white text-black px-3 py-1.5">Log Out</Link>
                        </div>
                    }
                </div>
                <header className="w-full text-white h-96 bg-gray-500 grid place-content-center">
                    <div className="text-center">
                        <p className="text-2xl">Lorem ipsum idolor</p>
                        <p className="uppercase font-bold text-6xl">Viaje fácil</p>
                        <p className="text-2xl">Seu Portal de Passagens de Ônibus Online</p>
                    </div>
                </header>
                <section className="w-full h-16 -mt-9 absolute text-black bg-white bg-opacity-0">
                    <FormInlineTemplate />
                </section>

                <section className="w-full mt-24 mx-24">
                    <h2 className="text-2xl font-bold">Principais Rotas</h2>
                    <div className="mt-2">
                        <div className="w-64 rounded shadow-xl">
                            <div className="rounded-t flex flex-col px-5 py-4">
                                <p>Santa Cruz</p>
                                <p>Potosi</p>
                            </div>
                            <div className="bg-gray-300 h-64 p-5 relative">
                                <div className="absolute bottom-0 mb-5">
                                    <p className="text-sm">A partir de </p>
                                    <p className="text-2xl font-bold">Bs 66</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </section>
                <footer className="bg-gray-500 mt-96 w-full p-16 flex justify-between items-center gap-10">
                    <section className="w-96">
                        Redes Sociais
                    </section>
                    <div className="flex gap-16">
                        <section>
                            <h2>
                                About US
                            </h2>
                            <Link to='/sobre'>Sobre</Link>
                        </section>
                        <section>
                            <h2>
                                Contact Us
                            </h2>
                        </section>
                    </div>
                </footer>
            </div>

        </div>
    )
}

export default Home