import { FaPlay } from "react-icons/fa";
import { FiPlus, FiMoreHorizontal } from "react-icons/fi";
import { Context } from "../store/FlowContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { FaPause } from "react-icons/fa6";
import { decryptData } from "../store/Secure";
import { useParams } from "react-router-dom";

import { IoIosRemoveCircleOutline } from "react-icons/io";
export const Playlist = () => {

    const { updateCurrentSong, setSongList, togglePlay, isPlaying, fottersong, fottersongdetails } = useContext(Context)
    const [allsong, setAllsong] = useState([])
    const [playlist, setPlaylist] = useState("");
    const { playlistId } = useParams();
    const [totalTime, setTotalTime] = useState("");
    const [unique, setunique] = useState(null)
    const parseDuration = (timeStr) => {
        const [min, sec] = timeStr.split(":").map(Number);
        return min * 60 + (sec || 0);
    };
 const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const totalSeconds = allsong.reduce((sum, ele) => {
            if (!ele.duration) return sum;
            return sum + parseDuration(ele.duration);
        }, 0);

        const totalHours = Math.floor(totalSeconds / 3600);
        const totalMinutes = Math.floor((totalSeconds % 3600) / 60);

        setTotalTime(`${totalHours}h ${totalMinutes}m`);
    }, [allsong]);

    const fetchPlaylist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/playlist/${playlistId}`, {
                    withCredentials: true,
                });
            const decrypted = await decryptData(res.data.encryptedData);
            setPlaylist(decrypted);
            setAllsong(decrypted.songs)
        } catch (err) {
            setError("Failed to fetch playlist");
            console.error(err);
        }
    };

    useEffect(() => {
        fetchPlaylist();
    }, [playlistId]);

    const handleSongClick = (index) => {
        setunique(playlistId);
        updateCurrentSong(index); // sets fottersong
    };

    const handlePlayClick = () => {
        // If another playlist is playing, reset
        if (unique !== playlist._id) {
            setunique(playlist._id);
            setSongList(allsong);      // Load all songs of this playlist
            fottersongdetails(allsong[0]); // Start from the first song
            updateCurrentSong(0);      // Play first song
            if (!isPlaying) togglePlay(); // Start playing
            return;
        }

        // If the same playlist is already active → just toggle play/pause
        togglePlay();
    };

    const removeSong = async (songId) => {
        try {
            const res = await axios.post(`${API_URL}/api/removeSongFromPlaylist`, {
                playlistId,
                songId,
            }, { withCredentials: true } );

            fetchPlaylist()

        } catch (err) {
            console.error("Error removing song:", err);
        }
    };


    useEffect(() => {
        setSongList(allsong);

    }, [allsong])


    return (
        <>
            {
                playlist && (
                    <>
                        <div
                            className="w-full flex gap-[20px] px-[15px] py-[35px] justify-start"
                            style={{ backgroundColor: allsong?.[0]?.bgcolor || "#463387" }}

                        >

                            <div>
                                <img className="w-[150px] h-[150px] lg:w-[220px] lg:h-[220px] rounded-[5px] " src="/assets/playlist.jpeg" />
                            </div>
                            <div className="flex flex-col justify-end ">
                                <div className="text-[20px]">
                                    {allsong.length > 1 ? "Playlist" : "Single"}
                                </div>
                                <div className="md:text-[28px] text-[22px] lg:text-[48px] capitalize ">{playlist.name}</div>
                                <div className="flex gap-[6px] items-center">
                                    <div className="text-[14px] sm:text-[20px]">•Dholida</div>
                                    <div className="text-gray-300 sm:text-[16px] text-[10px]">•{totalTime}</div>
                                    <div className="text-gray-300 sm:text-[16px] text-[10px]">•{allsong.length} song</div>
                                </div>
                            </div>
                        </div>
                        <div className="bg-[#121212] text-white w-full h-fit p-2 font-sans">

                            <div className="flex items-center gap-4 mb-6">
                                <button
                                    onClick={handlePlayClick}
                                    className="bg-green-500 hover:scale-105 transition-all duration-200 p-4 rounded-full"
                                >
                                    {unique === playlist._id && isPlaying ? (
                                        <FaPause className="text-black text-lg" />
                                    ) : (
                                        <FaPlay className="text-black text-lg" />
                                    )}
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

                                    <div onClick={() => handleSongClick(index)} key={ele._id} className="group relative grid grid-cols-12 items-center text-white p-3 hover:bg-[#1a1a1a] rounded-md transition-all duration-200 cursor-pointer">
                                        <div className="col-span-1 text-sm">
                                            {
                                                fottersong?._id === ele._id && isPlaying
                                                    ? <span className="loading"><span></span><span></span><span></span><span></span></span> // loader or icon
                                                    : index + 1
                                            }
                                        </div>
                                        <IoIosRemoveCircleOutline

                                            onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                removeSong(ele._id);
                                            }}
                                            className="absolute right-[70px] md:right-[100px] top-[20px] text-[20px]   flex  md:hidden  md:group-hover:flex"
                                        />

                                        <div className="col-span-9">
                                            <div className="font-bold  xs:text-[12px] lg:text-[14px]">{ele.song_title}</div>
                                            <div className="xs:text-[11px] lg:text-[14px] text-gray-400">
                                                {ele.actors}
                                            </div>
                                        </div>
                                        <div className="col-span-2 text-[11px] md:text-[12px] lg:text-[14px] text-right text-gray-300">{ele.duration}</div>
                                    </div>

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
