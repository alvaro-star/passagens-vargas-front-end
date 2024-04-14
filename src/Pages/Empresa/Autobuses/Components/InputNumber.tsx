import ICampo from "../../../../Types/ICampo"

interface Props {
    campo: ICampo<number>
    setCampo: (campo: ICampo<number>) => void
    minValue: number
    maxValue: number
}

const InputNumber = ({ minValue, maxValue, campo, setCampo }: Props) => {
    return (
        <div className="w-full bg-white rounded p-1 flex justify-around text-center">
            <div
                className="w-1/3 hover:text-white hover:bg-slate-500 rounded cursor-pointer"
                onClick={() => {
                    if (!(campo.value - 1 < minValue)) {
                        setCampo({ value: campo.value - 1, erro: campo.erro })
                    }
                }}
            > {'<'} </div>
            <div className="w-1/3">
                {campo.value}
            </div>
            <div
                className="w-1/3 hover:text-white hover:bg-slate-500 rounded cursor-pointer"
                onClick={() => {
                    if (!(campo.value + 1 > maxValue)) {
                        setCampo({ value: campo.value + 1, erro: campo.erro })
                    }
                }}
            > {'>'} </div>
        </div>
    )
}

export default InputNumber