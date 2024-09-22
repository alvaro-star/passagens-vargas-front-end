interface Props {
    header: React.ReactNode
    thead: React.ReactNode
    tbody: React.ReactNode
}

export default function TableComponent({ header, thead, tbody }: Props) {
    return <div className="relative flex flex-col min-w-0 pb-3 break-words w-full mb-6 shadow-lg rounded bg-white">
        <div className="rounded-t mb-0 px-4 py-1 border-0">
            <div className="flex flex-wrap items-center">
                <div className="relative w-full px-4 max-w-full flex-grow flex-1">
                    <h3 className="font-semibold text-lg text-blueGray-700">
                        {header}
                    </h3>
                </div>
            </div>
        </div>
        <div className="block w-full overflow-x-auto">
            <table className="items-center w-full bg-transparent border-collapse">
                <thead>
                    <tr>
                        {thead}
                    </tr>
                </thead>
                <tbody>
                    {tbody}
                </tbody>
            </table>
        </div>
    </div>
}