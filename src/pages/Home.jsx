import { IoMdAdd } from "react-icons/io";
import { motion } from "motion/react"
import { useContext, useEffect, useState } from "react";
import { Context } from "../store/FlowContext";
import { NavLink } from "react-router-dom";
import { toast } from "react-toastify";
import { IoChevronBackOutline } from "react-icons/io5";
import axios from "axios";
import { decryptData } from "../store/Secure";
import { MdDelete } from "react-icons/md";
import { RiAdminLine } from "react-icons/ri";

export const Home = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { sidebar, setsidebar, setShowsignup, isLoggedIn } = useContext(Context)
    const [playlist, setPlaylist] = useState(false)
    const [newPlaylistName, setNewPlaylistName] = useState("");
    const [playlists, setPlaylists] = useState([]);
    const createPlaylist = async () => {

        try {
            const res = await axios.post(`${API_URL}/api/createPlaylist`, {
                name: newPlaylistName,
            },{ withCredentials: true } );

            if (res.data.success) {
                toast.success(res.data.message);
                setNewPlaylistName("");
                fetchPlaylists();
            } else {
                toast.error(res.data.message);
            }
        } catch (err) {
            toast.error("Something went wrong ❌");
        }
    };
    useEffect(() => {
        if (playlist) {
            fetchPlaylists();
        }
    }, [playlist]);


    const fetchPlaylists = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/getUserPlaylists`,{ withCredentials: true } );

            // If your API returns { success, playlists: [...] }
            const decrypted = await decryptData(res.data.encryptedData);
            setPlaylists(decrypted || []);

        } catch (err) {
            console.error("Error fetching playlists", err);
            setPlaylists([]); // fallback to empty array
        }
    };



    const handleDelete = async (id) => {
        try {
            await axios.post(`${API_URL}/api/deletePlaylist`, { playlistId: id },{ withCredentials: true } ); // sending in body
            fetchPlaylists()
            toast.success("Playlist deleted!");
        } catch (err) {
            console.error(err);
            toast.error("Failed to delete playlist");
        }
    };


    return (
        <>
            {
                !isLoggedIn ? (<>

                    <div className={`${sidebar ? "xs:hidden" : "xs:flex xs:absolute xs:z-[20] xs:w-[250px] "} h-full md:flex flex-col gap-[5px]  md:basis-[35.5%] lg:basis-[27.5%] bg-[#121212] rounded-[7px] mb-[10px]`}>
                        <div className="flex justify-between  items-center px-[15px] pt-[15px]">
                            <div>Your Library</div>
                            <IoMdAdd onClick={() => setShowsignup(true)} className=" text-[30px] p-[5px] rounded-[20px] hover:bg-black" />
                        </div>
                        <div className="flex flex-col gap-[20px] font-bold max-h-[220px] py-[20px] hover:bg-black md:overflow-y-hidden  overflow-y-auto md:hover:overflow-y-auto custom_scroll">
                            <div className="flex flex-col gap-[10px] bg-[#1F1F1F] p-[10px]">
                                <div className="max-md:text-[14px]">Create your frist playlist</div>
                                <div className="text-[#F8F8F8] max-md:text-[12px] text-[14px]">it's easy,we'll help you</div>
                                <motion.button onClick={() => setShowsignup(true)} whileHover={{ scale: 1.03, backgroundColor: "#F0F0F0" }} whileTap={{ scale: 0.95 }} className=" mb-[10px] ml-[20px] w-fit  text-black bg-white  px-[15px] py-[4px] md:px-[25px] md:py-[8px] rounded-[25px] font-bold max-md:text-[14px]">Create playlist</motion.button>
                            </div>
                            <div className="flex flex-col gap-[10px] bg-[#1F1F1F] p-[10px]">
                                <div className="max-md:text-[14px]">Let's find some podcasts to follow</div>
                                <div className="text-[#F8F8F8] max-md:text-[12px] text-[14px]">we'll keep your updated new on new episodes</div>
                                <motion.button onClick={() => setShowsignup(true)} whileHover={{ scale: 1.03, backgroundColor: "#F0F0F0" }} whileTap={{ scale: 0.95 }} className=" mb-[10px] ml-[20px] w-fit text-black bg-white px-[15px] py-[4px] md:px-[25px] md:py-[8px] rounded-[25px] font-bold max-md:text-[14px]">Brwoser podcasts</motion.button>
                            </div>
                        </div>
                    </div>

                </>) : (<>

                    <div className={`flex flex-col gap-[20px] p-[10px] ${sidebar ? "xs:hidden" : "xs:flex xs:absolute xs:z-[20] xs:w-[250px] "} min-h-[calc(100vh-142px)] md:flex md:basis-[35.5%] lg:basis-[27.5%] bg-[#121212] rounded-[7px] mb-[10px] max-h-[calc(100vh-142px)]  md:overflow-y-hidden overflow-y-auto md:hover:overflow-y-auto custom_scroll`}>

                        {
                            !playlist ? (
                                <>
                                    <div className="flex items-center justify-between  rounded-md">
                                        {/* Left: Title */}
                                        <div className="text-white font-bold text-md lg:text-lg">Your Library</div>

                                        {/* Right: Create button */}
                                        <button onClick={() => setPlaylist((prev) => !prev)} className=" flex text-[13px] lg:text-[18px] items-center gap-2  bg-[#1F1F1F]   text-white font-bold  px-3 py-2 md:px-4 md:py-2 rounded-full hover:bg-[#2A2A2A]    transform transition-transform duration-300  hover:scale-105 ">
                                            <span className="text-[13px] lg:text-[18px]">＋</span>
                                            Create
                                        </button>
                                    </div>
                                    <div className="grid grid-cols-12 px-3 py-2 text-gray-400 text-sm border-b border-gray-700">
                                        <div className="col-span-3">#</div>
                                        <div className="col-span-9">Title</div>
                                    </div>
                                    <div className="grid grid-cols-12 px-3 py-2   border-gray-700">
                                        <div className="col-span-3 text-[13px] md:text-[18px]">1</div>
                                        <div className="col-span-9 cursor-pointer hover:underline text-[13px] md:text-[18px]"><NavLink to="/likesong">Like songs</NavLink></div>
                                    </div>
                                    <div className=" flex items-center gap-[4px] absolute left-[20px] bottom-[20px] text-[17px] font-bold hover:scale-[1.1] hover:underline cursor-pointer" onClick={() => window.open("https://dholida-fronted.vercel.app", "_blank")}>
                                        <RiAdminLine />
                                        <div>Admin</div>
                                    </div>
                                </>
                            ) : (
                                <>
                                    <div className="text-[16px] lg:text-xl items-center font-bold flex gap-[5px] ">
                                        <IoChevronBackOutline className="cursor-pointer" onClick={() => setPlaylist((prev) => !prev)} />
                                        <h2 className="text-[#a9a8a8]">Your Playlists</h2>
                                    </div>


                                    {/* Create playlist */}
                                    <div className="flex  gap-2 sm:gap-3 ">
                                        <input
                                            type="text"
                                            placeholder="New Playlist Name"
                                            value={newPlaylistName}
                                            onChange={(e) => setNewPlaylistName(e.target.value)}
                                            className="px-2 text-[12px] lg:text-[14px] py-2  w-[130px] sm:w-[150px] lg:w-[250px]  rounded-md bg-[black] text-white"
                                        />
                                        <button
                                            onClick={createPlaylist}
                                            className="bg-green-500 md:px-4 px-2 text-[11px] lg:text-[12px] rounded-md hover:bg-green-600"
                                        >
                                            Create
                                        </button>
                                    </div>
                                    <div className="grid gap-6 xs:grid-cols-2 xl:grid-cols-3 ">
                                        {playlists.map((pl) => (
                                            <NavLink to={`playlist/${pl._id}`} >
                                                <div
                                                    key={pl._id}
                                                    className=" flex flex-col items-center justify-center  p-2 lg:p-3 bg-gray-900 rounded-2xl border border-gray-700 shadow-sm hover:shadow-xl transition hover:border-green-500 cursor-pointer relative group "
                                                >
                                                    {/* Circle/Avatar */}
                                                    <div className=" w-[40px] h-[40px] lg:w-16 lg:h-16 flex items-center justify-center rounded-full bg-green-500 text-white text-xl lg:text-2xl font-bold mb-3">
                                                        {pl.name.charAt(0).toUpperCase()}
                                                    </div>

                                                    {/* Playlist details */}
                                                    <h3 className="capitalize text-base font-medium text-white text-center truncate w-full ">
                                                        {pl.name}
                                                    </h3>
                                                    <MdDelete
                                                        onClick={(e) => {
                                                            e.stopPropagation(); // prevent NavLink navigation
                                                            e.preventDefault(); // prevent page change
                                                            handleDelete(pl._id);
                                                        }}
                                                        className=" p-[10px] text-black rounded-[50%] bg-[#3AE075] w-fit h-fit absolute top-[50px] sm:top-[75px] right-[14px] flex justify-center items-center opacity-0 translate-y-[20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out" />

                                                </div>
                                            </NavLink>
                                        ))}
                                    </div>

                                </>
                            )
                        }
                    </div>
                </>)

            }
        </>
    )
}