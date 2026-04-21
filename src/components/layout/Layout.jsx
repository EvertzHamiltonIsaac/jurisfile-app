// import Navbar from '../topbar/Topbar';
// import { NavLink, Outlet } from 'react-router';
// import { House, BriefcaseBusiness, Folder, Users, Gavel } from 'lucide-react';
// import SidebarItem from '../SidebarItem/SidebarItem';

// const Layout = () => {
//   const sidebarItems = [
//     {
//       link: 'dashboard',
//       title: 'Dashboard',
//       div_container_class: 'flex gap-2',
//       icon: House,
//     },
//     {
//       link: 'matters',
//       title: 'Matters',
//       div_container_class: 'flex gap-2',
//       icon: BriefcaseBusiness,
//     },
//     {
//       link: 'documents',
//       title: 'Documents',
//       div_container_class: 'flex gap-2',
//       icon: Folder,
//     },
//     {
//       link: 'clients',
//       title: 'Clients',
//       div_container_class: 'flex gap-2',
//       icon: Users,
//     },
//     {
//       link: 'hearings',
//       title: 'Hearings',
//       div_container_class: 'flex gap-2',
//       icon: Gavel,
//     },
//   ];

//   return (
//     <div className='Layout-container flex h-screen overflow-y-hidden'>
//       <aside className='w-60 border-r border-foreground shrink-0 shadow'>
//         <section>
//           <img src='./public/JurisFile.png' alt='' />
//         </section>
//         <section className='p-4'>
//           <article>
//             <ul className='space-y-2'>
//               {sidebarItems.map((element) => (
//                 <SidebarItem
//                   key={element.title}
//                   link={element.link}
//                   title={element.title}
//                   div_container_class={element.div_container_class}
//                   icon={element.icon}
//                 />
//               ))}
//             </ul>
//           </article>
//         </section>
//       </aside>
//       <div className='w-full h-full'>
//         <Navbar />
//         <div className='body overflow-y-auto flex-1 p-10 pt-12'>
//           <Outlet />
//         </div>
//       </div>
//     </div>
//   );
// };

// export default Layout;

import { Outlet, NavLink } from 'react-router-dom';
import {
  LayoutDashboard,
  Briefcase,
  FolderOpen,
  Users,
  Gavel,
  Scale,
  Search,
  Bell,
  ChevronRight,
} from 'lucide-react';
import { Input } from '@/components/ui/input';

const navItems = [
  { to: '/dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { to: '/matters', label: 'Matters', icon: Briefcase },
  { to: '/documents', label: 'Documents', icon: FolderOpen },
  { to: '/clients', label: 'Clients', icon: Users },
  { to: '/hearings', label: 'Hearings', icon: Gavel },
];

export default function Layout() {
  return (
    <div className='flex h-screen bg-gray-50 overflow-hidden'>
      {/* Sidebar */}
      <aside className='w-56 bg-white border-r border-gray-100 flex flex-col shrink-0'>
        {/* Logo */}
        <div className='px-5 py-5 border-b border-gray-100'>
          <div className='flex items-center gap-2.5'>
            <div className='w-8 h-8 bg-slate-900 rounded-lg flex items-center justify-center'>
              <Scale className='w-4 h-4 text-white' />
            </div>
            <div>
              <p className='text-sm font-semibold text-slate-900 leading-none'>
                JurisFile
              </p>
              <p className='text-[10px] text-slate-400 mt-0.5'>Legal DMS</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className='flex-1 px-3 py-4 space-y-0.5'>
          <p className='text-[10px] font-semibold text-slate-400 uppercase tracking-widest px-3 mb-2'>
            Menu
          </p>
          {navItems.map(({ to, label, icon: Icon }) => (
            <NavLink
              key={to}
              to={to}
              className={({ isActive }) =>
                `flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm transition-all duration-150 group ${
                  isActive
                    ? 'bg-slate-900 text-white font-medium'
                    : 'text-slate-500 hover:bg-slate-50 hover:text-slate-900'
                }`
              }
            >
              {({ isActive }) => (
                <>
                  <Icon
                    className={`w-4 h-4 shrink-0 ${isActive ? 'text-white' : 'text-slate-400 group-hover:text-slate-600'}`}
                  />
                  <span className='flex-1'>{label}</span>
                  {isActive && (
                    <ChevronRight className='w-3 h-3 text-slate-400' />
                  )}
                </>
              )}
            </NavLink>
          ))}
        </nav>

        {/* Footer */}
        <div className='px-4 py-4 border-t border-gray-100'>
          <div className='flex items-center gap-2.5'>
            <div className='w-7 h-7 rounded-full bg-slate-200 flex items-center justify-center text-xs font-semibold text-slate-600'>
              CA
            </div>
            <div className='flex-1 min-w-0'>
              <p className='text-xs font-medium text-slate-700 truncate'>
                Carlos Admin
              </p>
              <p className='text-[10px] text-slate-400 truncate'>
                Administrator
              </p>
            </div>
          </div>
        </div>
      </aside>

      {/* Main area */}
      <div className='flex-1 flex flex-col overflow-hidden'>
        {/* Topbar */}
        <header className='h-14 bg-white border-b border-gray-100 flex items-center px-6 gap-4 shrink-0'>
          <div className='relative flex-1 max-w-md'>
            <Search className='absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400' />
            <Input
              placeholder='Search matters, clients, documents...'
              className='pl-9 h-8 text-sm bg-gray-50 border-gray-200 focus:bg-white rounded-lg'
            />
          </div>
          <div className='flex items-center gap-2 ml-auto'>
            <button className='relative w-8 h-8 rounded-lg hover:bg-gray-100 flex items-center justify-center transition-colors'>
              <Bell className='w-4 h-4 text-slate-500' />
              <span className='absolute top-1.5 right-1.5 w-1.5 h-1.5 bg-red-500 rounded-full'></span>
            </button>
          </div>
        </header>

        {/* Page content */}
        <main className='flex-1 overflow-y-auto'>
          <Outlet />
        </main>
      </div>
    </div>
  );
}
