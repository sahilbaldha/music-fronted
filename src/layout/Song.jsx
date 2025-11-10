import { NavLink } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react"
import { useContext } from "react";
import { Context } from "../store/FlowContext";
export const Song = () => {
    const { isLoggedIn, songpopup, Setsongpopup, songdetails } = useContext(Context)

    return (
        <>

            <AnimatePresence>
                {
                    !isLoggedIn && songpopup && songdetails && (
                        <motion.div initial={{ opacity: 0, y: 50 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: 50 }} transition={{ duration: 0.3, ease: "easeOut" }} className="fixed inset-0 z-[50] flex flex-col bg-[#000000d2] gap-[10px] text-white justify-center items-center overflow-y-auto">

                            <div className="bg-[#444446] flex gap-[10px] sm:gap-[20px] p-[10px] sm:p-[30px] rounded-[5px]" style={{ backgroundColor: songdetails.bgcolor }}>
                                <div>
                                    <img className=" w-[180px] sm:w-[300px] sm:h-[300px] object-cover rounded-[5px]" src={songdetails.albumimage} alt="" />
                                </div>
                                <div className="flex flex-col gap-[5px] items-center justify-center">
                                    <div className="text-[13px] sm:text-[30px]">Start listening with a </div>
                                    <div className="text-[13px] sm:text-[30px]">free Spotify account</div>
                                    <motion.button whileHover={{ scale: 1.03, backgroundColor: "#08f85c" }} whileTap={{ scale: 0.95 }} className="w-fit text-black bg-[#3BE477] max-sm:text-[12px] py-[10px] px-[17px] sm:px-[35px]  rounded-[25px] font-bold"><NavLink to="/signup">Sign up free</NavLink></motion.button>
                                    <div className="text-gray-300 max-sm:text-[11px]">Already have an account?<span className="underline text-white  text-[11px] sm:text-[17px] ml-[7px] cursor-pointer"><NavLink to="/signin">Log in</NavLink></span></div>
                                </div>
                            </div>
                            <div onClick={() => Setsongpopup(false)} className="text-[16px] sm:text-[18px] cursor-pointer ">Close</div>
                        </motion.div>
                    )
                }

            </AnimatePresence>

        </>
    )
}