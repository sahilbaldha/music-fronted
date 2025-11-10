import { createContext, useEffect, useRef, useState } from "react"
import { decryptData } from "./Secure"
import axios from "axios";
export const Context = createContext()
export const FlowContext = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL;
  const [flowcontext, setflowcontext] = useState(false)
  const [email, setEmail] = useState("")
  const [profile, setProfile] = useState("")
  const [explore, setExplore] = useState(false);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [showsignup, setShowsignup] = useState(false)
  const [songpopup, Setsongpopup] = useState(false)

  //song details
  const [songdetails, setsongdetails] = useState({})
  const [fottersong, fottersongdetails] = useState({})
  const [songList, setSongList] = useState([]); // new
  const [currentSongIndex, setCurrentSongIndex] = useState(0); // new


  const updateCurrentSong = (index) => {
    if (songList[index]) {
      fottersongdetails(songList[index]);
      setCurrentSongIndex(index);
    }
  };

  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef(null);
  const togglePlay = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlaying) {
      audio.pause();
      setIsPlaying(false);
    } else {
      audio
        .play()
        .then(() => {
          setIsPlaying(true);
        })
        .catch((error) => {
          console.warn("Playback failed:", error);
        });
    }
  };

  const [inputValue, setInputValue] = useState('');
  const [likedSongs, setLikedSongs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(`${API_URL}/api/alllikesong`);
        const decrypted = await decryptData(res.data);
        const arraylike = decrypted.map((ele) => ele._id)
        setLikedSongs(arraylike);

      }
      catch (err) {
        console.error("Category fetch failed", err);
        setLikedSongs([]);
      }
    };

    fetchData();
  }, []);

  const [sidebar, setsidebar] = useState(true)

  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);


  const handleTimeUpdate = () => {
    if (audioRef.current) {
      setCurrentTime(audioRef.current.currentTime);
    }
  };

  const handleLoadedMetadata = () => {
    if (audioRef.current) {
      setDuration(audioRef.current.duration);
    }
  };

  const handleSeek = (e) => {
    const value = Number(e.target.value);
    audioRef.current.currentTime = value;
    setCurrentTime(value);
  };

  function formatTime(time) {
    const mins = Math.floor(time / 60)
      .toString()
      .padStart(2, "0");
    const secs = Math.floor(time % 60)
      .toString()
      .padStart(2, "0");
    return `${mins}:${secs}`;
  }


  const handleNext = () => {
    const nextIndex = (currentSongIndex + 1) % songList.length;
    updateCurrentSong(nextIndex);
  };

  const handlePrev = () => {
    const prevIndex = (currentSongIndex - 1 + songList.length) % songList.length;
    updateCurrentSong(prevIndex);
  };
  const handleEnded = () => {
    handleNext(); // Automatically go to next song
  };
  const [showHeader, setShowHeader] = useState(false);
  return (
    <>
      <Context.Provider value={{ showHeader, setShowHeader, currentTime, duration, handleEnded, handleNext, handlePrev, handleSeek, handleLoadedMetadata, handleTimeUpdate, formatTime, sidebar, setsidebar, likedSongs, setLikedSongs, inputValue, setInputValue, audioRef, setIsPlaying, togglePlay, isPlaying, songList, setSongList, currentSongIndex, setCurrentSongIndex, updateCurrentSong, fottersongdetails, fottersong, songdetails, setsongdetails, flowcontext, setflowcontext, email, setEmail, profile, setProfile, explore, setExplore, isLoggedIn, setIsLoggedIn, setShowsignup, showsignup, songpopup, Setsongpopup }}>{children}</Context.Provider>
    </>
  )
}
