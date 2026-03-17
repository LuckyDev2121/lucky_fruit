import { useEffect, useState } from "react"
import { type GameElement, getGameElements } from "../api/gameElementApi"

export default function SlotGrid() {
    const [elements, setElements] = useState<GameElement[]>([])

    useEffect(() => {
        async function loadElements() {
            const data = await getGameElements()
            setElements(data)
        }

        loadElements()
    }, [])

    return (
        <div className="absolute top-[90px] p-1 z-30 left-1/2 transform -translate-x-1/2">
            {elements.map((el) => (
                <div key={el.id} className="flex flex-col items-center justify-center">
                    <img
                        src={el.element_icon}
                        alt={el.element_name}
                    />
                    <span>{el.paytable} Times</span>
                </div>
            ))}
        </div>
    )
}
