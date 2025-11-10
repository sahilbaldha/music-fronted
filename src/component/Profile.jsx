import { useContext, useState } from "react";
import { IoLogOutOutline } from "react-icons/io5";
import { Context } from "../store/FlowContext";
import { NavLink, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react"
import { toast } from "react-toastify";
export const Profile = () => {
    const { profile, explore, setIsLoggedIn, setExplore } = useContext(Context)
    const navigate = useNavigate()
     const API_URL = import.meta.env.VITE_API_URL;
    const handleLogout = async () => {
        try {
            const response = await fetch(`${API_URL}/api/logout`, {
                method: "POST",
                credentials: "include",
            });
            const data = await response.json()
            if (response.ok) {

                setIsLoggedIn(false);
                setExplore(false);
                navigate("/signin")
                toast.success(data.message)

            } else {
                console.error("Logout failed");

            }
        } catch (error) {
            console.error("Logout error:", error);

        }
    };


    return (
        <>
            <AnimatePresence>
                {explore && (
                    <motion.div
                        key="profile-dropdown"
                        initial={{ opacity: 0, y: 100 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: 100 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="flex z-[60] flex-col bg-[#000000ee] text-[#F0F0F0] w-fit h-fit gap-[10px] justify-center items-start rounded-[5px] p-[10px] absolute top-[62px] right-[13px]"
                    >
                        <div className="flex gap-[10px] flex-col  max-md:text-[12px]">
                            <div className="flex justify-between w-full">
                                <div className="text-gray-400">Username:</div>
                                <div>{profile.username}</div>
                            </div>
                            <div className="flex w-full justify-between">
                                <div className="text-gray-400 pr-[20px]">Email:</div>
                                <div>{profile.email}</div>
                            </div>
                        </div>

                        <div className="w-full text-center bg-[#209a20] h-[2px]"></div>

                        <div className="flex w-full justify-between items-center max-md:text-[12px]">
                            <div className="flex gap-[5px] items-center">
                                <IoLogOutOutline className="text-[20px]" />
                                <motion.div
                                    whileHover={{ scale: 1.03, color: "white" }}
                                    onClick={handleLogout}
                                    className="hover:underline hover:cursor-pointer w-fit"
                                >
                                    <NavLink to="/signin">Signout</NavLink>
                                </motion.div>
                            </div>
                            <motion.div
                                onClick={() => setExplore(false)}
                                whileHover={{ scale: 1.03, color: "white" }}
                                className="hover:underline hover:cursor-pointer"
                            >
                                Close
                            </motion.div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    );
};