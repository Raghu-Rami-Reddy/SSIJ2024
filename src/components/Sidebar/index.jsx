import React, { useEffect, useState } from "react";
import Logo from '../../assets/images/logo.webp'
import { Link } from "react-router-dom";
import Button from '@mui/material/Button';
import { RxDashboard } from "react-icons/rx";
import { FaListOl } from "react-icons/fa";
import { RxFileText } from "react-icons/rx";
import { AiFillProduct } from "react-icons/ai";
import { FiUsers } from "react-icons/fi";
import { MdOutlineCategory } from "react-icons/md";
import { BsChatLeftDots } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { IoIosArrowForward } from "react-icons/io";
import { AiOutlineStock } from "react-icons/ai";
import { DiGoogleAnalytics } from "react-icons/di";
import { IoIosList } from "react-icons/io";
import { TbInvoice } from "react-icons/tb";
import { TbCategory, TbCategoryPlus } from "react-icons/tb";
import { MdOutlineInventory } from "react-icons/md";
import { RiDraftLine } from "react-icons/ri";
import { BsShop } from "react-icons/bs";
import { FaPeopleGroup, FaPeopleCarryBox } from "react-icons/fa6";
import { GrStakeholder } from "react-icons/gr";
import { MdListAlt } from "react-icons/md";
import { PiListPlusLight } from "react-icons/pi";
import { MdOutlineChat, MdOutlineMarkChatUnread, MdOutlineMarkUnreadChatAlt } from "react-icons/md";


const Sidebar = ()=>{
    const [activeTab, setActiveTab] = useState(0);
    const [isToggleSubmenu, setIsToggleSubmenu] = useState(false);
    const [activeSubmenu, setActiveSubmenu] =useState();


    const isOpenSubmenu = (index)=>{
        window.localStorage.setItem('activeTab', index);
        setActiveTab(index);
        setIsToggleSubmenu(!isToggleSubmenu);
        window.localStorage.removeItem('submenu');
        setActiveSubmenu();
    }
    const isSubmenuItem = (index)=>{
        setActiveSubmenu(index);
        window.localStorage.setItem('submenu', index);
    }

    const isNoSubmenu = (index)=>{
        setIsToggleSubmenu(false);
        setActiveTab(index);
        window.localStorage.setItem('activeTab', index);
        window.localStorage.removeItem('submenu');
    }

    useEffect(() => {
        const asyncLocalStorage = async () => {
            const lsdata = await JSON.parse(window.localStorage.getItem('activeTab'));
            const submenunum = await JSON.parse(window.localStorage.getItem('submenu'));
            setActiveTab(lsdata);
            setActiveSubmenu(submenunum);
        }
        asyncLocalStorage()
          .catch(console.error);
        if (activeSubmenu !== '') {
            setIsToggleSubmenu(true);
        } 
      }, [])

      
    return(
        <>
            <div className="sidebar top-0 sticky z-[100] drop-shadow-lg">
                <div className="logoWrapper flex justify-center">
                    <img src={Logo} alt="SSIJ_Logo" className="w-[90%] m-1"/>
                </div>
                <div className="sidebarTab ">
                    <ul className="flex flex-col gap-2 w-[100%]">
                        <li className="list-none w-[100%]">
                            <Link to='/'>
                            <Button onClick={()=>isOpenSubmenu(0)} disableRipple className={`w-[100%] flex items-center justify-center toast ${activeTab === 0 ? 'active': ''}`}>
                                <span className="Dashboard w-[30px] h-[30px] flex items-center justify-center rounded-md ">
                                    <RxDashboard />
                                </span>
                                {" "}Dashboard
                                <span className={`arrow ml-auto w-[25px] h-[25px] flex justify-center items-center ${activeTab === 0 && isToggleSubmenu === true ? "rotate":''}`}><IoIosArrowForward /></span>
                            </Button>
                            </Link>
                            <div className={`submenu ${activeTab === 0 && isToggleSubmenu === true ? "open":''}`}>
                                <ul className="flex flex-col list-none">
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(0)} disableRipple className={`w-[90%] ${activeSubmenu === 0 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <AiOutlineStock />
                                        </span>
                                        {" "}Sales
                                        </Button>
                                    </li>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(1)} disableRipple className={`w-[90%] ${activeSubmenu === 1 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <DiGoogleAnalytics />
                                        </span> 
                                        {" "}Analytics
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="list-none w-[100%]">
                            <Link to='/orders'>
                            <Button onClick={()=>isOpenSubmenu(1)} disableRipple className={`w-[100%] flex items-center justify-center toast ${activeTab === 1 ? 'active': ''}`}>
                                <span className="Orders w-[30px] h-[30px] flex items-center justify-center rounded-md">
                                    <FaListOl />
                                </span>
                                {" "}Orders
                                <span className={`arrow ml-auto w-[25px] h-[25px] flex justify-center items-center ${activeTab === 1 && isToggleSubmenu === true ? "rotate":''}`}><IoIosArrowForward /></span>
                            </Button>
                            </Link>
                            <div className={`submenu ${activeTab === 1 && isToggleSubmenu === true ? "open":''}`}>
                                <ul className="flex flex-col list-none">
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(2)} disableRipple className={`w-[90%] ${activeSubmenu === 2 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <IoIosList />
                                        </span>
                                        {" "}All orders
                                        </Button>
                                    </li>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(3)} disableRipple className={`w-[90%] ${activeSubmenu === 3 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <TbInvoice />
                                        </span> 
                                        {" "}Invoice
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="list-none w-[100%]">
                            <Button onClick={()=>isNoSubmenu(2)} disableRipple className={`w-[100%] toast ${activeTab === 2 ? 'active': ''}`}>
                                <span className="Reports w-[30px] h-[30px] flex items-center justify-center rounded-md">
                                    <RxFileText />
                                </span>
                                {" "}Reports
                            </Button>
                        </li>
                        <li className="list-none w-[100%]">
                            <Link to='/products'>
                            <Button onClick={()=>isOpenSubmenu(3)} disableRipple className={`w-[100%] flex items-center justify-center toast ${activeTab === 3 ? 'active': ''}`}>
                                <span className="Products w-[30px] h-[30px] flex items-center justify-center rounded-md ">
                                    <AiFillProduct />
                                </span>
                                {" "}Products
                                <span className={`arrow ml-auto w-[25px] h-[25px] flex justify-center items-center ${activeTab === 3 && isToggleSubmenu === true ? "rotate":''}`}><IoIosArrowForward /></span>
                            </Button>
                            </Link>
                            <div className={`submenu ${activeTab === 3 && isToggleSubmenu === true ? "open":''}`}>
                                <ul className="flex flex-col list-none">
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(4)} disableRipple className={`w-[90%] ${activeSubmenu === 4 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <TbCategory />
                                        </span>
                                        {" "}All products
                                        </Button>
                                    </li>
                                    <Link to='/addproduct'>
                                    <li className="flex justify-end ">
                                        
                                        <Button onClick={()=>isSubmenuItem(5)} disableRipple className={`w-[90%] ${activeSubmenu === 5 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                        <TbCategoryPlus />
                                        </span> 
                                        {" "}Add a product
                                        </Button>
                                        
                                    </li>
                                    </Link>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(6)} disableRipple className={`w-[90%] ${activeSubmenu === 6 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <MdOutlineInventory />
                                        </span>
                                        {" "}Inventory
                                        </Button>
                                    </li>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(7)} disableRipple className={`w-[90%] ${activeSubmenu === 7 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <RiDraftLine />
                                        </span> 
                                        {" "}Draft
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="list-none w-[100%]">
                            <Button onClick={()=>isOpenSubmenu(4)} disableRipple className={`w-[100%] flex items-center justify-center toast ${activeTab === 4 ? 'active': ''}`}>
                                <span className="Users w-[30px] h-[30px] flex items-center justify-center rounded-md">
                                    <FiUsers />
                                </span>
                                {" "}Users
                                <span className={`arrow ml-auto w-[25px] h-[25px] flex justify-center items-center ${activeTab === 4 && isToggleSubmenu === true ? "rotate":''}`}><IoIosArrowForward /></span>
                            </Button>
                            <div className={`submenu ${activeTab === 4 && isToggleSubmenu === true ? "open":''}`}>
                                <ul className="flex flex-col list-none">
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(8)} disableRipple className={`w-[90%] ${activeSubmenu === 8 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <BsShop />
                                        </span>
                                        {" "}Retailers
                                        </Button>
                                    </li>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(9)} disableRipple className={`w-[90%] ${activeSubmenu === 9 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <FaPeopleGroup />
                                        </span> 
                                        {" "}Employees
                                        </Button>
                                    </li>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(10)} disableRipple className={`w-[90%] ${activeSubmenu === 10 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <FaPeopleCarryBox />
                                        </span>
                                        {" "}Workers
                                        </Button>
                                    </li>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(11)} disableRipple className={`w-[90%] ${activeSubmenu === 11 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <GrStakeholder />
                                        </span> 
                                        {" "}Vendors
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="list-none w-[100%]">
                            <Button onClick={()=>isOpenSubmenu(5)} disableRipple className={`w-[100%] flex items-center justify-center toast ${activeTab === 5 ? 'active': ''}`}>
                                <span className="Categories w-[30px] h-[30px] flex items-center justify-center rounded-md">
                                    <MdOutlineCategory />
                                </span>
                                {" "}Categories
                                <span className={`arrow ml-auto w-[25px] h-[25px] flex justify-center items-center ${activeTab === 5 && isToggleSubmenu === true ? "rotate":''}`}><IoIosArrowForward /></span>
                            </Button>
                            <div className={`submenu ${activeTab === 5 && isToggleSubmenu === true ? "open":''}`}>
                                <ul className="flex flex-col list-none">
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(12)} disableRipple className={`w-[90%] ${activeSubmenu === 12 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <MdListAlt />
                                        </span>
                                        {" "}Category list
                                        </Button>
                                    </li>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(13)} disableRipple className={`w-[90%] ${activeSubmenu === 13 ? 'active': ''}`}>
                                        <span className="icon mx-2 ">
                                            <PiListPlusLight />
                                        </span> 
                                        {""}Add new category
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="list-none w-[100%]">
                            <Button onClick={()=>isOpenSubmenu(6)} disableRipple className={`w-[100%] flex items-center justify-center toast ${activeTab === 6 ? 'active': ''}`}>
                                <span className="Notifications w-[30px] h-[30px] flex items-center justify-center rounded-md">
                                    <BsChatLeftDots />
                                </span>
                                {" "}Notifications
                                <span className={`arrow ml-auto w-[25px] h-[25px] flex justify-center items-center ${activeTab === 6 && isToggleSubmenu === true ? "rotate":''}`}><IoIosArrowForward /></span>
                            </Button>
                            <div className={`submenu ${activeTab === 6 && isToggleSubmenu === true ? "open":''}`}>
                                <ul className="flex flex-col list-none">
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(14)} disableRipple className={`w-[90%] ${activeSubmenu === 14 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <MdOutlineChat />
                                        </span>
                                        {" "}Create Notifications
                                        </Button>
                                    </li>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(15)} disableRipple className={`w-[90%] ${activeSubmenu === 15 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <MdOutlineMarkUnreadChatAlt />
                                        </span> 
                                        {" "}Past Notifications
                                        </Button>
                                    </li>
                                    <li className="flex justify-end ">
                                        <Button onClick={()=>isSubmenuItem(16)} disableRipple className={`w-[90%] ${activeSubmenu === 16 ? 'active': ''}`}>
                                        <span className="icon mx-2">
                                            <MdOutlineMarkChatUnread />
                                        </span>
                                        {" "}Draft
                                        </Button>
                                    </li>
                                </ul>
                            </div>
                        </li>
                        <li className="list-none w-[100%] mb-4">
                            <Button onClick={()=>isNoSubmenu(7)} disableRipple className={`w-[100%] toast ${activeTab === 7 ? 'active': ''}`}>
                                <span className="Settings w-[30px] h-[30px] flex items-center justify-center rounded-md">
                                    <IoSettingsOutline />
                                </span>
                                {" "}Settings
                            </Button>
                        </li>
                    </ul>  
                </div>
            </div>
        </>
    )
}
export default Sidebar