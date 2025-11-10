import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { FaPlay } from "react-icons/fa";
import { motion } from "motion/react"
import { NavLink } from "react-router-dom";
import { decryptData } from "../store/Secure";
import { Context } from "../store/FlowContext";
import { LikeButton } from "../Props/likesongs";
import { Swiper, SwiperSlide } from 'swiper/react';
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Mousewheel, FreeMode } from 'swiper/modules';
import { Songplaylist } from "../Props/songplaylist";
export const Searchsong = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { inputValue, setSongList, updateCurrentSong, fottersong, setsongdetails, Setsongpopup, likedSongs } = useContext(Context)
    const [results, setResults] = useState([]);
    const [page, setPage] = useState(1)
    const [hasMore, setHasMore] = useState(true);
    const categories = ["All", "Songs", "Albums", "Artists"];
    const [active, setActive] = useState("All");
    const [albumResults, setAlbumResults] = useState([]);

    useEffect(() => {
        setPage(1);
    }, [active]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const trimmedSearch = inputValue.trim();

            if (trimmedSearch.length >= 3) {
                axios
                    .get(`${API_URL}/api/listalbum`, {
                        params: {
                            search: trimmedSearch,
                        },
                        headers: {
                            'x-api-key': import.meta.env.VITE_API_KEY
                        },
                    })
                    .then((res) => {
                        const decrypted = decryptData(res.data.encryptedData);
                        setAlbumResults(decrypted || []);
                    })
                    .catch((err) => {
                        console.error("Search failed:", err);
                        setAlbumResults([]);
                    });
            } else {
                setAlbumResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce);
    }, [inputValue]);

    useEffect(() => {
        const delayDebounce = setTimeout(() => {
            const trimmedSearch = inputValue.trim();

            if (trimmedSearch.length >= 3) {
                let apiUrl = "";
                let params = {};

                switch (active) {
                    case "All":
                        apiUrl = `${API_URL}/api/list`; // Unified search (all types)
                        params = { search: trimmedSearch, page };
                        break;

                    case "Songs":
                        apiUrl = `${API_URL}/api/list`; // Songs API
                        params = { search: trimmedSearch, page }; // ✅ FIXED
                        break;

                    case "Albums":
                        apiUrl = `${API_URL}/api/listalbum`; // Albums API
                        params = { search: trimmedSearch }; // ✅ FIXED
                        break;

                    case "Artists":
                        apiUrl = `${API_URL}/api/listalbum`; // Artists API
                        params = { search: trimmedSearch, isArtist: true }; // ✅ FIXED
                        break;

                    default:
                        return;
                }

                axios
                    .get(apiUrl, {
                        params,
                        headers: { "x-api-key": import.meta.env.VITE_API_KEY },
                    })
                    .then((res) => {
                        const decrypted = decryptData(res.data.encryptedData);

                        setResults((prev) =>
                            page === 1 ? (decrypted || []) : [...prev, ...(decrypted || [])] // ✅ append instead of overwrite
                        );

                        if (!decrypted || decrypted.length < 5) {
                            setHasMore(false);
                        } else {
                            setHasMore(true);
                        }
                    })
                    .catch((err) => {
                        console.error("Search failed:", err);
                        setResults([]);
                    });
            } else {
                setResults([]);
            }
        }, 500);

        return () => clearTimeout(delayDebounce)
    }, [inputValue, active, page])


    const handleSongClick = (index) => {

        updateCurrentSong(index); // sets fottersong

    };
    useEffect(() => {

        setSongList(results)

    }, [results])

    useEffect(() => {
        const swiperList = document.querySelectorAll(".swiper");

        swiperList.forEach((swiper) => {
            const prevButton = swiper.querySelector(".swiper-button-prev");
            const nextButton = swiper.querySelector(".swiper-button-next");

            prevButton.style.display = "none";
            nextButton.style.display = "none";

            const showButtons = () => {
                prevButton.style.display = "block";
                nextButton.style.display = "block";
            };

            const hideButtons = () => {
                prevButton.style.display = "none";
                nextButton.style.display = "none";
            };

            const handleNextClick = () => {
                prevButton.style.display = "block";
            };

            swiper.addEventListener("mouseenter", showButtons);
            swiper.addEventListener("mouseleave", hideButtons);
            nextButton.addEventListener("click", handleNextClick);

            // Cleanup
            return () => {
                swiper.removeEventListener("mouseenter", showButtons);
                swiper.removeEventListener("mouseleave", hideButtons);
                nextButton.removeEventListener("click", handleNextClick);
            };
        });

    }, []);



    return (


        <>
            <div className="flex gap-2 bg-[#121212] p-4">

                {categories.map((category) => (
                    <button
                        key={category}
                        onClick={() => setActive(category)}
                        className={`px-4 py-1 rounded-full text-sm font-medium transition-all
            ${active === category
                                ? "bg-white text-black"
                                : "bg-[#2a2a2a] text-white hover:bg-[#3a3a3a]"
                            }`}
                    >
                        {category}
                    </button>
                ))}
            </div>


            {results.length > 0 ? (
                <>
                    {active === "Albums" && (

                        <div className="p-2 grid grid-cols-2 xs:grid-cols-3 sm:grid-cols-4 lg:grid-cols-5  gap-4">
                            {results.map((album, index) => (
                                <NavLink to={`/${album._id}`} >
                                    <div
                                        key={index}
                                        className="bg-[#121212] p-3 rounded-lg hover:bg-[#1a1a1a] transition duration-300 group"
                                    >
                                        <div className="relative">
                                            <img
                                                src={album.albumimage}
                                                className="w-full xs:h-[105px] sm:h-[125px]  md:h-[100px] lg:h-[150px] object-cover rounded-md"
                                            />
                                            {/* Play Button on Hover */}
                                            <motion.div onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setsongdetails(album);
                                                Setsongpopup(true);
                                            }}
                                                className="p-[11px] lg:p-[15px]  rounded-[50%] bg-[#3AE075] w-fit h-fit absolute top-[70px] md:top-[100px] lg:top-[110px] right-[15px] flex justify-center items-center opacity-0 translate-y-[20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out"
                                            >
                                                <FaPlay className="text-[12px] md:text-[16px] lg:text-[20px] text-black" />
                                            </motion.div>
                                        </div>
                                        {/* Album Info */}
                                        <div className="mt-4">
                                            <div className="text-white font-semibold text-sm max-md:text-[12px] ">
                                                {album.albumname}
                                            </div>
                                            <div className="text-gray-400 text-xs max-md:text-[10px] mt-1 truncate">
                                                {album.description}
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    )}

                    {active === "Songs" && (
                        <>
                            <div className="grid grid-cols-12 px-2 py-2 text-gray-400 text-sm border-b border-gray-700">
                                <div className="col-span-1">#</div>
                                <div className="col-span-6 max-md:col-span-9">Title</div>
                                <div className="col-span-3 max-md:hidden">actors</div>
                                <div className="col-span-2 text-right text-[18px] pr-4">⏱</div>
                            </div>
                            <div className="flex flex-col gap-5 pt-[10px]">
                                {results.map((song, index) => (
                                    <div onClick={() => handleSongClick(index)}
                                        key={song._id}
                                        className="grid grid-cols-12 items-center px-2 py-1  hover:bg-[#1a1a1a] rounded-md transition duration-200 cursor-pointer group relative"
                                    >
                                        {/* Track Number */}
                                        <div className="col-span-1 text-[10px]">
                                            {
                                                fottersong._id === song._id
                                                    ? <span className="loading"><span></span><span></span><span></span><span></span></span> // loader or icon
                                                    : index + 1
                                            }

                                        </div>

                                        {/* Song Info */}
                                        <div className="col-span-6  max-lg:col-span-5 max-md:col-span-10 flex items-center gap-4">
                                            <img
                                                src={song.song_image}
                                                className=" w-9 h-9 md:w-12 md:h-12 object-cover rounded-md"
                                            />
                                            <div>
                                                <div className=" xs:text-[11px] lg:text-sm font-semibold text-white truncate max-w-[250px]">
                                                    {song.song_title}
                                                </div>
                                                <div className="xs:text-[10px] lg:text-xs text-gray-400 truncate max-w-[200px] sm:max-w-[140px] lg:max-w-[250px]">
                                                    {song.singer}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Album */}
                                        <div className="col-span-4 max-lg:col-span-5 max-md:hidden max-w-[200px] sm:max-w-[140px] lg:max-w-[250px] md:text-[12px] lg:text-xs text-gray-300 truncate w-full">
                                            {song.actors}
                                        </div>
                                        <div className="absolute right-[60px] lg:right-[100px] top-[20px] text-[20px] max-md:group-hover:hidden  hidden group-hover:flex">

                                            <LikeButton
                                                songId={song._id}
                                                initiallyLiked={likedSongs.includes(song._id)}
                                            />
                                        </div>
                                        <div className=" cursor-pointer text-2xl absolute top-[20px] right-[100px] lg:right-[150px] hidden max-md:group-hover:hidden group-hover:flex">
                                            <Songplaylist songId={song._id} />
                                        </div>
                                        {/* Duration */}
                                        <div className="col-span-1 text-right  text-[10px] md:text-sm pr-4 text-gray-400">
                                            {song.duration}
                                        </div>
                                    </div>
                                ))}
                                {hasMore && (
                                    <div className="flex justify-start mt-4 ml-[10px]">
                                        <button
                                            onClick={() => setPage((prev) => prev + 1)}
                                            className=" text-white text-[14px]"
                                        >
                                            More Results
                                        </button>
                                    </div>
                                )}
                            </div>
                        </>

                    )}

                    {active === "All" && (
                        <>


                            {/* Songs Frist */}
                            <div className="flex flex-col gap-5 pt-[10px]">
                                <div className="grid grid-cols-12  px-2 lg:px-6 py-1 text-gray-400 text-sm border-b border-gray-700">
                                    <div className="col-span-1">#</div>
                                    <div className="col-span-6 max-md:col-span-9">Title</div>
                                    <div className="col-span-3 max-md:hidden">actors</div>
                                    <div className="col-span-2 text-right  sm:pr-2 lg:pr-4 text-[18px]">⏱</div>
                                </div>
                                {results.map((song, index) => (
                                    <div onClick={() => handleSongClick(index)}
                                        key={song._id}
                                        className="grid grid-cols-12 px-2 lg:px-6 py-1  items-center  hover:bg-[#1a1a1a] rounded-md transition duration-200 cursor-pointer group relative"
                                    >
                                        {/* Track Number */}
                                        <div className="col-span-1 text-[11px]">

                                            {
                                                fottersong._id === song._id
                                                    ? <span className="loading"><span></span><span></span><span></span><span></span></span> // loader or icon
                                                    : index + 1
                                            }
                                        </div>

                                        {/* Song Info */}
                                        <div className="col-span-5 max-md:col-span-10 flex items-center gap-4">
                                            <img
                                                src={song.song_image}
                                                className=" w-9 h-9 md:w-12 md:h-12 object-cover rounded-md"
                                            />
                                            <div>
                                                <div className="xs:text-[11px] lg:text-sm font-semibold text-white truncate max-w-[250px]">
                                                    {song.song_title}
                                                </div>
                                                <div className=" xs:text-[10px] lg:text-xs text-gray-400 truncate max-w-[200px] sm:max-w-[140px] lg:max-w-[250px]">
                                                    {song.singer}
                                                </div>
                                            </div>
                                        </div>

                                        {/* Album */}
                                        <div className=" text-[9px] col-span-4  max-md:hidden max-w-[200px] sm:max-w-[140px] lg:max-w-[250px] md:text-[12px] lg:text-xs text-gray-300 truncate w-full">
                                            {song.actors}
                                        </div>

                                        {/* Duration */}
                                        <div className="col-span-2 max-md:col-span-1 text-right text-[11px] md:text-sm  sm:pr-2 lg:pr-4 text-gray-400">
                                            {song.duration}
                                        </div>
                                        <div className="absolute right-[60px] lg:right-[100px] top-[20px] text-[20px] max-md:group-hover:hidden  hidden group-hover:flex">

                                            <LikeButton
                                                songId={song._id}
                                                initiallyLiked={likedSongs.includes(song._id)}
                                            />
                                        </div>
                                        <div className=" cursor-pointer text-2xl absolute top-[20px] right-[100px] lg:right-[150px] hidden max-md:group-hover:hidden group-hover:flex">
                                            <Songplaylist songId={song._id} />
                                        </div>
                                    </div>


                                ))}
                                {hasMore && (
                                    <div className="flex justify-start mt-4 ml-[10px]">
                                        <button
                                            onClick={() => setPage((prev) => prev + 1)}
                                            className=" text-white text-[14px]"
                                        >
                                            More Results
                                        </button>
                                    </div>
                                )}
                            </div>
                            {/* Albums second */}
                            <div className="text-[16px] p-[20px]">Album</div>
                            <Swiper
                                spaceBetween={10}
                                navigation={true}
                                centeredSlides={false}
                                freeMode={{
                                    enabled: true,
                                    momentum: false,
                                }}
                                mousewheel={{
                                    forceToAxis: true,
                                    releaseOnEdges: true,
                                    sensitivity: 1,
                                    thresholdDelta: 1,
                                    thresholdTime: 0,
                                }}
                                breakpoints={{
                                    0: {       // mobile
                                        slidesPerView: 3.5,
                                        spaceBetween: 6,
                                        freeMode: { enabled: true, momentum: true },
                                    },
                                    640: {     // sm (≥640px)
                                        slidesPerView: 4.5,
                                        spaceBetween: 6,
                                        freeMode: { enabled: true, momentum: true },
                                    },
                                    768: {     // md (≥768px)
                                        slidesPerView: 3.5,
                                        spaceBetween: 8,
                                        freeMode: { enabled: true, momentum: true },
                                    },
                                    1024: {    // lg (≥1024px)
                                        slidesPerView: 5.5,
                                        spaceBetween: 10,
                                    },
                                }}
                                modules={[Navigation, Mousewheel, FreeMode]}
                                className="mySwiper w-full"
                            >

                                {albumResults.map((album, index) => (
                                    <SwiperSlide key={index} >
                                        <NavLink to={`/${album._id}`} >
                                            <div
                                                key={index}
                                                className="bg-[#121212] p-2 rounded-lg hover:bg-[#1a1a1a] transition duration-300 group"
                                            >
                                                <div className="relative">
                                                    <img
                                                        src={album.albumimage}
                                                        className="xs:w-[105px] sm:w-[125px]  md:w-[100px] lg:w-[150px] xs:h-[105px] sm:h-[125px]  md:h-[100px] lg:h-[150px] object-cover rounded-md"
                                                    />
                                                    {/* Play Button on Hover */}
                                                    <motion.div onClick={(e) => {
                                                        e.preventDefault();
                                                        e.stopPropagation();
                                                        setsongdetails(album);
                                                        Setsongpopup(true);
                                                    }}
                                                        className="p-[11px] lg:p-[15px]  rounded-[50%] bg-[#3AE075] w-fit h-fit absolute top-[70px] md:top-[100px] lg:top-[110px] right-[15px] flex justify-center items-center opacity-0 translate-y-[20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out"
                                                    >
                                                        <FaPlay className="text-[12px] md:text-[16px] lg:text-[20px] text-black" />
                                                    </motion.div>
                                                </div>
                                                {/* Album Info */}
                                                <div className="mt-4">
                                                    <div className="text-white font-semibold text-[12px] line-clamp-1">
                                                        {album.albumname}
                                                    </div>
                                                    <div className="text-gray-400   text-[10px] mt-1 truncate">
                                                        {album.description}
                                                    </div>
                                                </div>
                                            </div>
                                        </NavLink>
                                    </SwiperSlide>
                                ))}
                            </Swiper>
                        </>
                    )}


                    {active === "Artists" && (

                        <div className="p-3 grid grid-cols-2 xs:grid-cols-3 md:grid-cols-4 sm:grid-cols-4 lg:grid-cols-5 gap-3">
                            {results.map((album, index) => (
                                <NavLink to={`/${album._id}`} >
                                    <div
                                        key={index}
                                        className="bg-[#121212] p-3 rounded-lg hover:bg-[#1a1a1a] transition duration-300 group"
                                    >
                                        <div className="relative">
                                            <img
                                                src={album.albumimage}
                                                className="w-full xs:h-[100px] sm:h-[120px] md:h-[100px] lg:h-[180px] rounded-full object-cover shadow-lg"
                                            />
                                            {/* Play Button on Hover */}
                                            <motion.div onClick={(e) => {
                                                e.preventDefault();
                                                e.stopPropagation();
                                                setsongdetails(album);
                                                Setsongpopup(true);
                                            }}
                                                className="p-[11px] lg:p-[15px]  rounded-[50%] bg-[#3AE075] w-fit h-fit absolute top-[70px] md:top-[100px] lg:top-[110px] right-[15px] flex justify-center items-center opacity-0 translate-y-[20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out"
                                            >
                                                <FaPlay className="text-[12px] md:text-[16px] lg:text-[20px] text-black" />
                                            </motion.div>
                                        </div>
                                        {/* Album Info */}
                                        <div className="mt-4">
                                            <div className="text-white font-semibold text-sm max-md:text-[12px]">
                                                {album.albumname}
                                            </div>
                                            <div className="text-gray-400 text-xs max-md:text-[10px] mt-1 ">
                                                {album.description}
                                            </div>
                                        </div>
                                    </div>
                                </NavLink>
                            ))}
                        </div>
                    )}

                </>
            ) : (
                <p className="text-center mt-10 text-gray-400">No songs found.</p>
            )}

        </>

    );
};