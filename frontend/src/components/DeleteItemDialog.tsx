import type { Item } from "../types"

interface Props {
    ref: React.RefObject<HTMLDialogElement | null>,
    setItems: (value: React.SetStateAction<Item[]>) => void,
    itemid?: number
}

export default ({setItems, itemid, ref}:Props) => {
    return (
        <dialog ref={ref} className="m-auto bg-transparent" onClick={e=>{
            if (e.target === ref.current) ref.current.close();
        }}>
            <div className="p-4 bg-white rounded-lg">
                <button onClick={()=>{
                    setItems(prev=>prev.filter(i=>i.id !== itemid));
                    fetch(`http://localhost:8000/items/${itemid}/`, {
                    method: "DELETE"
                    });
                    ref.current?.close();
                }} className="bg-red-600 p-2 rounded-lg ml-auto block hover:bg-red-400 cursor-pointer text-white">delete item #{itemid} permanently?</button>
            </div>
        </dialog>
    )
}