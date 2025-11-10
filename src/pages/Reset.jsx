import { useContext, useState, useEffect } from "react";
import { useNavigate, Navigate } from "react-router-dom";
import { toast } from "react-toastify";
import { Context } from "../store/FlowContext";
import { Otp } from "../Props/Otp";
import { motion } from "motion/react"

export const Reset = () => {
        const API_URL = import.meta.env.VITE_API_URL;
    const { flowcontext, email } = useContext(Context);
    const [otp, setOtp] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [countdown, setCountdown] = useState(60);
    const apiURL = import.meta.env.VITE_API_URL;
    const navigate = useNavigate();

    const resetPassword = async () => {
        try {
            const res = await fetch(`${API_URL}/api/reset`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, otp, newPassword }),
            });

            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                navigate("/signin");
            } else {
                toast.error(data.errors || data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    const resendOTP = async () => {
        try {
            const res = await fetch(`${API_URL}/api/forget`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email }),
            });
            const data = await res.json();
            if (res.ok) {
                toast.success(data.message);
                setCountdown(60); // ✅ reset countdown
            } else {
                toast.error(data.message);
            }
        } catch (err) {
            console.log(err);
        }
    };

    useEffect(() => {
        if (countdown <= 0) return;
        const timer = setInterval(() => {
            setCountdown((prev) => prev - 1);
        }, 1000);
        return () => clearInterval(timer);
    }, [countdown]);

    if (!flowcontext) return <Navigate to="/signin" />;

    return (
        <div className="text-white min-h-screen w-full bg-gradient-to-b from-[#0e0e0e] to-black  flex items-center justify-center">
            <div className="font-bold font-tiktok flex flex-col  gap-[10px] w-[450px] h-fit bg-black rounded-[7.5px] items-center p-[20px] ">
                <div>
                    <img className="w-[50px] h-[50px] mt-[20px]" src="/assets/dholida.png" alt="" />
                </div>
                <h2 className="text-lg font-bold">Reset Password</h2>

                <Otp onComplete={setOtp} />
                <input
                    type="password"
                    placeholder="Enter New Password"
                    value={newPassword}
                    className="w-[310px] p-2 bg-[#1e1e1e] rounded border border-[#7C7C7C] hover:border-white"
                    onChange={(e) => setNewPassword(e.target.value)}
                />
                <motion.button whileHover={{ scale: 1.05, backgroundColor: "#3BE477" }} whileTap={{ scale: 0.95 }}
                    onClick={resetPassword}
                    className="bg-[#1ed760] text-black px-4 py-2 rounded"
                >
                    Reset Password
                </motion.button>
                <motion.button whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}
                    onClick={resendOTP}
                    disabled={countdown > 0}
                    className={`px-4 py-2 rounded ${countdown > 0
                        ? "bg-gray-400 text-black"
                        : "bg-yellow-400 hover:bg-yellow-500 text-black"
                        }`}
                >
                    {countdown > 0 ? `Resend OTP in ${countdown}s` : "Resend OTP"}
                </motion.button>
            </div>
        </div>
    );
};
