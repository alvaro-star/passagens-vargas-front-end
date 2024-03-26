import NavLink from "./NavLink"

const Header = () => {
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

    return (
        <header>
            {links.map((link, index) =>
                <NavLink active={true} to={link.url} key={index}>
                    {link.label}
                </NavLink>
            )}
        </header>
    )
}
export default Header