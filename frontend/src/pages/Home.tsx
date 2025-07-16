import { useEffect, useRef, useState } from "react";
import type { Item } from "../types";
import { mdiPlus, mdiEye, mdiPen, mdiClose } from "@mdi/js";
import Icon from "@mdi/react";
import EditItemDialog from "../components/EditItemDialog";
import NewItemDialog from "../components/NewItemDialog";
import { useNavigate } from "react-router-dom";
import DeleteItemDialog from "../components/DeleteItemDialog";

export default () => {
    const [items, setItems] = useState<Item[]>([]);
    const [current, setCurrent] = useState<Item>();
    const newItemDialogRef = useRef<HTMLDialogElement>(null);
    const editItemDialogRef = useRef<HTMLDialogElement>(null);
    const deleteItemDialogRef = useRef<HTMLDialogElement>(null);
    const nav = useNavigate();

    useEffect(()=>{
    (async ()=>{
        const res = await fetch('http://localhost:8000/items/');
        const json = await res.json();
        const items:Item[] = json.map((item:any):Item=>({
        id:item.pk,
        ...item.fields
        }));

        items.sort((i1,i2)=>(
        new Date(i1["created_at"]).valueOf() - new Date(i2["created_at"]).valueOf()
        ));

        setItems(items);
    })();

    const handleKey = (e:KeyboardEvent)=>{
        if (e.key === "Enter") {
            if (newItemDialogRef.current?.open) {
                const form = newItemDialogRef.current.querySelector("form");
                form?.requestSubmit();
            }
            if (editItemDialogRef.current?.open) {
                const form = editItemDialogRef.current.querySelector("form");
                form?.requestSubmit();
            }
        }
    } 

    document.body.addEventListener("keypress", handleKey);

    return ()=>{
        document.body.removeEventListener("keypress", handleKey);
    }
    }, []);

    return (
    <>
        <NewItemDialog setItems={setItems} ref={newItemDialogRef}/>
        <EditItemDialog item={current} ref={editItemDialogRef} setItems={setItems}/>
        <DeleteItemDialog itemid={current?.id} ref={deleteItemDialogRef} setItems={setItems}/>
        <div className='w-screen h-screen flex justify-center items-center'>
        <table className='rounded-lg overflow-hidden shadow-md'>
            <thead className='bg-blue-700'>
            <tr>
                <th className='p-4 text-white'>id</th>
                <th className='p-4 text-white'>name</th>
                <th className='p-4 text-white'>group</th>
                <th className='p-4 text-white'>created</th>
                <th className='p-4 text-white'>updated</th>
                <th>
                <button className='m-4 cursor-pointer hover:opacity-80' onClick={()=>newItemDialogRef.current?.showModal()}>
                    <Icon path={mdiPlus} size={1} color={"white"}/>
                </button>
                </th>
            </tr>
            </thead>
            <tbody>
            {items.map((item, index)=><tr key={item.id} className={`bg-${index % 2 ? "transparent" : "blue-300"}`}>
                <td className='px-2'>{item.id}</td>
                <td className='pr-2'>{item.name}</td>
                <td className='pr-2'>{item.group}</td>
                <td className='pr-2'>{new Date(item["created_at"]).toLocaleString()}</td>
                <td className='pr-2'>{new Date(item["updated_at"]).toLocaleString()}</td>
                <td>
                <button className='p-2 hover:opacity-50 cursor-pointer' onClick={()=>nav(`/item/${item.id}`)}>
                    <Icon path={mdiEye} size={1} color={"blue"}/>
                </button>
                <button className='p-2 hover:opacity-50 cursor-pointer' onClick={()=>{
                    setCurrent(item);
                    editItemDialogRef.current?.showModal();
                }}>
                    <Icon path={mdiPen} size={1} color={"blue"}/>
                </button>
                <button className='p-2 hover:opacity-50 cursor-pointer' onClick={()=>{
                    setCurrent(item);
                    deleteItemDialogRef.current?.showModal();
                }}>
                    <Icon path={mdiClose} size={1} color={"blue"}/>
                </button>
                </td>
            </tr>)}
            {!items.length && <tr><td colSpan={6} className='text-center p-4 bg-blue-300'>No items, click "+" to add!</td></tr>}
            </tbody>
        </table>
        </div>
    </>
    )
}