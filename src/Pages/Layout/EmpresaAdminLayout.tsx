import { Outlet, useNavigate } from "react-router-dom"
import { FaBars, FaBell, FaBus, FaClipboardList, FaFingerprint, FaHome, FaMapMarked, FaNewspaper, FaTable, FaTools, FaTv, FaUserCircle, FaUserFriends } from "react-icons/fa"
import { TbLogout2 } from "react-icons/tb";
import { useState } from "react"
import CloseButton from "@/Components/Buttons/CloseButton"
import SubtittleComponent from "./Components/SubtittleComponent"
import LiButtonComponent from "./Components/LiButtonComponent"
import LinkLayoutComponent from "./Components/LinkLayoutComponent"

const EmpresaAdminLayout = () => {
    const navigate = useNavigate()
    const tipoUsuario = sessionStorage.getItem("role")
    const [activeRoute, setActiveRoute] = useState("/empresa")
    const rotas = {
        homePage: {
            label: 'Inicio',
            url: '/empresa'
        },
        autobusesPage: {
            label: 'Autobuses',
            url: '/empresa/autobuses'
        },
        viajesAdminPage: {
            label: 'Viajes Administrador',
            url: '/empresa/admin/viajes'
        },
        viajesFuncionarioPage: {
            label: 'Viajes',
            url: '/empresa/viajes'
        },
        funcionariosPage: {
            label: 'Funcionários',
            url: '/empresa/admin/funcionarios'
        }
    }

    const deslogar = () => {
        sessionStorage.removeItem('token')
        sessionStorage.removeItem('idEmpresa')
        navigate('/')
    }
    const [moreOptions, setMoreOptions] = useState(false)
    return (
        <section className="min-h-screen bg-gray-100 w-full md:flex">
            <div className=" md:left-0 md:block md:top-0 md:bottom-0 md:overflow-y-auto md:flex-row md:flex-nowrap md:overflow-hidden shadow-xl bg-white flex flex-wrap items-center justify-between relative md:w-64 z-50">
                <div className="md:flex-col md:items-stretch md:min-h-full md:flex-nowrap px-0 flex flex-wrap items-center justify-between w-full mx-auto">
                    <button
                        className="cursor-pointer text-black opacity-50 md:hidden px-5 py-1 text-xl leading-none bg-transparent rounded border border-solid border-transparent"
                        type="button"
                        onClick={() => setMoreOptions(true)}
                    >
                        <FaBars className="" />
                    </button>
                    <div onClick={() => navigate("/empresa")} className="cursor-pointer  md:block text-left md:pb-2 md:pl-5 md:pt-6 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
                        pasajes vargas
                    </div>
                    <ul className="md:hidden items-center flex flex-wrap list-none py-4 px-6">
                        <li className="inline-block relative">
                            <a className="text-blueGray-500 block py-1 px-3" href="#pablo">
                                <FaBell />
                            </a>
                            <div className="hidden bg-white text-base z-30 float-left py-2 list-none text-left rounded shadow-lg min-w-48">
                                <LinkLayoutComponent>Action</LinkLayoutComponent>
                                <LinkLayoutComponent>Another action</LinkLayoutComponent>
                                <LinkLayoutComponent>Something else here</LinkLayoutComponent>
                                <div className="h-0 my-2 border border-solid border-blueGray-100">
                                </div>
                                <LinkLayoutComponent>Seprated link</LinkLayoutComponent>
                            </div>
                        </li>
                        <li className="inline-block relative">
                            <a className="text-blueGray-500 block" href="#pablo">
                                <div className="items-center flex">
                                    <span className="w-12 h-12 text-sm text-white bg-blueGray-200 inline-flex items-center justify-center rounded-full">
                                        <img alt="..." className="w-full rounded-full align-middle border-none shadow-lg" src="https://demos.creative-tim.com/notus-nextjs/img/team-1-800x800.jpg" />
                                    </span>
                                </div>
                            </a>
                            <div className="hidden bg-white text-base z-50 float-left py-2 list-none text-left rounded shadow-lg min-w-48">
                                <LinkLayoutComponent>Action</LinkLayoutComponent>
                                <LinkLayoutComponent>Another action</LinkLayoutComponent>
                                <LinkLayoutComponent>Something else here</LinkLayoutComponent>
                                <div className="h-0 my-2 border border-solid border-blueGray-100">
                                </div>
                                <LinkLayoutComponent>Seprated link</LinkLayoutComponent>
                            </div>
                        </li>
                    </ul>
                    <div hidden={!moreOptions} className="m-6 md:m-0  md:flex bg-white md:flex-col md:items-stretch md:opacity-100 md:relative md:mt-4 md:shadow-none shadow absolute top-0 left-0 right-0 z-50 overflow-y-auto overflow-x-hidden h-auto items-center flex-1 rounded py-4 px-6">
                        <div className="md:min-w-full md:hidden block pb-4 mb-4 border-b border-solid border-blueGray-200">
                            <div className="flex flex-wrap">
                                <div className="w-6/12">
                                    <a href="#pablo" className="md:block text-left md:pb-2 text-blueGray-600 mr-0 inline-block whitespace-nowrap text-sm uppercase font-bold p-4 px-0">
                                        PASAJES VARGAS
                                    </a>
                                </div>
                                <div className="w-6/12 flex justify-end" onClick={() => setMoreOptions(false)}>
                                    <CloseButton />
                                </div>
                            </div>
                        </div>
                        <SubtittleComponent text="Paginas" />
                        <ul className="md:flex-col md:min-w-full flex flex-col list-none">
                            {tipoUsuario === "ROLE_EMPRESA_ADMIN" && <>
                                <LiButtonComponent
                                    setActiveRoute={setActiveRoute}
                                    icon={<FaHome />}
                                    to={rotas.homePage.url}
                                    text={rotas.homePage.label}
                                />
                                <LiButtonComponent
                                    setActiveRoute={setActiveRoute}
                                    icon={<FaBus />}
                                    to={rotas.autobusesPage.url}
                                    text={rotas.autobusesPage.label}
                                />
                                <LiButtonComponent
                                    setActiveRoute={setActiveRoute}
                                    icon={<FaClipboardList />}
                                    to={rotas.viajesAdminPage.url}
                                    text={rotas.viajesAdminPage.label}
                                />
                                <LiButtonComponent
                                    setActiveRoute={setActiveRoute}
                                    icon={<FaClipboardList />}
                                    to={rotas.viajesFuncionarioPage.url}
                                    text={rotas.viajesFuncionarioPage.label}
                                />
                                <LiButtonComponent
                                    setActiveRoute={setActiveRoute}
                                    icon={<FaUserFriends />}
                                    to={rotas.funcionariosPage.url}
                                    text={rotas.funcionariosPage.label}
                                />
                            </>}
                            {tipoUsuario === "ROLE_EMPRESA_FUNCIONARIO" && <>
                                <LiButtonComponent
                                    setActiveRoute={setActiveRoute}
                                    icon={<FaHome />}
                                    to={rotas.homePage.url}
                                    text={rotas.homePage.label}
                                />
                                <LiButtonComponent
                                    setActiveRoute={setActiveRoute}
                                    icon={<FaBus />}
                                    to={rotas.autobusesPage.url}
                                    text={rotas.autobusesPage.label}
                                />
                                <LiButtonComponent
                                    setActiveRoute={setActiveRoute}
                                    icon={<FaClipboardList />}
                                    to={rotas.viajesFuncionarioPage.url}
                                    text={rotas.viajesFuncionarioPage.label}
                                />
                            </>}
                        </ul>
                        <hr className="my-4 md:min-w-full" />
                        <SubtittleComponent text="Autenticacion" />
                        <ul className="md:flex-col md:min-w-full flex flex-col list-none md:mb-4">
                            <LiButtonComponent
                                setActiveRoute={setActiveRoute}
                                to="/update"
                                icon={<FaUserCircle />}
                                text="Perfil"
                            />
                            <li className="inline-flex">
                                <div className="cursor-pointer flex items-center spa text-gray-700 hover:text-blue-500 text-sm no-underline font-semibold" onClick={deslogar}>
                                    <TbLogout2 className="mr-2 text-gray-400 text-base" />
                                    <p>Cerrar Sesion</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>
            <div className="w-full  ">
                <div className="hidden md:block h-64 bg-yellow-500">
                </div>
                <div className="px-6 md:-mt-64">
                    <Outlet />
                </div>
            </div>
        </section>
    )
}
export default EmpresaAdminLayout