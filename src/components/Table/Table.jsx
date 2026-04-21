import {
  useReactTable,
  getCoreRowModel,
  flexRender,
} from '@tanstack/react-table';
import React, { useMemo } from 'react';
import { FilePlus, ListFilter } from 'lucide-react';
import '../Table/Table.css';

const Table = ({ data_table, columns }) => {
  const columns_Memorized = useMemo(() => columns, []);
  const data_Memorized = useMemo(() => data_table, []);

  console.log(data_Memorized);
  console.log(columns_Memorized);
  const table = useReactTable({
    data: data_Memorized,
    columns: columns_Memorized,
    getCoreRowModel: getCoreRowModel(),
  });

  return (
    <div>
      <article className='table-handle-container'>
        <div className='input-table '>
          <input type='text' placeholder='hola..' />
        </div>
        <div className='buttons-table'>
          <div className='filter-buttons-table m-auto bg-amber-100 rounded-lg'>
            <ListFilter />
          </div>
          <div className='add-buttons-table flex gap-1 rounded-lg'>
            <FilePlus />
            <button>Agregar Expediente</button>
          </div>
        </div>
      </article>
      <section className='overflow-x-auto shadow-sm rounded-lg overscroll-contain'>
        <table className='min-w-full divide-y divide-gray-200 overflow-hidden'>
          <thead className='bg-gray-50'>
            {table.getHeaderGroups().map((headerGroup) => (
              <tr key={headerGroup.id} className='text-sm tracking-wider'>
                {headerGroup.headers.map((header) => (
                  <th key={header.id} className='p-2'>
                    {flexRender(
                      header.column.columnDef.header,
                      header.getContext(),
                    )}
                  </th>
                ))}
              </tr>
            ))}
          </thead>
          <tbody>
            {table.getRowModel().rows.map((row) => (
              <tr key={row.id} className='hover:bg-gray-50 transition-colors'>
                {row.getVisibleCells().map((cell) => (
                  <td
                    key={cell.id}
                    className='p-2 whitespace-nowrap text-center cursor-pointer'
                  >
                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </section>
    </div>
  );
};

export default Table;
