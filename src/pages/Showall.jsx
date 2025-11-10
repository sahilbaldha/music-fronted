import axios from "axios";
import { useContext, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { decryptData } from "../store/Secure";
import { FaPlay } from "react-icons/fa";
import { motion } from "motion/react"
import { NavLink } from "react-router-dom";
import { Context } from "../store/FlowContext";

export const Showall = () => {
        const API_URL = import.meta.env.VITE_API_URL;
    const { catagory_name } = useParams();
    const [albumdetails, setAlbumDetails] = useState([]);
    const { Setsongpopup, setsongdetails } = useContext(Context)
    const navigate = useNavigate();
    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/alllistalbum`, {
                    headers: { 'x-api-key': import.meta.env.VITE_API_KEY },
                    params: { catagory_name: catagory_name },
                });

                const decrypted = await decryptData(res.data.encryptedData);
                setAlbumDetails(decrypted || []);
            } catch (err) {
                console.error("Category fetch failed", err);
                setAlbumDetails([]);
            }
        };

        if (catagory_name) {
            fetchData();
        }
    }, [catagory_name]);


    return (
        <>
            <div className="flex justify-between items-center px-[25px] pt-[15px] pb-[15px]">
                <div className="hover:underline  text-[16px] md:text-[20px] lg:text-[25px] ">{catagory_name}</div>
                <div className="hover:underline  text-gray-300 text-[14px] lg:text-[17px]  hover:cursor-pointer"> <div onClick={() => navigate(-1)} >Show less</div></div>
            </div>
            <div className="grid xs:grid-cols-3 lg:grid-cols-4 gap-4 xl:grid-cols-5">

                {albumdetails.map((text, index) => (
                    <div key={index} >
                        <NavLink to={`/${text._id}`} >
                            <div className='flex flex-col gap-[5px] text-white font-bold hover:bg-gradient-to-b from-[#1B1B1B] via-[#121212] to-[#1F1F1F] p-[7px] rounded-[10px] relative group'>
                                <div className='w-[100%] '>
                                    <img className='w-full  xs:h-[100px] sm:h-[120px] md:h-[150px] lg:h-[180px]  object-cover rounded-[10px]' src={text.albumimage} /></div>
                                <div className=" text-[11px] md:text-[12px] lg:text-[14px]">{text.albumname}</div>
                                <div className=" text-[9px] md:text-[10px] lg:text-[12px] text-gray-200 max-md:truncate">{text.description}</div>

                                <motion.div onClick={(e) => {
                                    e.preventDefault();
                                    e.stopPropagation();
                                    setsongdetails(text);
                                    Setsongpopup(true);
                                }}
                                    className="p-[15px] rounded-[50%] bg-[#3AE075] w-fit h-fit absolute top-[110px] right-[15px] flex justify-center items-center opacity-0 translate-y-[20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out"
                                >
                                    <FaPlay className="text-[20px] text-black" />
                                </motion.div>
                            </div>
                        </NavLink>
                    </div>
                ))}
            </div>
        </>
    )
};
