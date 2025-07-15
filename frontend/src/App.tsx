import { useEffect, useRef, useState } from 'react'
import Icon from '@mdi/react'
import { mdiClose, mdiEye, mdiPen, mdiPlus } from '@mdi/js'
import type { Item } from './types';
import NewItemDialog from './components/NewItemDialog';

function App() {
  const [items, setItems] = useState<Item[]>([]);
  const newItemDialogRef = useRef<HTMLDialogElement>(null);

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
  }, []);

  return (
    <>
      <NewItemDialog setItems={setItems} ref={newItemDialogRef}/>
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
                <button className='p-2 hover:opacity-50 cursor-pointer'>
                  <Icon path={mdiEye} size={1} color={"blue"}/>
                </button>
                <button className='p-2 hover:opacity-50 cursor-pointer'>
                  <Icon path={mdiPen} size={1} color={"blue"}/>
                </button>
                <button className='p-2 hover:opacity-50 cursor-pointer' onClick={()=>{
                  setItems(prev=>prev.filter(i=>i.id !== item.id));
                  fetch(`http://localhost:8000/items/${item.id}/`, {
                    method: "DELETE"
                  });
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

export default App
