import { useRef, useEffect, useState } from "react";
import { IoSearchOutline } from "react-icons/io5";
import { IoIosNotifications } from "react-icons/io";
import { IoMdHelpCircleOutline } from "react-icons/io";
import Button from '@mui/material/Button';
import ClickAwayListener from '@mui/material/ClickAwayListener';
import Grow from '@mui/material/Grow';
import Paper from '@mui/material/Paper';
import Popper from '@mui/material/Popper';
import MenuItem from '@mui/material/MenuItem';
import MenuList from '@mui/material/MenuList';
import Stack from '@mui/material/Stack';
import { useLocation } from 'react-router-dom';
import { useUserAuth } from "../../context/UserAuthContext";
import logo from '../../assets/images/logo192.png';

const Header = () => {
    const [open, setOpen] = useState(false);
    const anchorRef = useRef(null);
    let location = useLocation();
    const {user, ename, logout} = useUserAuth();
    const pathdata = [
        {
            path: '/',
	        label: 'Dashboard'
	    },
        {
            path: '/orders',
            label: 'Orders'
        },
        {
            path: '/reports',
            label: 'Reports'
        },
        {
            path: '/products',
	        label: 'Products'
	    },
        {
            path: '/users',
            label: 'Users'
        },
        {
            path: '/categories',
	        label: 'Categories'
	    },
        {
            path: '/notification',
            label: 'Notification'
        },
        {
            path: '/settings',
	        label: 'Settings'
	    },
        {
            path: '/addproduct',
	        label: 'Add Product'
	    },
    ]
    let obj = pathdata.find((data) =>(location.pathname === data.path))
    const handleToggle = () => {
        setOpen((prevOpen) => !prevOpen);
      };
    
    const handleClose = (event) => {
        if (anchorRef.current && anchorRef.current.contains(event.target)) {
          return;
        }   
        setOpen(false);
      };
    
    function handleListKeyDown(event) {
        if (event.key === 'Tab') {
          event.preventDefault();
          setOpen(false);
        } else if (event.key === 'Escape') {
          setOpen(false);
        }
      };
    
    // return focus to the button when we transitioned from !open -> open
    const prevOpen = useRef(open);
    useEffect(() => {
    if (prevOpen.current === true && open === false) {
        anchorRef.current.focus();
    }

    prevOpen.current = open;
    }, [open]);

    // logout functionality
    const handleLogout = async () =>{
        try {
            window.localStorage.clear();
            await logout();
        } catch (err) {
            console.log(err.message);
        }
    };

  return (
    <header className='px-3 py-2 z-[90] top-0 sticky'>
        <div className='flex items-center justify-center md:justify-between flex-wrap'>
            {obj ? <h1 className="pgName px-[2%]">{obj.label}</h1>:<h1 className="pgName px-[2%]"></h1>}
            <ul className='flex items-center justify-center flex-wrap gap-2'>
                <li>
                    <div className="searchBox">
                        <i><IoSearchOutline /></i> 
                        <input type='text' placeholder='Search...' className='input w-100px rounded-2xl border' />
                    </div>
                </li>
                <li>
                    <Button color="warning"><IoIosNotifications /></Button>
                </li>
                <li>
                    <Button color="warning"><IoMdHelpCircleOutline /></Button>
                </li>
                <li>
                <Stack direction="row" spacing={2}>
                            <div className="myAcc w-[120px] h-[40px]">
                                <Button color="warning" className='w-[120px] h-[40px]' 
                                ref={anchorRef}
                                id="composition-button"
                                aria-controls={open ? 'composition-menu' : undefined}
                                aria-expanded={open ? 'true' : undefined}
                                aria-haspopup="true"
                                onClick={handleToggle}
                                >
                                    <span className="userImage flex items-center w-[70px] h-[40px] overflow-hidden ">
                                        <img src={logo} className='w-[35px] h-[35px] rounded-3xl'/>
                                    </span>
                                    <h3>{user && ename[0]}</h3>
                                </Button>
                            </div>
                            <Popper className="popper"
                            open={open}
                            anchorEl={anchorRef.current}
                            role={undefined}
                            placement="bottom-start"
                            transition
                            disablePortal
                            >
                            {({ TransitionProps, placement }) => (
                                <Grow
                                {...TransitionProps}
                                style={{
                                    transformOrigin:
                                    placement === 'bottom-start' ? 'left top' : 'left bottom',
                                }}
                                >
                                <Paper>
                                    <ClickAwayListener onClickAway={handleClose}>
                                    <MenuList 
                                        autoFocusItem={open}
                                        id="composition-menu"
                                        aria-labelledby="composition-button"
                                        onKeyDown={handleListKeyDown}
                                    >
                                        <MenuItem disableRipple onClick={handleClose} className="mItems" >Profile</MenuItem>
                                        <MenuItem disableRipple onClick={handleClose} className="mItems" >My account</MenuItem>
                                        <MenuItem disableRipple onClick={handleLogout} className="mItems" >Logout</MenuItem>
                                    </MenuList>
                                    </ClickAwayListener>
                                </Paper>
                                </Grow>
                            )}
                            </Popper>
                    </Stack>
                </li>
            </ul>
        </div>
    </header>
  )
}
export default Header;