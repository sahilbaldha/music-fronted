import { useContext, useEffect, useState } from "react"
import { Context } from "../store/FlowContext"
import { FaPlay, FaStepForward, FaStepBackward } from "react-icons/fa";
import { FaPause } from "react-icons/fa6";
import { IoChevronBackOutline } from "react-icons/io5";
import { useNavigate } from "react-router-dom";
import { LikeButton } from "../Props/likesongs";
import { Songplaylist } from "../Props/songplaylist";

export const Sidebar = () => {

  const navigate = useNavigate();
  const { currentTime, duration, handleNext, handlePrev, handleSeek, formatTime, isLoggedIn, fottersong, likedSongs, togglePlay, isPlaying } = useContext(Context)



  return (
    <>

      {
        isLoggedIn && (
          <>
            <div className="relative flex flex-col h-full text-white font-bold gap-[15px] p-[20px] items-center justify-center">
              <IoChevronBackOutline className="absolute top-[10px] left-[10px] text-white text-[25px] cursor-pointer" onClick={() => navigate(-1)} />
              <div className="absolute top-[10px] right-[10px] text-[25px]">
                <Songplaylist songId={fottersong._id} />
              </div>

              <img src={fottersong.song_image || "./assets/dholida.png"} alt="" className="w-[250px] h-[250px] object-cover rounded-md" />
              <div className="text-[13px]">{`${fottersong.song_title} (From ${fottersong.movies_name})`}</div>
              <div className="text-[11px] text-[#e1dede]">{fottersong.singer || "web player music for everyone"}</div>

              <div className="flex items-center gap-5 text-xl">
                <FaStepBackward onClick={handlePrev} className=" cursor-pointer hover:scale-110 transition" />
                <button onClick={togglePlay} className="bg-white text-black p-2 rounded-full hover:scale-105 transition">
                  {
                    isPlaying ? <FaPause /> : <FaPlay />

                  }

                </button>
                <FaStepForward onClick={handleNext} className="cursor-pointer hover:scale-110 transition" />

              </div>
              <div className="flex items-center gap-2 text-xs text-gray-300 mt-1">
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

                  className="spotify-slider xs:w-[190px] lg:w-[350px]"
                />
                <span>{formatTime(duration)}</span>
                <LikeButton
                  songId={fottersong._id}
                  initiallyLiked={likedSongs.includes(fottersong._id)}
                />
              </div>
            </div>
          </>
        )
      }
    </>
  )
}