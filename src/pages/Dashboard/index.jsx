import { useState } from "react";
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Data from './../../Data.json';
import TransactionChart from "../../components/TransactionChart";
import DashboardStatsCards from "../../components/DashboardStatsCards";

export const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;
    const records = Data.slice(firstIndex, lastIndex);
    const npage = Math.ceil(Data.length / itemsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);
    

    const handleChange = (event) => {
        setItemsPerPage(event.target.value);
    };
    function prePage() {
        if(currentPage !== 1) {
            setCurrentPage(currentPage - 1)
        }
    }
    function nextPage() {
        if(currentPage !== npage) {
            setCurrentPage(currentPage + 1)
        }
    }
    function changePage(id) {
        setCurrentPage(id)
    }

    return (
        <>
        {/* Dashboard Stats Cards */}
        <DashboardStatsCards />

        {/* TransactionChart */}
        <TransactionChart />
        
        {/* Table section */}
        <div className="ordersTable shadow-md rounded-xl mx-[3%] pt-3 mb-3 border border-orange-200">
            <div className="mx-[2%] flex justify-between items-center ">
                    <h2 className="text-xl text-gray-600">Latest Orders</h2>
                    <div className="flex justify-start items-center">
                    <h6 className="pr-4">Products per page </h6>
                    <FormControl sx={{ minWidth: 100 }} size="small">
                        <InputLabel id="demo-select-small-label">Items</InputLabel>
                        <Select
                        labelId="demo-select-small-label"
                        id="demo-select-small"
                        value={itemsPerPage}
                        label="Items"
                        onChange={handleChange}
                        >
                        <MenuItem value={5}>5</MenuItem>
                        <MenuItem value={10}>10</MenuItem>
                        <MenuItem value={20}>20</MenuItem>
                        <MenuItem value={30}>30</MenuItem>
                        <MenuItem value={30}>40</MenuItem>
                        <MenuItem value={30}>50</MenuItem>
                        </Select>
                    </FormControl>
                    </div>
            </div>
            <div className='table-responsive overflow-x-scroll'>
                <table className="tableP w-[96%]">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>PRODUCT</th>
                            <th>NAME</th>
                            <th>CATEGORY</th>
                            <th>PRICE</th>
                            <th>STOCK</th>
                            <th>WEIGHT</th>
                        </tr>
                    </thead>
                    <tbody>
                    {records.map(d => (
                        <tr key={d.ID}>
                            <td>{d.ID}</td>
                            <td>
                                <img src={d.PRODUCT} className="w-[75px] h-[75px] rounded-md"/>
                            </td>
                            <td>    
                                <h6 className="text-ellipsis text-wrap">{d.NAME}</h6>  
                            </td>
                            <td>{d.CATEGORY}</td>
                            <td>{d.PRICE}</td>
                            <td>{d.STOCK}</td>
                            <td>{d.WEIGHT}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
                <nav className="flex items-center justify-center">
                    <ul className="pagination flex items-center justify-center w-[95%] p-2">
                        <li className="page-item">
                            <a href="#" className="page-link" onClick={prePage}><FaAngleLeft /></a>
                        </li>
                        {
                            numbers.map((n,i) => (
                                <li className={`page-item ${currentPage === n ? 'active':''}`} key={i}>
                                    <a href="#" className="page-link mx-1" onClick={()=>changePage(n)}>{n}</a>
                                </li>
                            ))
                        }
                        <li className="page-item">
                            <a href="#" className="page-link" onClick={nextPage}><FaAngleRight /></a>
                        </li>
                    </ul>
                </nav>
            </div>
        </div>
        </>
    )
}
