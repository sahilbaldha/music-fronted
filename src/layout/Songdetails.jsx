import { FaPlay } from "react-icons/fa";
import { Context } from "../store/FlowContext";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useParams } from "react-router-dom";
import { decryptData } from "../store/Secure";
import { FaPause } from "react-icons/fa6";
import { LikeButton } from "../Props/likesongs";
import { Songplaylist } from "../Props/songplaylist";
import { Start } from "../pages/Start";
export const SongDetails = () => {
        const API_URL = import.meta.env.VITE_API_URL;
    const { showHeader, updateCurrentSong, setSongList, togglePlay, isPlaying, likedSongs, fottersong, fottersongdetails } = useContext(Context)
    const { albumid } = useParams();
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true);
    const [albumdetails, setalbumdetails] = useState({})
    const [allsong, setallsong] = useState([])
    const [totalTime, setTotalTime] = useState("");
    const [unique, setunique] = useState(null)
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
    }, [allsong]);



    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/alllistalbum`, {
                    headers: { 'x-api-key': import.meta.env.VITE_API_KEY },
                    params: { id: albumid },
                });

                const decrypted = await decryptData(res.data.encryptedData);
                setalbumdetails(decrypted[0] || {});

            }
            catch (err) {
                console.error("Category fetch failed", err);
                setalbumdetails({});
            }
        };

        fetchData();
    }, [albumid]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.post(
                    `${API_URL}/api/songByAlbum`,
                    {
                        albumName: albumdetails.albumname,
                        page,
                        limit: 10   // 👈 send limit
                    },
                    { headers: { 'x-api-key': import.meta.env.VITE_API_KEY } }
                );

                const decrypted = await decryptData(res.data.encryptData);

                setallsong((prev) =>
                    page === 1 ? (decrypted || []) : [...prev, ...(decrypted || [])]
                );

                // Stop loading more if fewer than limit results
                if (!decrypted || decrypted.length < 5) {
                    setHasMore(false);
                } else {
                    setHasMore(true);
                }
            } catch (err) {
                console.error("Album fetch failed", err);
                setallsong([]);
            }
        };

        if (albumdetails?.albumname) {
            fetchData();
        }
    }, [albumdetails, page]);


    const handleSongClick = (index) => {
        updateCurrentSong(index); // sets fottersong
        setunique(albumid);
    };

    useEffect(() => {
        setSongList(allsong);
    }, [allsong])


    const handlePlayClick = () => {
        // If another playlist is playing, reset
        if (unique !== albumdetails._id) {
            setunique(albumdetails._id);
            setSongList(allsong);      // Load all songs of this playlist
            fottersongdetails(allsong[0]); // Start from the first song
            updateCurrentSong(0);      // Play first song
            if (!isPlaying) togglePlay(); // Start playing
            return;
        }

        // If the same playlist is already active → just toggle play/pause
        togglePlay();
    };

if (!albumdetails || Object.keys(albumdetails).length === 0) {
    return <Start/>;
}

    return (
        <>
            {
                albumdetails && (
                    <>

                        <div
                            className={`sticky top-0 w-full z-50 transition-all duration-300 ${showHeader ? "flex" : "hidden" // This line is the fix
                                }`}
                        >
                            <div style={{ backgroundColor: albumdetails.bgcolor }} className="w-full px-4 py-3 shadow-md  flex gap-[15px] items-center">
                                <h2 className="text-white text-lg font-semibold">
                                    {albumdetails.albumname}
                                </h2>
                                <h2 className="text-white text-lg font-semibold">
                                    •{allsong.length} song
                                </h2>
                                <h2 className="text-white text-lg font-semibold">
                                    •{
                                        totalTime
                                    }
                                </h2>
                            </div>
                        </div>

                        <div
                            className="w-full flex gap-[10px] md:gap-[20px] px-[5px] md:px-[15px] py-[35px] justify-start"
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
                        <div className="bg-[#121212] text-white w-full h-fit p-2 font-sans">

                            <div className="flex items-center gap-4 mb-6">
                                <button onClick={() => handlePlayClick()} className="bg-green-500 hover:scale-105 transition-all duration-200 p-4 rounded-full">
                                    {
                                        unique === albumdetails._id && isPlaying ? <FaPause className="text-black text-lg" /> : <FaPlay className="text-black text-lg" />

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

                                    <div key={ele._id} onClick={() => handleSongClick(index)} className="group relative grid grid-cols-12 items-center text-white p-3 hover:bg-[#1a1a1a] rounded-md transition-all duration-200 cursor-pointer">
                                        <div className="col-span-1 text-sm">
                                            {
                                                fottersong._id === ele._id && isPlaying
                                                    ? <span className="loading"><span></span><span></span><span></span><span></span></span> // loader or icon
                                                    : index + 1
                                            }
                                        </div>
                                        <div className="col-span-9">
                                            <div className="font-bold  xs:text-[12px] lg:text-[14px]">{ele.song_title}</div>
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
                                        <div className=" cursor-pointer text-2xl absolute top-[20px] right-[100px] lg:right-[150px] hidden max-md:group-hover:hidden group-hover:flex">
                                            <Songplaylist songId={ele._id} />
                                        </div>
                                        <div className="col-span-2 text-[11px] md:text-[12px] lg:text-[14px] text-right text-gray-300">{ele.duration}</div>
                                    </div>

                                ))
                            }

                            {hasMore && (
                                <div className="flex justify-start mt-4">
                                    <button
                                        onClick={() => setPage((prev) => prev + 1)}
                                        className=" text-white text-[17px]"
                                    >
                                        More Results
                                    </button>
                                </div>
                            )}

                        </div>

                    </>

                )
            }
        </>
    )
}
