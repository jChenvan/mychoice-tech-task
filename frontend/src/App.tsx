import { useState } from 'react'
import Icon from '@mdi/react'
import { mdiPlus } from '@mdi/js'

interface Item {
  id: number,
  name: string,
  group: "PRIMARY" | "SECONDARY",
  "created_at": string,
  "updated_at": string,
}

function App() {
  const [items, setItems] = useState<Item[]>([]);

  return (
    <>
      <div className='w-screen h-screen flex justify-center items-center'>
        <table className='rounded-lg overflow-hidden'>
          <thead className='bg-blue-700'>
            <tr>
              <th className='p-4 text-white'>id</th>
              <th className='p-4 text-white'>name</th>
              <th className='p-4 text-white'>group</th>
              <th className='p-4 text-white'>created</th>
              <th className='p-4 text-white'>updated</th>
              <th>
                <button className='m-4 cursor-pointer hover:opacity-80'><Icon path={mdiPlus} size={1} color={"white"}/></button>
              </th>
            </tr>
          </thead>
          {!items.length && <tr><td colSpan={6} className='text-center p-4 bg-blue-300'>No items, click "+" to add!</td></tr>}
        </table>
      </div>
    </>
  )
}

export default App
