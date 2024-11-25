import { useState } from 'react'
import { Outlet } from 'react-router-dom'
import Sidebar from '../Sidebar'
import Header from '../Header'
import { RiMenuFold3Fill, RiMenuUnfold3Fill } from "react-icons/ri";


export default function Layout() {
  const [menuToggle, setMenuToggle] = useState(false);

	return (
		<section className="main flex"> 
          { menuToggle ? <button onClick={()=>setMenuToggle(!menuToggle)} className="Toggle h-[40px] w-[40px] text-[30px]" ><RiMenuUnfold3Fill /></button>:
          <div className="sidebarWrapper w-[15%]">
            <button onClick={()=>setMenuToggle(!menuToggle)} className="MenuToggle h-[40px] w-[40px] text-[30px]" ><RiMenuFold3Fill /></button>
            <Sidebar />
          </div>}
          <div className="content_Right w-full"> 
            <Header />
            <div className="mt-5"></div>
            <Outlet />
			</div>
		</section>
	)
}
