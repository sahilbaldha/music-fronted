import { RiHome2Line } from "react-icons/ri";
import { CiSearch } from "react-icons/ci";
import { NavLink, useLocation, useNavigate } from "react-router-dom";
import { useState, useEffect, useContext } from "react";
import { motion } from "motion/react"
import { Context } from "../store/FlowContext";
import { TbPlaylistAdd } from "react-icons/tb";

export const Header = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const { sidebar, setsidebar, explore, setExplore, isLoggedIn, setIsLoggedIn, setProfile, profile, inputValue, setInputValue } = useContext(Context)

    const location = useLocation();
    const isHomePage = location.pathname === "/";
    const navigate = useNavigate();

    useEffect(() => {
        if (inputValue.trim().length >= 3) {
            navigate('/listofsong');
        }
        else {
            navigate('/');
        }
    }, [inputValue, navigate]);

    useEffect(() => {
        const checkAuth = async () => {
            try {
                const res = await fetch(`${API_URL}/api/profile`, {
                    method: "GET",
                    credentials: "include",
                });
                const data = await res.json();
                if (res.ok) {
                    setProfile(data.user);
                    setIsLoggedIn(true);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (err) {
                setIsLoggedIn(false);
            }
        };

        checkAuth(); // Run once on mount
    }, []); // Empty dependency array = run only on mount


    function handleClick() {
        setExplore(!explore);
    }

    return (
        <>
            <div className="fixed top-0 w-full">
                <div className=" relative h-[64px] w-full flex items-center bg-[black] text-[#F0F0F0]  ">
                    <TbPlaylistAdd onClick={() => setsidebar((pre) => !pre)} className="xs:flex  md:hidden absolute left-[15px] w-[2rem] h-[2rem]" />
                    <div className="absolute left-[60px] md:flex hidden">
                        <img className=" w-[1.5rem] h-[1.5rem] md:w-[2.5rem] md:h-[2rem]" src="/assets/dholida.png" />
                    </div>
                    <motion.div
                        initial={false}
                        animate={{ backgroundColor: isHomePage ? "#1f1e1e" : "#e3342f" }} // red-600
                        whileHover={{ backgroundColor: "#2A2A2A" }}
                        className="absolute left-[55px] md:left-[120px] p-[10px] rounded-[50%] transition-colors duration-300"
                    >
                        <NavLink to="/">
                            <RiHome2Line className="w-[1.5rem] h-[1.5rem]" />
                        </NavLink>
                    </motion.div>
                    {isLoggedIn && (

                        <div className="absolute xs:left-[110px] md:left-[180px]">
                            <div className="relative">
                                <motion.input value={inputValue} onChange={(e) => setInputValue(e.target.value)} whileHover={{ backgroundColor: "#2A2A2A", border: "1px solid #F0F0F0" }} transition={{ duration: 0.3, ease: "easeIn" }} className="  text-[11px]  sm:text-[14px] w-[12rem]  sm:w-[20rem] rounded-[20px] h-[40px] bg-[#1f1e1e] pl-[40px]" type="text" placeholder="What do you want to play?" />
                                <CiSearch className="absolute top-[8px] left-[8px] w-[25px] h-[25px]" />
                            </div>
                        </div>
                    )

                    }

                    {isLoggedIn ? (
                        <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={handleClick}
                            className=" absolute right-[10px] md:right-[15px]  w-[35px] h-[35px] md:w-[40px] md:h-[40px]  rounded-full p-2 bg-white  text-[green] flex justify-center items-center cursor-pointer text-[22px]"
                        >
                            {profile.username[0]}
                        </motion.div>
                    ) : (
                        <>
                            <motion.div whileHover={{ scale: 1.03, color: "white" }} className="absolute max-sm:right-[100px] right-[130px] max-sm:text-[14px]">
                                <NavLink to="/signup">Sign Up</NavLink>
                            </motion.div>
                            <motion.button whileHover={{ scale: 1.03, backgroundColor: "#F0F0F0" }} whileTap={{ scale: 0.95 }} className="absolute right-[15px] text-black bg-white  px-[14px] max-sm:text-[14px] sm:px-[28px] py-[10px] rounded-[25px] font-bold">
                                <NavLink to="/signin" >Log in</NavLink>
                            </motion.button>
                        </>
                    )}
                </div>
            </div>
        </>
    )
}