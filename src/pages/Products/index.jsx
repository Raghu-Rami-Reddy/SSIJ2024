import { useEffect, useState } from "react";
import { FaRegEye } from "react-icons/fa";
import { CiEdit } from "react-icons/ci";
import { MdDeleteForever } from "react-icons/md";
import Tooltip from '@mui/material/Tooltip';
import { FaAngleLeft } from "react-icons/fa6";
import { FaAngleRight } from "react-icons/fa6";
import { FaWindowClose } from "react-icons/fa";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import {
    collection,
    deleteDoc,
    doc,
    onSnapshot,
  } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, deleteObject } from "firebase/storage";

function Products () { 
    const [data, setData] = useState([]);
    const [currentPage, setCurrentPage] = useState(1)
    const [itemsPerPage, setItemsPerPage] = useState(5);
    const [filterCat, setFilterCat] = useState("");
    const [searchTerm, setSearchTerm] = useState('');
    const [sortBy, setSortBy] = useState("id"); // Default sorting by id
    const [sortOrder, setSortOrder] = useState("asc"); // Default ascending order
    const [viewProd, setViewProd] = useState('');
    const [viewProdImg, setViewProdImg] = useState('');
    const lastIndex = currentPage * itemsPerPage;
    const firstIndex = lastIndex - itemsPerPage;

    useEffect( () => {
        // LISTEN (REALTIME)
        const unsub = onSnapshot(
          collection(db, "products"),
          (snapShot) => {
            let list = [];
            snapShot.docs.forEach((doc) => {
              list.push({ id: doc.id, ...doc.data() });
            });
            setData(list);
          },
          (error) => {
            console.log(error);
          }
        );
    
        return () => {
          unsub();
        };
    }, []);
    
// Deleting product along with images in storage
    const handleDelete = async(id) => {
        const nm = data.find(item => item.id === id);
        nm.purchaseInfo.forEach((info) =>{
            info.images.forEach((url)=>{
                const imageRef = ref(storage, url);
                deleteObject(imageRef).catch((error) => {
                console.error("Error deleting unsaved image:", error);
            })    
        })});
        try {
            await deleteDoc(doc(db, "products", id));
        } catch (err) {
            console.log(err);
        }
    };

    // Viewing Product
    const Prodview = (id) => {
        setViewProd(data.find(item => item.id === id));
        setViewProdImg(data.find(item => item.id === id).purchaseInfo[0].images[0]);
    }

    // Sorting logic based on sortBy and sortOrder
    const sortedData = [...data].sort((a, b) => {
        const aValue = a[sortBy];
        const bValue = b[sortBy];
        if (sortOrder === "asc") {
        return aValue < bValue ? -1 : aValue > bValue ? 1 : 0;
        } else {
        return bValue < aValue ? -1 : bValue > aValue ? 1 : 0;
        }
    });

    const filteredData = sortedData.filter(item => 
        item.name.toLowerCase().includes(searchTerm.toLowerCase()) && (filterCat === "" || item.category === filterCat)
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
        { viewProd?
        <div className="prodview px-[15%] py-[5%] absolute z-50">
            <section className="shadow-md border border-orange-700 rounded-lg p-4 backdrop-blur-lg relative">
                <h1 className="viewProdTitle text-2xl text-center drop-shadow-md mb-2">{viewProd.name}</h1>
                <div className="addPrd flex gap-6 flex-wrap">
                    <div className="grid grid-flow-col auto-cols-auto items-center">
                        <div className="auto-rows-auto">
                        {viewProd.purchaseInfo[0].images.map((path)=>(<img className="w-12 h-12 shadow-md object-center border border-orange-200 rounded-lg p-1 m-1" key={path} src={path} alt={path} onClick={()=> setViewProdImg(path)}/>))}
                        </div>
                        <img className="shadow-xl rounded-lg max-w-56 md:max-w-96" src={viewProdImg} alt={viewProdImg}/>
                    </div>
                    <ul className="flex-1 min-w-52">
                        <li className="m-2">{viewProd.description}</li>
                        <li className="m-2 text-gray-500 drop-shadow-md">Available Stock: {viewProd.purchaseInfo[0].stock}</li>
                        <li className="m-2 text-gray-500 drop-shadow-md">Product Weight: {viewProd.purchaseInfo[0].weight} grams</li>
                    </ul>
                </div>
                <button className="closeView absolute top-2 right-2 text-lg md:text-2xl hover:text-red-500" onClick={()=>{setViewProd(''); setViewProdImg('')}}> <FaWindowClose /></button>
            </section>
        </div>:<></>}
        <div className="orders px-[3%] pb-[2%] flex justify-between items-center relative">
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
              {[...new Set(data.map((item) => item.category))].map((cat) => (
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
        <div className='table-res-p mx-[3%] rounded-xl overflow-x-scroll shadow-md'>
             <table className="tableP w-[100%]">
                <thead>
                    <tr>
                        <th className="hover:cursor-pointer hidden" onClick={() => handleSort("id")}>ID {sortBy === "id" && (sortOrder === "asc" ? "↑" : "↓")}</th>
                        <th>PRODUCT</th>
                        <th>NAME</th>
                        <th>CATEGORY</th>
                        <th>PRODUCT CODE</th>
                        <th>STOCK</th>
                        <th>WEIGHT</th>
                        <th>ACTION</th>
                    </tr>
                </thead>
                <tbody>
                    {records.length > 0 ? (
                    records.map(d => (
                    <tr key={d.id}>
                        <td className="hidden">{d.id}</td>
                        <td>
                            <img src={d.purchaseInfo[0].images[0]} className="w-[75px] h-[75px] rounded-md"/>
                        </td>
                        <td>    
                            <h6 className="text-ellipsis text-wrap">{d.name}</h6>  
                        </td>
                        <td>{d.category}</td>
                        <td>{d.code}</td>
                        <td>{d.purchaseInfo[0].stock}</td>
                        <td>{d.purchaseInfo[0].weight}</td>
                        <td>
                            <div className="actions flex items-center justify-around">
                                <Tooltip title="view" placement="top"><button onClick={() => Prodview(d.id)} className="hover:bg-green-500 rounded-md"><FaRegEye /></button></Tooltip>
                                <Tooltip title="edit" placement="top"><button className="hover:bg-yellow-500 rounded-md"><CiEdit /></button></Tooltip>
                                <Tooltip title="delete" placement="top"><button onClick={() => handleDelete(d.id)} className="hover:bg-red-500 rounded-md"><MdDeleteForever /></button></Tooltip>
                            </div>
                        </td>
                    </tr>
                    ))):(<tr><td colSpan="4">No results found</td></tr>)}
                </tbody>
             </table>
             <nav className="flex items-center justify-center">
                <ul className="pagination flex items-center justify-center w-[100%] p-2">
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
export default Products;