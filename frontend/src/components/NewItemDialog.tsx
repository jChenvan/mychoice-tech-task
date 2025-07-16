import { useEffect, useRef, useState } from "react"
import type { Item } from "../types"

interface Props {
    setItems: (value: React.SetStateAction<Item[]>) => void,
    ref:React.RefObject<HTMLDialogElement | null>,
}

export default ({setItems, ref}: Props)=>{
    const [error, setError] = useState("");
    const [name, setName] = useState("");
    const [group, setGroup] = useState<"PRIMARY"|"SECONDARY">("PRIMARY");
    const buttonRef = useRef<HTMLButtonElement>(null);

    useEffect(()=>{
        const handleKey = (e:KeyboardEvent) => {
            if (e.key == "Enter") {
                e.preventDefault();
                if (ref.current?.open) buttonRef.current?.click();
            }
        }

        document.addEventListener("keypress", handleKey);

        return () => document.removeEventListener("keypress", handleKey);
    }, []);

    return <dialog
            ref={ref}
            onClick={e=>{if (e.target === ref.current) ref.current.close()}}
            className="m-auto rounded-lg"
            onClose={()=>{
                setName("");
                setGroup("PRIMARY");
                setError("");
                }}>
        <div className="p-4">
            <form action="" onSubmit={e=>e.preventDefault()}>
                {error && <div className="text-red-800">
                    {error}
                    </div>}
                <label>
                    <h1 className="text-xl my-2">Name</h1>
                    <input type="text" name="name" className="ml-2 p-2 bg-blue-200 rounded-md" value={name} onChange={e=>setName(e.target.value)}/>
                </label>
                <label>
                    <h1 className="text-xl my-2">Group</h1>
                    <select name="group" className="ml-2 p-2 bg-blue-200 rounded-md" value={group} onChange={e=>setGroup(e.target.value as "PRIMARY"|"SECONDARY")}>
                        <option value="PRIMARY">Primary</option>
                        <option value="SECONDARY">Secondary</option>
                    </select>
                </label>
                <button type="button" ref={buttonRef} className="font-bold text-white bg-blue-600 p-2 rounded-lg ml-auto block mt-2 hover:opacity-80 cursor-pointer"
                onClick={async ()=>{
                    const res = await fetch("http://localhost:8000/items/", {
                        method: "POST",
                        body: JSON.stringify({
                            name,
                            group,
                        }),
                        headers: {
                            "Content-Type": "application/json",
                        }
                    });
                    if (res.ok) {
                        const newItem = (await res.json())[0];
                        setItems(prev=>[...prev, {
                            id: newItem.pk,
                            ...newItem.fields,
                        }]);
                        ref.current?.close();
                    } else {
                        setError((await res.json()).error)
                    }
                    }}>
                    create
                </button>
            </form>
        </div>
    </dialog>
}