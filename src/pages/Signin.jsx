import { useContext, useState } from "react";
import { NavLink } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../store/FlowContext";
import { motion } from "motion/react"
export const Signin = () => {
       const API_URL = import.meta.env.VITE_API_URL;
    const [SigninData, setSigninData] = useState(
        {
            "email": "",
            "password": ""
        }
    )
    const navigate = useNavigate()
    const { setflowcontext, setEmail } = useContext(Context)

    const handelSubmit = async (event) => {

        event.preventDefault();
        try {


            const response = await fetch(`${API_URL}/api/signin`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json"
                },
                credentials: "include",
                body: JSON.stringify(SigninData)
            });
            const data = await response.json();
            console.log(data)
            if (response.ok) {

                navigate("/")
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
        setSigninData((pre) => ({ ...pre, [name]: value }))
    }


    const handelforgetclick = async () => {

        const emaildata = {
            email: SigninData.email
        }
        const response = await fetch(`${API_URL}/api/forget`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },

            body: JSON.stringify(emaildata)
        });

        const data = await response.json();

        if (response.ok) {
            setEmail(SigninData.email)
            toast.success(data.message)
            setflowcontext(true);
            navigate("/signin/reset");
        } else {
            toast.error(data.errors || data.message);
        }
    }

    return (
        <>
            <div className=" text-white min-h-screen w-full bg-gradient-to-b from-[#0e0e0e] to-black flex items-center justify-center">
                <div className="font-bold font-tiktok flex flex-col  gap-[10px] max-md:w-[350px] w-[450px] h-[450px] bg-black rounded-[7.5px] items-center p-[10px]">
                    <div>
                        <img className="w-[50px] h-[50px] mt-[20px]" src="/assets/dholida.png" alt="" />
                    </div>
                    <div className="text-[41px] max-md:text-[30px]">Log in to Dholida</div>
                    <form onSubmit={handelSubmit} autoComplete="off" className="flex flex-col gap-[10px] [&_input]:w-[310px] [&_input]:p-2 [&_input]:bg-[#1e1e1e] [&_input]:rounded [&_input]:border [&_input]:border-[#7C7C7C]  [&_input:hover]:border-white">
                        <div>Email</div>
                        <input type="email" placeholder="Enter Your Phone Number" value={SigninData.email} onChange={handelChange} name="email" />
                        <div>Password</div>
                        <input type="password" placeholder="Enter Your Passwoord" value={SigninData.password} onChange={handelChange} name="password" />
                        <div>
                            <motion.button whileHover={{ scale: 1.05, backgroundColor: "#3BE477" }} whileTap={{ scale: 0.95 }} className="px-[130px] mt-[10px] py-[11px]  bg-[#1ae160] rounded-[20px] text-black ">Login</motion.button>
                        </div>
                    </form>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }} onClick={handelforgetclick} className="text-red-500 w-fit cursor-pointer">Forget Password</motion.div>
                    <div className="text-gray-400 max-md:text-[14px]">Don't have an account? <NavLink to="/signup"><span className="text-white underline max-md:text-[12px]">Sign up for Dholida</span></NavLink></div>
                </div>
            </div>
        </>
    )
}