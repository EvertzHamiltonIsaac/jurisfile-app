import { Search } from 'lucide-react';

const Navbar = () => {
  return (
    <div className='Navbar-container'>
      <div className='w-full h-16 border-b border-foreground flex items-center shadow'>
        <div className='flex items-center w-150 h-10 ml-10 rounded-xl p-2 bg-foreground shadow cursor-pointer'>
          <Search />
          <input
            type='text'
            placeholder='Escribe aquí...'
            className='w-full h-full rounded-md px-3 py-2 focus:outline-none'
          />
        </div>
      </div>
    </div>
  );
};

export default Navbar;
