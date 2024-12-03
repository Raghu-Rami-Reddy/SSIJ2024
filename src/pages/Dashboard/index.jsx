import { useState } from "react";
import { RxDashboard } from "react-icons/rx";
import { BiSolidReport } from "react-icons/bi";
import Tooltip from '@mui/material/Tooltip';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { PiExportBold } from "react-icons/pi";
import { FiEdit } from "react-icons/fi";
import { BiImport } from "react-icons/bi";
import Data from './../../DashOrdersData.json';
import DashboardStatsCards from "../../components/DashboardStatsCards";

export const Dashboard = () => {
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(10);
    const [selectedRows, setSelectedRows] = useState([]);
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;

    const records = Data.slice(firstIndex, lastIndex);
    const npage = Math.ceil(Data.length / itemsPerPage);
    const numbers = [...Array(npage + 1).keys()].slice(1);


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
     <div className="px-[3%]">
        <span className="inline-flex items-center justify-center pb-4"><RxDashboard className="text-[#CC7B25] w-5 h-5"/><h2 className="pl-2 font-bold text-[20px] text-[#171A1F]">Overview</h2></span>
        
        {/* Dashboard Stats Cards */}
        <DashboardStatsCards />
        <div className="dashReport flex justify-between pb-3">
            <span className="inline-flex items-center justify-center">
                <BiSolidReport className="text-[#CC7B25] w-6 h-6"/>
                <h2 className="pl-2 font-bold text-[20px] text-[#171A1F]">Detailed report</h2>
            </span>
            <div className="inline-flex">
                <div className="export rounded-md mx-1">
                    <button className="px-2 py-1 text-[14px] inline-flex items-center justify-center">
                        <BiImport />
                        <p className="text-[14px] px-1">Import</p>
                    </button>
                </div>
                <div className="export rounded-md mx-1">
                    <button onClick={handleExport} className="px-2 py-1 text-[14px] inline-flex items-center justify-center">
                        <PiExportBold />
                        <p className="text-[14px] px-1">Export</p>
                    </button>
                </div>
            </div>
        </div>
        {/* Table section */}
        <div className='Orders-responsive mx-auto'>
            <div className="ordersD overflow-x-scroll">
             <table className="tableD w-[100%]">
                <thead>
                    <tr>
                        <th className="text-center">
                            <input
                                type="checkbox"
                                checked={selectedRows.length === records.length && records.length > 0}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th className="text-left">COMPANY NAME</th>
                        <th className="text-left">MANAGER</th>
                        <th className="text-left">ORDER VALUE</th>
                        <th className="text-left">ORDER DATE</th>
                        <th className="text-center">STATUS</th>
                        <th></th>
                    </tr>
                </thead>
                <tbody>
                    {records.length > 0 ? (
                    records.map(d => (
                    <tr key={d.companyName}>
                        <td className="p-2 text-center">
                            <input
                            type="checkbox"
                            checked={selectedRows.includes(d.orderId)}
                            onChange={() => handleRowSelection(d.orderId)}
                            />
                        </td>
                        <td className="text-[#171A1F] font-bold">{d.companyName}</td>
                        <td className="text-[#171A1F] font-normal">{d.manager}</td>
                        <td className="text-[#171A1F] font-normal">{d.orderValue}</td>
                        <td className="text-[#9095A1]">{d.orderDate}</td>
                        <td className="text-center">
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
                                <Tooltip title="edit" placement="top"><button><FiEdit /></button></Tooltip>
                            </div>
                        </td>
                    </tr>
                    ))):(<tr><td colSpan="6">No results found</td></tr>)}
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
     </div>
    )
}
