import { motion, AnimatePresence } from "motion/react"
import { useContext } from "react"
import { Context } from "../store/FlowContext"
import { NavLink } from "react-router-dom";
export const Popup = () => {
    const { isLoggedIn, showsignup, setShowsignup } = useContext(Context)
    return (
        <>

            <AnimatePresence>
                {!isLoggedIn && showsignup && (
                    <motion.div
                        key="signup-popup"
                        initial={{ opacity: 0, y: -50 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -50 }}
                        transition={{ duration: 0.6, ease: "easeOut" }}
                        className="w-fit h-fit z-[60]  py-[10px] pl-[10px] pr-[3px] sm:py-[20px] sm:pl-[10px] sm:pr-[35px] bg-[#69BFFF] rounded-[7.5px] text-black flex-col gap-[10px] absolute   left-[calc(30vw+30px)] sm:left-[calc(30vw+10px)] top-[150px] flex"
                    >
                        <div className="text-[14px] sm:text-[18px]">Create a Playlist</div>
                        <div className="max-sm:text-[12px]">Log in to create and share playlists.</div>
                        <div className="flex gap-[10px]  sm:justify-end items-center">
                            <motion.div
                                onClick={() => setShowsignup(false)}
                                whileHover={{ scale: 1.03, cursor: "pointer" }}
                                whileTap={{ scale: 0.95 }}
                                className="max-sm:text-[12px]"
                            >
                                Not now
                            </motion.div>
                            <motion.button
                                whileHover={{ scale: 1.03, backgroundColor: "#F0F0F0" }}
                                whileTap={{ scale: 0.95 }}
                                className="bg-white px-[15px] py-[7.5px] rounded-[20px] max-md:text-[12px]"
                            >
                                <NavLink to="/signin">Log in</NavLink>
                            </motion.button>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

        </>
    )
}