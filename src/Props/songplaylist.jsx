import axios from "axios";
import { IoIosMore } from "react-icons/io";
import { useState } from "react";
import { decryptData } from "../store/Secure";
import { toast } from "react-toastify";
export const Songplaylist = ({ songId }) => {
        const API_URL = import.meta.env.VITE_API_URL;
    const [playlists, setPlaylists] = useState([]);
    const [hidden, setHidden] = useState(true);

    // Fetch user playlists
    const allplaylist = async () => {
        try {
            const res = await axios.get(`${API_URL}/api/getUserPlaylists`,{ withCredentials: true } );
            const decrypted = await decryptData(res.data.encryptedData);
            setPlaylists(decrypted || []);
        } catch (error) {
            console.error("Error fetching playlists:", error);
        }
    };

    // Add song to a playlist
    const addsongplaylist = async (playlistId) => {
        try {
            const res = await axios.post(`${API_URL}/api/addSongToPlaylist`, {
                playlistId,
                songId,
            },{ withCredentials: true } );
            if (res.data.success) {
                console.log(res.data)
                toast.success(res.data.message)
            }
            setHidden(true); // hide dropdown after adding
        } catch (error) {
            toast.error(error.response.data.message)

        }
    };
    return (
        <>
            {/* More Icon */}
            <IoIosMore
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    allplaylist();
                    setHidden((prev) => !prev);
                }}

            />

            {/* Playlist Dropdown */}
            {!hidden && playlists.length > 0 && (
                <ul
                    className="absolute  right-[30px] md:right-[50px] top-[70%] mt-2 w-60 max-h-[130px]  bg-neutral-900 shadow-lg 
                               ring-1 ring-white/10 backdrop-blur-md z-50 overflow-x-hidden md:overflow-y-hidden  overflow-y-auto md:hover:overflow-y-auto custom_scroll"
                >
                    {playlists.map((pl) => (
                        <li
                            key={pl._id}
                            onClick={(e) => {
                                e.preventDefault();
                                e.stopPropagation();
                                addsongplaylist(pl._id)
                            }}
                            className="px-4 py-2 capitalize truncate w-full text-sm text-white cursor-pointer 
                                       hover:bg-white/10 hover:text-green-400 
                                       transition-colors rounded-md"
                        >
                            {pl.name}
                        </li>
                    ))}
                </ul>
            )}
        </>
    );
};
