import React, { useState, useRef } from "react";
import { addDoc, collection, serverTimestamp } from "firebase/firestore";
import { db, storage } from "../../firebase";
import { ref, uploadBytesResumable, getDownloadURL, deleteObject } from "firebase/storage";
import { FaRegTrashAlt } from "react-icons/fa";
import { FaPlus } from "react-icons/fa6";
import { FaCloudUploadAlt } from "react-icons/fa";

const AddProduct = () => {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [description, setDescription] = useState("");
  const [category, setCategory] = useState("");
  const [purchaseInfo, setPurchaseInfo] = useState([{ size: "", weight: "", stock: "", metalType: "", color: "", images: [] }]);
  const [uploadProgress, setUploadProgress] = useState({});
  const fileInputRefs = useRef([]);
  const uploadTasksRef = useRef({});

  // Handle add row
  const handleAddRow = () => {
    setPurchaseInfo([...purchaseInfo, { size: "", weight: "", stock: "", metalType: "", color: "", images: [] }]);
    fileInputRefs.current.push(React.createRef());
  };

  // Handle delete row
  const handleDeleteRow = async (index) => {
    const newPurchaseInfo = [...purchaseInfo];
    const rowToDelete = newPurchaseInfo[index];

    // Delete images from storage
    for (const imageUrl of rowToDelete.images) {
      const imageRef = ref(storage, imageUrl);
      try {
        await deleteObject(imageRef);
      } catch (error) {
        console.error('Error deleting image:', error);
      }
    }

    // Remove the row from purchaseInfo
    newPurchaseInfo.splice(index, 1);
    setPurchaseInfo(newPurchaseInfo);

    // Remove the corresponding file input ref
    fileInputRefs.current.splice(index, 1);

    // Remove any ongoing upload tasks for this row
    if (uploadTasksRef.current[index]) {
      uploadTasksRef.current[index].forEach(task => task.cancel());
      delete uploadTasksRef.current[index];
    }

    // Update upload progress state
    setUploadProgress(prev => {
      const newProgress = {...prev};
      Object.keys(newProgress).forEach(key => {
        if (key.startsWith(`${index}-`)) {
          delete newProgress[key];
        }
      });
      return newProgress;
    });
  };

  // Handle input changes in rows
  const handleInputChange = (index, field, value) => {
    const newPurchaseInfo = [...purchaseInfo];
    newPurchaseInfo[index][field] = value;
    setPurchaseInfo(newPurchaseInfo);
  };

  // Handle image deletion
  const handleDeleteImage = async (rowIndex, imageIndex) => {
    const newPurchaseInfo = [...purchaseInfo];
    const imageUrl = newPurchaseInfo[rowIndex].images[imageIndex];
    const imageRef = ref(storage, imageUrl);

    try {
      await deleteObject(imageRef);
      newPurchaseInfo[rowIndex].images.splice(imageIndex, 1);
      setPurchaseInfo(newPurchaseInfo);
    } catch (error) {
      console.error('Error deleting image:', error);
    }
  };

  // Handle image upload
  const handleImageUpload = async (index, files) => {
    const newPurchaseInfo = [...purchaseInfo];
    const imageUrls = newPurchaseInfo[index].images;

    if (imageUrls.length + files.length > 4) {
      alert('You can only upload up to 4 images per row.');
      return;
    }

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      if (file.size > 1024 * 1024) {
        alert('Each file size should be less than 1MB.');
        continue;
      }
      const date = new Date();
      const showTime = date.getHours() + ':' + date.getMinutes() + ":" + date.getSeconds();
      const uniqueName = `${showTime}-${file.name}`;
      const storageRef = ref(storage, `products/${uniqueName}`);
      const uploadTask = uploadBytesResumable(storageRef, file);
      // Store the upload task reference
      if (!uploadTasksRef.current[index]) {
        uploadTasksRef.current[index] = [];
      }
      uploadTasksRef.current[index].push(uploadTask);

      uploadTask.on('state_changed',
        (snapshot) => {
          const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setUploadProgress(prev => ({...prev, [`${index}-${uniqueName}`]: progress}));
        },
        (error) => {
          console.error('Upload failed:', error);
        },
        async () => {
          const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);
          setPurchaseInfo(prevInfo => {
            const newInfo = [...prevInfo];
            if (!newInfo[index].images.includes(downloadURL)) {
              newInfo[index].images.push(downloadURL);
            }
            return newInfo;
          });
          setUploadProgress(prev => {
            const newProgress = {...prev};
            delete newProgress[`${index}-${uniqueName}`];
            return newProgress;
          });
          if (fileInputRefs.current[index] && fileInputRefs.current[index].current) {
            fileInputRefs.current[index].current.value = "";
          }
          // Remove the completed upload task from the reference
          uploadTasksRef.current[index] = uploadTasksRef.current[index].filter(task => task !== uploadTask);
        }
      );
    }
  };

  // Handle product submission
  const handleSubmit = async () => {
    if (!name) {
      alert("Please fill all fields and upload images.");
      return;
    }
    try {
      await addDoc(collection(db, "products"), {
        name,
        code,
        description,
        category,
        purchaseInfo,
        createdAt: serverTimestamp()
      });
      alert("Product added successfully!");
      setName("");
      setCode("");
      setDescription("");
      setCategory("");
      setPurchaseInfo([{ size: "", weight: "", stock: "", metalType: "", color: "", images: [] }]);

      fileInputRefs.current.forEach(ref => {
        if (ref && ref.current) {
          ref.current.value = "";
        }
      });
    } catch (error) {
      console.error("Error adding product: ", error);
    }
  };

  return (
    <div className="addPrd flex gap-6 mx-[3%] justify-center flex-wrap mb-10">
      <div className="flex flex-col space-y-10 overflow-x-auto">
        <section className="space-y-4 shadow-md border border-orange-200 rounded-lg p-4">
          <h2 className="text-xl font-medium">Product Information</h2>
          <div>
            <label htmlFor="product-title" className="text-sm font-medium pr-2">Product Title</label>
            <input 
              id="product-title" 
              placeholder="Classic chain 22k" 
              className="outline-none text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded" 
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="product-code" className="text-sm font-medium pr-2">Product Code</label>
            <input 
              id="product-code" 
              placeholder="CC-S2024" 
              className="outline-none text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
              value={code}
              onChange={(e) => setCode(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="description" className="text-sm font-medium pr-2">Description</label>
            <textarea 
              id="description"
              placeholder="Splendid, exquisite, magnificent, luxurious, queenly, divine –Perfect diction when you're selling wedding jewelry or pieces made with very fine materials, directing your customer's attention to the quality you've put into every step."
              className="outline-none text-sm w-full px-4 py-2 border border-solid border-gray-300 rounded"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            />
          </div>
          <div>
            <label htmlFor="product-category" className="text-sm font-medium pr-2">Product Category</label>
            <div className="custom-select width:200px">
              <select className="p-2" name="category" value={category} onChange={(e) => setCategory(e.target.value)}>
                <option value="">Select Category:</option>
                <option value="Accessories">Accessories</option>
                <option value="Bangles">Bangles</option>
                <option value="Bracelets">Bracelets</option>
                <option value="Chain">Chain</option>
                <option value="Choker">Choker</option>
                <option value="Ear Rings">Ear Rings</option>
                <option value="Necklace">Necklace</option>
                <option value="Rings">Rings</option>
                <option value="vaddanam">vaddanam</option>
              </select>
            </div>
          </div>
        </section>

        <section className="space-y-4 shadow-md border border-orange-200 rounded-lg p-4">
          <h2 className="text-xl font-medium">Purchase Information</h2>
          <div className="addProdTable border rounded-lg">
            <table className="w-[100%]">
              <thead>
                <tr className="bg-muted">
                  <th className="px-4 pt-3 text-left">Size</th>
                  <th className="px-4 pt-3 text-left">Weight</th>
                  <th className="px-4 pt-3 text-left">Stock</th>
                  <th className="px-4 pt-3 text-left">Metal Type</th>
                  <th className="px-4 pt-3 text-left">Color</th>
                  <th className="px-4 pt-3 text-left">Images</th>
                  <th className="px-4 pt-3"></th>
                </tr>
                <tr>
                  <th className="text-[10px] text-gray-500 text-end" colSpan="7">*PNG, JPG, JPEG or WebP up to 1MB limit on each image (max 4 images)</th>
                </tr>
              </thead>
              <tbody>
                {purchaseInfo.map((info, index) => (
                  <tr key={index} className="border-t">
                    <td className="p-2">
                      <input
                        type="number"
                        placeholder="Size"
                        className="border border-gray-300 rounded-md p-1 w-16"
                        value={info.size}
                        onChange={(e) => handleInputChange(index, "size", e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        placeholder="Weight"
                        className="border border-gray-300 rounded-md p-1 w-20"
                        value={info.weight}
                        onChange={(e) => handleInputChange(index, "weight", e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <input
                        type="number"
                        placeholder="Quantity"
                        className="border border-gray-300 rounded-md p-1 w-20"
                        value={info.stock}
                        onChange={(e) => handleInputChange(index, "stock", e.target.value)}
                      />
                    </td>
                    <td className="p-2">
                      <select className="p-2 border border-gray-300 rounded-md w-20" 
                        name="metal" 
                        value={info.metalType}
                        onChange={(e) => handleInputChange(index, "metalType", e.target.value)}>
                        <option value="">Select Metal Type</option>
                        <option value="yellow-gold">Yellow Gold</option>
                        <option value="rose-gold">Rose Gold</option>
                        <option value="platinum">Platinum</option>
                      </select>
                    </td>
                    <td className="p-2">
                      <input
                        type="text"
                        placeholder="color"
                        className="border border-gray-300 rounded-md p-1 w-20"
                        value={info.color}
                        onChange={(e) => handleInputChange(index, "color", e.target.value)}
                      />
                    </td>
                    <td align="left" className="p-2 w-10">
                      <label htmlFor={`file-upload-${index}`} className="cursor-pointer">
                        <FaCloudUploadAlt className="text-3xl text-gray-400" />
                      </label>
                      <input
                        id={`file-upload-${index}`}
                        className="hidden"
                        type="file"
                        ref={el => fileInputRefs.current[index] = el}
                        multiple
                        accept=".png,.jpg,.jpeg,.webp"
                        onChange={(e) => handleImageUpload(index, e.target.files)}
                      />
                    </td>
                    <td className="p-2 flex items-center justify-between">
                      <div className="p-2 grid grid-cols-2 min-w-48">
                        {/* Display Upload Progress */}
                        {Object.entries(uploadProgress)
                          .filter(([key]) => key.startsWith(`${index}-`))
                          .map(([fileName, progress]) => (
                            <div key={fileName} className="mt-2">
                              <div className="text-sm text-gray-600">{fileName.split('-')[1]}</div>
                              <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
                                <div 
                                  className="bg-blue-600 h-2.5 rounded-full" 
                                  style={{width: `${progress}%`}}
                                ></div>
                              </div>
                            </div>
                          ))}
                        {/* Display Uploaded Files */}
                        {info.images.map((image, imageIndex) => (
                          <div key={imageIndex} className="relative p-1">
                            <img src={image} alt={`Product ${imageIndex + 1}`} className="w-24 h-24 object-cover rounded-md shadow-md" />
                            <button
                              type="button"
                              onClick={() => handleDeleteImage(index, imageIndex)}
                              className="absolute top-0 right-0 bg-red-500 text-white px-1 rounded-full"
                            >
                              X
                            </button>
                          </div>
                        ))}
                      </div>
                      <button
                        size="icon"
                        onClick={() => handleDeleteRow(index)}
                        disabled={purchaseInfo.length === 1}
                        className="flex items-center justify-center border border-gray-300 rounded-md p-1 h-6 w-6"
                      >
                        <FaRegTrashAlt className="h-4 w-4 text-gray-500"/>
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <button onClick={handleAddRow} className="mt-2 p-2 flex items-center text-gray-500 border border-gray-300 rounded-md">
            <FaPlus className="h-4 w-4 mr-2"/>
            Add Row
          </button>
        </section>
      </div>
      <section className="actAddPrd w-[300px] h-fit shadow-md border border-orange-200 rounded-lg">
        <div className="p-6">
          <div className="space-y-4">
            <button className="pre w-full rounded-lg py-1 text-sky-500">Preview</button>
            <button className="w-full save rounded-lg py-1 text-purple-600">
              Save as draft
            </button>
            <button onClick={handleSubmit} className="pub w-full rounded-lg py-1 text-green-600">Publish</button>
          </div>
        </div>
      </section>
    </div>
  );
};
export default AddProduct;