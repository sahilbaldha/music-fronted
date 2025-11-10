import axios from "axios";
import { IoIosAddCircleOutline } from "react-icons/io";
import { FaHeart } from "react-icons/fa";
import { useContext } from "react";
import { Context } from "../store/FlowContext";

export const LikeButton = ({ songId }) => {
      const API_URL = import.meta.env.VITE_API_URL;
  const { likedSongs, setLikedSongs } = useContext(Context);

  const liked = likedSongs.includes(songId);

  const handleLike = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/likeunlike`,
        { songId },
        { withCredentials: true }
      );

      // Update global likedSongs
      setLikedSongs(res.data.likedSongs);
    } catch (err) {
      console.error("Like/unlike failed", err);
    }
  };

  return (
    <button
      onClick={(e) => {
        e.preventDefault();
        e.stopPropagation();
        handleLike();
      }}
    >
      {liked ? (
        <FaHeart className="text-[#ec09af]" size={19} />
      ) : (
        <IoIosAddCircleOutline size={23} />
      )}
    </button>
  );
};
