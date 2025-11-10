import { useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { motion } from "motion/react"
import { Otp } from "../Props/Otp";
import { useEffect } from "react";
export const Signup = () => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [signupData, setsignupData] = useState({
        "username": "",
        "email": "",
        "password": ""
    })
    const [showdetails, Setshowdetails] = useState(true)
    const [countdown, setCountdown] = useState(60);
    const [otp, Setotp] = useState("")
    const navigate = useNavigate()

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);
    const handelsubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch(`${API_URL}/api/signup`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(signupData)
            })
            const data = await response.json()

            if (response.ok) {

                Setshowdetails(false)
                setCountdown(60)
                toast.success(data.message)
            }
            else {
                toast.error(data.errors || data.message)
            }
        }
        catch (error) {
            console.log(error)
        }

    }

    function handelChange(event) {


        const { value, name } = event.target
        setsignupData((pre) => ({ ...pre, [name]: value }))
    }
    function handelclick() {
        console.log(signupData)
    }

    const handelverifyotp = async () => {
        try {
            const response = await fetch(`${API_URL}/api/verifyOtp`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                credentials: "include",
                body: JSON.stringify({ email: signupData.email, otp: otp }),
            });

            const data = await response.json();

            if (response.ok) {

                navigate("/")
                toast.success(data.message);

            } else {
                toast.error(data.message);
            }
        } catch (error) {
            console.error(error);

        }
    };

    return (
        <>
            <div className="bg-[#121212] min-h-screen w-full flex items-center justify-center text-white flex-col  gap-[10px]">
                <div>
                    <img className="w-[50px] h-[50px]" src="./assets/dholida.png" alt="" />
                </div>
                <div className="text-[48px]  max-md:text-[40px] flex flex-col  font-bold">
                    <span className="pl-[25px]">Sign up to</span>
                    <span className="mt-[-15px]">start listening</span>
                </div>
                {
                    showdetails ? (<>

                        <form onSubmit={handelsubmit} autoComplete="off" className="flex flex-col gap-[10px] font-bold [&_input]:p-2 [&_input]:rounded [&_input]:bg-[#1e1e1e]   [&_input]:border  [&_input]:border-[#7C7C7C]  [&_input:hover]:border-white [&_input]:w-[320px]">
                            <div>Email address</div>
                            <input type="email" placeholder="name@gamil.com" value={signupData.email} onChange={handelChange} name="email" autoComplete="off" />
                            <div>Username</div>
                            <input type="text" placeholder="Enter Your Username" value={signupData.username} onChange={handelChange} name="username" autoComplete="off" />
                            <div>Password</div>
                            <input type="password" placeholder="Enter Your Password" value={signupData.password} onChange={handelChange} name="password" autoComplete="off" />
                            <div onClick={handelsubmit} className="mt-[10px]">
                                <motion.button whileHover={{ scale: 1.05, backgroundColor: "#3BE477" }} whileTap={{ scale: 0.95 }} onClick={handelclick} className="text-[17px] px-[125px] py-[8.5px] rounded-[15px] bg-[#1ed760] text-black">Submit</motion.button>
                            </div>

                        </form>
                        <div className="text-gray-400">Already have an account? <NavLink to="/signin"><span className="underline text-white">Log in here.</span></NavLink></div>
                    </>) : (<>
                        <div className="text-[14px]">An OTP has been sent to {signupData.email}</div>
                        <Otp onComplete={Setotp} />
                        <div onClick={handelverifyotp} className="mt-[10px]">
                            <motion.button whileHover={{ scale: 1.05, backgroundColor: "#3BE477" }} whileTap={{ scale: 0.95 }} onClick={handelclick} className="text-[17px] px-[100px] py-[7.5px] rounded-[10px] mb-[10px] bg-[#1ed760] font-bold text-black">Registor</motion.button>
                        </div>
                        <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                            onClick={handelsubmit}
                            disabled={countdown > 0}
                            className={`px-4 py-2 rounded font-bold ${countdown > 0
                                ? "bg-gray-400 text-black"
                                : "bg-yellow-400 hover:bg-yellow-500 text-black"
                                }`}
                        >
                            {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                        </motion.button>

                    </>)
                }
            </div>
        </>
    )
}
