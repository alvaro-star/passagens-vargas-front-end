interface Props {
    campo: number
    setCampo: (campo: number) => void
    minValue: number
    maxValue: number
}

const InputNumber = ({ minValue, maxValue, campo, setCampo }: Props) => {
    return (
        <div className="w-full bg-white rounded p-1 flex justify-around text-center">
            <div
                className="w-1/3 hover:text-white hover:bg-slate-500 rounded cursor-pointer"
                onClick={() => {
                    if (!(campo - 1 < minValue)) {
                        setCampo(campo - 1)
                    }
                }}
            > {'<'} </div>
            <div className="w-1/3">
                {campo}
            </div>
            <div
                className="w-1/3 hover:text-white hover:bg-slate-500 rounded cursor-pointer"
                onClick={() => {
                    if (!(campo + 1 > maxValue)) {
                        setCampo(campo + 1)
                    }
                }}
            > {'>'} </div>
        </div>
    )
}

export default InputNumber