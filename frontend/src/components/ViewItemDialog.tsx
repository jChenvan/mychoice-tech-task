import type { Item } from "../types"

interface Props {
    ref:React.RefObject<HTMLDialogElement | null>,
    item?: Item,
}

export default ({ref, item}: Props)=>{

    return <dialog ref={ref} onClick={e=>{if (e.target === ref.current) ref.current.close()}} className="m-auto rounded-lg">
        {item && <div className="p-4">
            <label>
                <h1 className="text-xl my-2">id</h1>
                <div className="ml-2 p-2 bg-blue-200 rounded-md">{item.id}</div>
            </label>
            <label>
                <h1 className="text-xl my-2">Name</h1>
                <div className="ml-2 p-2 bg-blue-200 rounded-md">{item.name}</div>
            </label>
            <label>
                <h1 className="text-xl my-2">Group</h1>
                <div className="ml-2 p-2 bg-blue-200 rounded-md">{item.group}</div>
            </label>
            <label>
                <h1 className="text-xl my-2">Created</h1>
                <div className="ml-2 p-2 bg-blue-200 rounded-md">{new Date(item["created_at"]).toLocaleString()}</div>
            </label>
            <label>
                <h1 className="text-xl my-2">Updated</h1>
                <div className="ml-2 p-2 bg-blue-200 rounded-md">{new Date(item["updated_at"]).toLocaleString()}</div>
            </label>
        </div>}
    </dialog>
}