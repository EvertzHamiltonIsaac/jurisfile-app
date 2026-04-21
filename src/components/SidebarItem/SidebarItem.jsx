import { NavLink, Outlet } from 'react-router';

const SidebarItem = ({ link, div_container_class, title, icon: Icon }) => {
  return (
    <li className='p-2 rounded-lg text-gray-900 hover:bg-gray-50 transition-colors'>
      <NavLink to={link}>
        <div className={div_container_class}>
          {Icon && <Icon />}
          <span>{title}</span>
        </div>
      </NavLink>
    </li>
  );
};

export default SidebarItem;
