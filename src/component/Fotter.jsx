import { motion } from "framer-motion";
import { useContext, useEffect, useRef, useState } from "react"
import { Context } from "../store/FlowContext"
import { NavLink } from "react-router-dom";
import { FaPlay, FaStepForward, FaStepBackward, FaVolumeUp } from "react-icons/fa";
import { PiPlaylistFill } from "react-icons/pi";
import { FaPause } from "react-icons/fa6";
import { IoMdClose } from "react-icons/io";
import { useNavigate } from "react-router-dom";
import { LikeButton } from "../Props/likesongs";



export const Fotter = () => {
    const { likedSongs, currentTime, duration, handleNext, handlePrev, handleSeek, formatTime, audioRef, isLoggedIn, fottersong, setIsPlaying, togglePlay, isPlaying } = useContext(Context)
    // const [isPlaying, setIsPlaying] = useState(false);
    const [volume, setVolume] = useState(1);
    const [showBox, setShowBox] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        if (fottersong?.song_title) {
            if (fottersong?.movies_name && fottersong.movies_name.trim() !== "") {
                document.title = `${fottersong.song_title} (From ${fottersong.movies_name})`;
            } else {
                document.title = fottersong.song_title;
            }
        } else {
            document.title = "Dholida-Web Player: Music for every";
        }
    }, [fottersong]);


    useEffect(() => {
        if (audioRef.current && fottersong.song_file) {
            setIsPlaying(true); // Optional: Set to playing by default
            audioRef.current.load(); // Reload audio with new src

            // Optional autoplay:
            const playAudio = async () => {
                try {
                    await audioRef.current.play();
                } catch (error) {
                    console.warn("Autoplay failed:", error);
                    setIsPlaying(false);
                }
            };

            playAudio();
        }
    }, [fottersong.song_file]);


    const handleVolumeChange = (e) => {
        const newVolume = parseFloat(e.target.value);
        setVolume(newVolume);
        if (audioRef.current) {
            audioRef.current.volume = newVolume;
        }
    };



    return (
        <>
            {
                isLoggedIn ? (
                    <>
                        <div className="relative">
                            <div className=" bg-[black] fixed max-md:bottom-[15px] z-[60] bottom-0  text-white w-full max-md:h-[60px] h-[68px] px-2 lg:px-4 py-2 flex items-center gap-4" style={{ backgroundColor: fottersong.bgcolor }}>

                                <div className="flex items-center pl-[5px] gap-3">
                                    <img onClick={() => navigate("/songdetails")}
                                        src={fottersong.song_image || "./assets/dholida.png"}
                                        alt="cover"
                                        className=" w-[40px] h-[40px] lg:w-[48px] lg:h-[48px] rounded-sm"
                                    />
                                    <div className="flex flex-col">
                                        <p className="text-[12px] lg:text-sm bold">{fottersong.song_title || "Dholida"}</p>
                                        <p className="text-[10px]  max-md:w-[230px] w-[250px] truncate lg:text-xs bold">{fottersong.singer || "web player music for everyone"}</p>
                                    </div>
                                </div>

                                <div className="flex flex-col flex-1 items-center justify-center">
                                    <div className="flex items-center gap-4 text-xl">
                                        <FaStepBackward onClick={handlePrev} className=" cursor-pointer hover:scale-110 transition max-md:hidden" />
                                        <button onClick={togglePlay} className="bg-white text-black p-2 rounded-full hover:scale-105 transition">
                                            {
                                                isPlaying ? <FaPause /> : <FaPlay />

                                            }

                                        </button>
                                        <FaStepForward onClick={handleNext} className="cursor-pointer hover:scale-110 transition  max-md:hidden" />
                                        <LikeButton
                                            songId={fottersong._id}
                                            initiallyLiked={likedSongs.includes(fottersong._id)}
                                        />
                                    </div>
                                    <div className="flex items-center gap-2 text-xs  mt-1 max-md:hidden">
                                        <span>{formatTime(currentTime)} </span>
                                        <input
                                            type="range"
                                            min="0"
                                            max={duration}
                                            value={currentTime}
                                            onChange={handleSeek}
                                            style={{
                                                "--val": `${(currentTime / duration) * 100}%`,
                                            }}

                                            className="spotify-slider w-[150px] sm:w-[150px] lg:w-[350px]"
                                        />
                                        <span>{formatTime(duration)}</span>

                                    </div>
                                </div>
                                <div className=" items-center gap-3 text-lg sm:flex hidden">
                                    <PiPlaylistFill onClick={() => setShowBox(prev => !prev)} className={` cursor-pointer ${showBox ? "text-[#4ae54a]" : "text-[white]"}`} />
                                    <FaVolumeUp className="cursor-pointer" />
                                    <input
                                        type="range"
                                        min="0"
                                        max="1"
                                        step="0.01"
                                        value={volume}
                                        onChange={handleVolumeChange}
                                        style={{
                                            "--val": `${volume * 100}%`,

                                        }}
                                        className="spotify-slider  sm:w-[70px] lg:w-[150px]"
                                    />

                                </div>
                            </div>

                            {fottersong && (
                                <motion.div drag whileDrag={{ scale: 0.9 }} dragConstraints={{ left: 0, top: 0, bottom: window.innerHeight - 380, right: window.innerWidth - 420 }} className={`fixed inset-0 z-[50] overflow-y-auto  ${showBox ? "flex" : "hidden"}`} >
                                    <div
                                        className="flex flex-col gap-[10px] items-center rounded-[5px] p-[15px] h-fit  relative"
                                        style={{ backgroundColor: fottersong.bgcolor || "#1db954" }}
                                    >
                                        <img
                                            src={fottersong.song_image || "./assets/dholida.png"}
                                            alt="cover"
                                            className="w-[100px] h-[100px] rounded"
                                        />
                                        <IoMdClose onClick={() => setShowBox(prev => !prev)} className=" absolute right-[5px] top-[5px] text-[20px] text-white cursor-pointer" />

                                        <div className="text-white font-semibold text-sm">
                                            {fottersong.song_title || "Dholida"} {`(Form${fottersong.movies_name})`}
                                        </div>
                                        <div className="text-gray-300 w-[200px] text-center text-xs">
                                            {fottersong.actors || "web player music for everyone"}
                                        </div>
                                        <div className="flex flex-col  items-center justify-center">
                                            <div className="flex items-center gap-5 text-xl">
                                                <LikeButton
                                                    songId={fottersong._id}
                                                    initiallyLiked={likedSongs.includes(fottersong._id)}
                                                />
                                                <FaStepBackward onClick={handlePrev} className="cursor-pointer hover:scale-110 transition" />
                                                <button onClick={togglePlay} className="bg-white text-black p-2 rounded-full hover:scale-105 transition">
                                                    {
                                                        isPlaying ? <FaPause /> : <FaPlay />

                                                    }

                                                </button>
                                                <FaStepForward onClick={handleNext} className="cursor-pointer hover:scale-110 transition" />

                                            </div>
                                            <div className="flex items-center gap-2 text-xs  mt-1 ">
                                                <span>{formatTime(currentTime)} </span>
                                                <input
                                                    type="range"
                                                    min="0"
                                                    max={duration}
                                                    value={currentTime}
                                                    onChange={handleSeek}
                                                    style={{
                                                        "--val": `${(currentTime / duration) * 100}%`,
                                                        width: "200px"
                                                    }}

                                                    className="spotify-slider"
                                                />
                                                <span>{formatTime(duration)}</span>

                                            </div>
                                        </div>


                                    </div>

                                </motion.div>

                            )}
                        </div>

                    </>
                ) : (<>
                    <div className="bg-black z-[60] fixed bottom-0 w-full h-[68px] px-[10px] pb-[10px]">
                        <div className="flex justify-between p-[5px] font-tiktok bg-gradient text-white ">
                            <div className="flex flex-col">
                                <div className="max-sm:text-[11px]">Preview of Dholida</div>
                                <div className="max-sm:text-[9px]">Sign up to get gujarati song and. No cradit card needed.</div>
                            </div>
                            <motion.button whileHover={{ scale: 1.03, backgroundColor: "#F0F0F0" }} whileTap={{ scale: 0.95 }} className="w-fit text-black bg-white  px-[17px] sm:px-[35px]  rounded-[25px] max-sm:text-[11px] font-bold"><NavLink to="/signup">Sign up free</NavLink></motion.button>
                        </div>

                    </div>
                </>)
            }

        </>
    )
}
