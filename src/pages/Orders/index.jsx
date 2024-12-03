import { useState } from "react";
import Tooltip from '@mui/material/Tooltip';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { PiExportBold } from "react-icons/pi";
import { RxDotsVertical } from "react-icons/rx";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Data from './../../DataOrders.json';

function Orders() {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [filterStatus, setFilterStatus] = useState("");
    const [activeStatus, setActiveStatus] = useState("");
    const [searchTerm, setSearchTerm] = useState("");
    const [selectedRows, setSelectedRows] = useState([]);
    const [sortBy, setSortBy] = useState("orderId"); // Default sorting by orderId
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
        item.company.toLowerCase().includes(searchTerm.toLowerCase()) && (filterStatus === "" || item.status === filterStatus)
    );
    const records = searchTerm === '' && filterStatus === '' ? sortedData.slice(firstIndex, lastIndex):filteredData.slice(firstIndex, lastIndex);
    const npage = searchTerm === '' && filterStatus === '' ? Math.ceil(sortedData.length / itemsPerPage):Math.ceil(filteredData.length / itemsPerPage);
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

    // Function to handle rows selection
    const handleRowSelection = (orderId) => {
        setSelectedRows((prev) =>
          prev.includes(orderId) ? prev.filter((id) => id !== orderId) : [...prev, orderId]
        );
      };
    // Function to handle all rows selection
    const handleSelectAll = () => {
    if (selectedRows.length === records.length) {
        setSelectedRows([]); // Deselect all
    } else {
        setSelectedRows(records.map((row) => row.orderId)); // Select all
    }
    };
    // Function to handle row export to csv
    const handleExport = () => {
    const selectedData = Data.filter((row) => selectedRows.includes(row.orderId));
    const csvContent =
        "data:text/csv;charset=utf-8," +
        ["id,Company Name,Weight,Order ID,Order Date,Status"]
        .concat(
            selectedData.map(
            (row) =>
                `${row.id},${row.company},${row.weight},${row.orderId},${row.date},${row.status}`
            )
        )
        .join("\n");
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "selected_orders.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
                <p className="text-[14px] pr-1 text-[#A8ADB7]">Orders per page </p>
                <FormControl sx={{ minWidth: 60 }} size="small">
                    <InputLabel id="demo-select-small-label">Items</InputLabel>
                    <Select
                    labelId="demo-select-small-label"
                    id="demo-select-small"
                    value={itemsPerPage}
                    label="Items"
                    onChange={handleChange}
                    >
                    <MenuItem value={10}>10</MenuItem>
                    <MenuItem value={20}>20</MenuItem>
                    <MenuItem value={30}>30</MenuItem>
                    <MenuItem value={40}>40</MenuItem>
                    <MenuItem value={50}>50</MenuItem>
                    </Select>
                </FormControl>
            </div>
            <div>
                <input 
                    type="text" 
                    placeholder="Search by Company Name"
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="p-2 text-[14px] border border-gray-300 rounded-lg outline-none"
                />
            </div>
        </div>
        <div className="status px-[3%] pb-[2%] flex justify-between items-center">
            <ul className="list-none flex flex-wrap">
                <li onClick={()=>{setActiveStatus(""); setFilterStatus("")}} className={`p-1 ${activeStatus === "" ? 'active':''}`} key={"All orders"}>All orders</li>
                <li onClick={()=>{setActiveStatus("New"); setFilterStatus("New")}} className={`p-1 ${activeStatus === "New" ? 'active':''}`} key={"New"}>New</li>
                <li onClick={()=>{setActiveStatus("In progress"); setFilterStatus("In progress")}} className={`p-1 ${activeStatus === "In progress" ? 'active':''}`} key={"In progress"}>In progress</li>
                <li onClick={()=>{setActiveStatus("Dispatched"); setFilterStatus("Dispatched")}} className={`p-1 ${activeStatus === "Dispatched" ? 'active':''}`} key={"Dispatched"}>Dispatched</li>
                <li onClick={()=>{setActiveStatus("Shipped"); setFilterStatus("Shipped")}} className={`p-1 ${activeStatus === "Shipped" ? 'active':''}`} key={"Shipped"}>Shipped</li>
                <li onClick={()=>{setActiveStatus("Delivered"); setFilterStatus("Delivered")}} className={`p-1 ${activeStatus === "Delivered" ? 'active':''}`} key={"Delivered"}>Delivered</li>
                <li onClick={()=>{setActiveStatus("Cancelled"); setFilterStatus("Cancelled")}} className={`p-1 ${activeStatus === "Cancelled" ? 'active':''}`} key={"Cancelled"}>Cancelled</li>
            </ul>
            <div className="export rounded-md">
                <button onClick={handleExport} className="px-2 py-1 text-[14px] inline-flex items-center justify-center">
                    <PiExportBold className="mb-1"/>
                    <p className="text-[14px] px-1">Export</p>
                </button>
            </div>
        </div>
        <div className='Orders-responsive w-[95%] mx-auto'>
            <div className="ordersT overflow-x-scroll">
             <table className="tableO w-[100%]">
                <thead>
                    <tr>
                        <th className="text-center">
                            <input
                                type="checkbox"
                                checked={selectedRows.length === records.length && records.length > 0}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className="text-left">Company Name</th>
                        <th className="text-left">Weight(in grams)</th>
                        <th className="text-left hover:cursor-pointer" onClick={() => handleSort("orderId")}>Order ID {sortBy === "orderId" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                        <th className="text-left">Order Date</th>
                        <th className="text-left">Status</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {records.length > 0 ? (
                    records.map(d => (
                    <tr key={d.orderId}>
                        <td className="p-2 text-center">
                            <input
                            type="checkbox"
                            checked={selectedRows.includes(d.orderId)}
                            onChange={() => handleRowSelection(d.orderId)}
                            />
                        </td>
                        <td className="text-[#171A1F] font-bold">{d.company}</td>
                        <td className="text-[#171A1F] font-normal">{d.weight}</td>
                        <td className="text-[#171A1F] font-normal">{d.orderId}</td>
                        <td className="text-[#9095A1]">{d.date}</td>
                        <td>
                            <span className={`inline-block rounded-full px-2 py-1 text-xs font-medium ${
                                d.status === "New"? "bg-[#F0F8FE] text-[#1091F4]"
                                : d.status === "In progress"? "bg-[#FEF8F1] text-[#EF9834]"
                                : d.status === "Dispatched"? "bg-[#FFFADF] text-[#FFD400]"
                                : d.status === "Shipped"? "bg-[#EEFCFF] text-[#007A8F]"
                                : d.status === "Delivered"? "bg-[#EEFDF3] text-[#117B34]"
                                : d.status === "Cancelled"? "bg-[#FEF0F1] text-[#F22128]"
                                : "bg-green-50 text-green-600"
                                }`}>{d.status}
                            </span>
                        </td>
                        <td className="text-[#9095A1]">
                            <div className="flex items-center justify-around">
                                <Tooltip title="view" placement="top"><button><RxDotsVertical /></button></Tooltip>
                            </div>
                        </td>
                    </tr>
                    ))):(<tr><td colSpan="4">No results found</td></tr>)}
                </tbody>
             </table>
            </div>
            <nav className="flex items-center justify-between mx-1">
                <div className="results">{records.length} results</div>
                <ul className="pagination flex items-center justify-end">
                    <li className="page-item pr-1">
                        <a href="#" className="page-link" onClick={prePage}><FaAngleLeft /></a>
                    </li>
                    {
                        numbers.map((n,i) => (
                            <li className={`page-item flex items-center justify-center ${currentPage === n ? 'active':''}`} key={i}>
                                <a href="#" className="page-link px-2" onClick={()=>changePage(n)}>{n}</a>
                            </li>
                        ))
                    }
                    <li className="page-item pl-1">
                        <a href="#" className="page-link" onClick={nextPage}><FaAngleRight /></a>
                    </li>
                </ul>
            </nav>
        </div>
        </>
    )
}
export default Orders;