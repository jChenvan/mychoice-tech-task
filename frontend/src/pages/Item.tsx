import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom"
import type { Item } from "../types";

export default () => {
    const { itemid } = useParams();
    const [item, setItem] = useState<Item>();
    const nav = useNavigate();

    useEffect(()=>{
        (async ()=>{
            const res = await fetch(`http://localhost:8000/items/${itemid}/`);
            const json = await res.json();
            if (!res.ok) {
                alert(json.error);
                nav("/");
                return;
            }
            setItem({
                id: json[0].pk,
                ...json[0].fields
            });
        })();
    }, [itemid]);

    return <div className="w-screen h-screen flex justify-center items-center">
    {item && <div className="p-4 w-fit shadow-md rounded-lg">
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
        <button type="button" className="font-bold text-white bg-blue-600 p-2 rounded-lg ml-auto block mt-2 hover:opacity-80 cursor-pointer"
        onClick={()=>nav("/")}>
            all items
        </button>
    </div>}
    </div>
}