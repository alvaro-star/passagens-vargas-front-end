import CloseButton from "@/Components/Buttons/CloseButton"

interface Props {
    showModal: boolean
    header: string
    className?: string
    classNameContainer?: string
    children: React.ReactNode
    onCloseAction?: () => void
    setShowModal: (values: boolean) => void
}

const CustomModal = ({ showModal, header, className = "", classNameContainer = "", onCloseAction, setShowModal, children }: Props) => {
    const onClose = () => {
        if (onCloseAction) onCloseAction()
        setShowModal(false)
    }
    return showModal ?
        <div className={`absolute inset-0 grid place-content-center ${className}`}>
            <div className={`${classNameContainer}`}>
                <div className={`flex items-center justify-between`}>
                    <span className="font-semibold text-lg">
                        {header}
                    </span>
                    <CloseButton onClick={onClose} />
                </div>
                {children}
            </div>
        </div>
        : <></>
}
export default CustomModal