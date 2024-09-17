interface Props {
    className?: string,
    checked?: boolean
    clickFunction: () => void
    children: React.ReactNode
}

export default function MetodoPagoBox({ className = '', checked = false, clickFunction, children }: Props) {
    return <div className={className + "px-3 py-2 flex items-center border boder-1 border-gray-500 " + (checked ? " bg-gray-400 text-white font-semibold" : " hover:bg-gray-100")}>
        <input
            type="radio"
            checked={checked}
            onChange={clickFunction}
            className="mr-2"
        />
        <div className="w-full flex items-center cursor-pointer" onClick={clickFunction}>
            {children}
        </div>
    </div>
}