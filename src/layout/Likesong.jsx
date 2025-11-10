import { FaPlay } from "react-icons/fa";
import { Context } from "../store/FlowContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaPause } from "react-icons/fa6";
import { LikeButton } from "../Props/likesongs";
import { decryptData } from "../store/Secure";
import { useLocation } from "react-router-dom";

export const LikeSong = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { updateCurrentSong, setSongList, togglePlay, isPlaying, likedSongs, setLikedSongs, fottersong, fottersongdetails } = useContext(Context)
    const [allsong, setAllsong] = useState([])
    const [albumdetails, setalbumdetails] = useState({
        bgcolor: "#463387",
        albumname: "like song",
        albumimage: "/assets/liked.jpg"

    })
    const [totalTime, setTotalTime] = useState("");
    const [firstClick, setFirstClick] = useState(true);
    const [unique, setunique] = useState("")

    const parseDuration = (timeStr) => {
        const [min, sec] = timeStr.split(":").map(Number);
        return min * 60 + (sec || 0);
    };

    useEffect(() => {
        const totalSeconds = allsong.reduce((sum, ele) => {
            if (!ele.duration) return sum;
            return sum + parseDuration(ele.duration);
        }, 0);

        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

        setTotalTime(`${totalHours}h ${totalMinutes}m`);
    }, [likedSongs]);



    const location = useLocation();

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/alllikesong`, {
                    withCredentials: true,
                });
                const decrypted = await decryptData(res.data);
                const arraylike = decrypted.map((ele) => ele._id);
                setAllsong(decrypted);
                setLikedSongs(arraylike);
            } catch (err) {
                console.error("Category fetch failed", err);
                setLikedSongs([]);
            }
        };

        fetchData();
    }, [location.pathname]);


    const handleSongClick = (index) => {
        updateCurrentSong(index); // sets fottersong
        setunique("likesong"); // track which album is currently active
    };

    const handlePlayClick = () => {
        setunique("likesong"); // ✅ always set the current album

        if (firstClick) {

            fottersongdetails(allsong[0]);
            setFirstClick(false);
        }

        togglePlay(); // ✅ always toggle play/pause
    };

    useEffect(() => {
        setSongList(allsong);

    }, [allsong])


    return (
        <>
            {
                albumdetails && (
                    <>
                        <div
                            className="w-full flex gap-[20px] px-[15px] py-[35px] justify-start"
                            style={{ backgroundColor: albumdetails.bgcolor }}
                        >

                            <div>
                                <img className="w-[150px] h-[150px] lg:w-[220px] lg:h-[220px] rounded-[5px] " src={albumdetails.albumimage} />
                            </div>
                            <div className="flex flex-col justify-end ">
                                <div className="text-[20px]">
                                    {allsong.length > 1 ? "Public Playlist" : "Single"}
                                </div>
                                <div className="md:text-[28px] text-[22px] lg:text-[48px]">{albumdetails.albumname}</div>
                                <div className="flex items-center gap-[6px]">
                                    <div className=" text-[14px] sm:text-[20px]">•Dholida</div>
                                    <div className="text-gray-300 sm:text-[16px] text-[10px]">•{totalTime}</div>
                                    <div className="text-gray-300 sm:text-[16px] text-[10px]">•{allsong.length} song</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#121212] text-white w-full h-fit px-6 py-4 font-sans">

                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => handlePlayClick()} className="bg-green-500 hover:scale-105 transition-all duration-200 p-4 rounded-full">

                                    {unique === "likesong" && isPlaying ? <FaPause className="text-black text-lg" /> : <FaPlay className="text-black text-lg" />

                                    }
                                </button>
                                <div className=" ml-auto text-sm text-gray-300 cursor-pointer hover:underline">
                                    List
                                </div>
                            </div>

                            {/* Table header */}
                            <div className="grid grid-cols-12 text-gray-400 border-b border-gray-700 pb-2 text-sm">
                                <div className="col-span-1">#</div>
                                <div className="col-span-9">Title</div>
                                <div className="col-span-2 flex justify-end">
                                    <span className="text-base">🕒</span>
                                </div>
                            </div>

                            {

                                allsong.map((ele, index) => (
                                    <>
                                        <div onClick={() => handleSongClick(index)} key={ele._id} className="group relative grid grid-cols-12 items-center text-white py-3 hover:bg-[#1a1a1a] rounded-md transition-all duration-200 cursor-pointer">
                                            <div className="col-span-1 text-sm">
                                                {
                                                    fottersong._id === ele._id && isPlaying
                                                        ? <span className="loading"><span></span><span></span><span></span><span></span></span> // loader or icon
                                                        : index + 1
                                                }
                                            </div>
                                            <div className="col-span-9">
                                                <div className="font-bold xs:text-[12px] lg:text-[14px]">{ele.song_title}</div>
                                                <div className="xs:text-[11px] lg:text-[14px] text-gray-400">
                                                    {ele.actors}
                                                </div>
                                            </div>
                                            <div className="absolute right-[60px] lg:right-[100px] top-[20px] text-[20px] max-md:group-hover:hidden  hidden group-hover:flex">

                                                <LikeButton
                                                    songId={ele._id}
                                                    initiallyLiked={likedSongs.includes(ele._id)}
                                                />
                                            </div>
                                            <div className="col-span-2  text-[14px] max-md:text-[11px] text-right text-gray-300">{ele.duration}</div>
                                        </div>
                                    </>
                                ))
                            }
                            {/* Song row */}

                        </div>
                    </>
                )
            }
        </>
    )
}
