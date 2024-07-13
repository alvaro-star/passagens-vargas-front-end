import Piso from "@/Pages/Publico/Components/Piso"
import { useState } from "react"
import IAutobusExtends from "../Types/IAutobusExtends"

interface Props {
    autobus: IAutobusExtends
}
const AutobusModelShowPage = ({ autobus }: Props) => {

    const [pisoShow, setPisoShow] = useState(1)
    return <div className="w-full bg-white">
        {autobus.pisos.length > 1 &&
            <select className="ml-3 p-2 rounded bg-white border border-gray-700" value={pisoShow} onChange={e => setPisoShow(parseInt(e.target.value))}>
                <option value="1">Piso 1</option>
                <option value="2">Piso 2</option>
            </select>}

        {autobus.pisos.map(piso =>
            <Piso hidden={piso.nPiso != pisoShow} key={piso.id} piso={piso} sillasOcupadas={[]} />
        )}
    </div>

}

export default AutobusModelShowPage