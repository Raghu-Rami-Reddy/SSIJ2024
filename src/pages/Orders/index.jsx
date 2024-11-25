import { useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Data from './../../Data.json';

function Orders() {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [filterCat, setFilterCat] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState("ID"); // Default sorting by ID
    const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;

    // Sorting logic based on sortBy and sortOrder
    const sortedData = [...Data].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
        }
    });

    const filteredData = sortedData.filter(item => 
        item.NAME.toLowerCase().includes(searchTerm.toLowerCase()) && (filterCat === "" || item.CATEGORY === filterCat)
    );
    const records = searchTerm === '' && filterCat === '' ? sortedData.slice(firstIndex, lastIndex):filteredData.slice(firstIndex, lastIndex);
    const npage = searchTerm === '' && filterCat === '' ? Math.ceil(sortedData.length / itemsPerPage):Math.ceil(filteredData.length / itemsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);


    // Function to handle sorting
    const handleSort = (key) => {
        if (sortBy === key) {
        setSortOrder(sortOrder === "asc" ? "desc" : "asc");
        } else {
        setSortBy(key);
        setSortOrder("asc");
        }
    };

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
        <div className="orders px-[3%] pb-[2%] flex justify-between items-center ">
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
            <label> Filter by 
            <select
              value={filterCat} 
              onChange={(e) => setFilterCat(e.target.value)}
              className="mx-2 p-3 text-gray-500 bg-gray-100 rounded-md drop-shadow-md "
            >
              <option value="">All Categories</option>
              {[...new Set(Data.map((item) => item.CATEGORY))].map((cat) => (
                <option key={cat} value={cat}>
                  {cat}
                </option>
              ))}
            </select>
            </label>
            <div>
                <input 
                    type="text" 
                    placeholder="Search by Product Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 border border-gray-300 rounded outline-none"
                />
            </div>
        </div>
        <div className='table-responsive'>
             <table className="tableP w-[95%]">
                <thead>
                    <tr>
                        <th className="hover:cursor-pointer" onClick={() => handleSort("ID")}>ID {sortBy === "ID" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                        <th>PRODUCT</th>
                        <th>NAME</th>
                        <th>CATEGORY</th>
                        <th>PRICE</th>
                        <th>STOCK</th>
                        <th>WEIGHT</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length > 0 ? (
                    records.map(d => (
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
                        <td>
                            <div className="actions flex items-center justify-around">
                                <Tooltip title="view" placement="top"><button className="hover:bg-green-500 rounded-md"><FaRegEye /></button></Tooltip>
                                <Tooltip title="edit" placement="top"><button className="hover:bg-yellow-500 rounded-md"><CiEdit /></button></Tooltip>
                                <Tooltip title="delete" placement="top"><button className="hover:bg-red-500 rounded-md"><MdDeleteForever /></button></Tooltip>
                            </div>
                        </td>
                    </tr>
                    ))):(<tr><td colSpan="4">No results found</td></tr>)}
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
        </>
    )
}
export default Orders;