import Navbar from '../topbar/Topbar';
import { NavLink, Outlet } from 'react-router';

const Layout = () => {
  return (
    <div className='Layout-container flex h-screen overflow-y-hidden'>
      <aside className='bg-sky-100  w-60 shrink-0'>
        <section>
          <img src='./public/JurisFile Logo.png' alt='' />
        </section>
        <section>
          <article>
            <ul>
              <li>
                <NavLink to='dashboard'>DashBoard</NavLink>
              </li>
              <li>
                <NavLink to='cases'>Cases</NavLink>
              </li>
              <li>
                <NavLink to='documents'>Documents</NavLink>
              </li>
              <li>
                <NavLink to='clients'>Clients</NavLink>
              </li>
              <li>
                <NavLink to='hearings'>Hearings</NavLink>
              </li>
            </ul>
          </article>
        </section>
      </aside>
      <div className='w-full h-full'>
        <Navbar />
        <div className='body overflow-y-auto flex-1'>
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default Layout;
