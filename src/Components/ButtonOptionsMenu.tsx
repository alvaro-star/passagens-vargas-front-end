import { useState } from "react";
import PrimaryButtonEmpresa from "./PrimaryButtonEmpresa";
interface Props {
    children: React.ReactNode
    classNameButton?: string
    optionsMenu: React.ReactNode
}
export default function ButtonOptionsMenu({ children, optionsMenu, classNameButton = "" }: Props) {
    const [showOptions, setShowOptions] = useState(false)
    return <div className="">
        <PrimaryButtonEmpresa onClick={() => setShowOptions(!showOptions)} className={classNameButton}>
            {children}
        </PrimaryButtonEmpresa>
        <div className="relative p-0 m-0">
            <div className={"z-10 w-40 top-1 right-0 bg-white m-0 p-0 flex flex-col " + (showOptions ? "absolute" : "hidden")}>
                {optionsMenu}
            </div>
        </div>
    </div >
}