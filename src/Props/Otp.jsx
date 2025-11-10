import { useState, useRef, useEffect } from "react";

export const Otp = ({ onComplete }) => {
    const [otpArray, setOtpArray] = useState(["", "", "", "", "", ""]); // store 6 digits
    const inputRefs = useRef([]); // to control focus of each input


    useEffect(() => {
        inputRefs.current[0]?.focus(); // focus first input when loaded
    }, []);

    const handleChange = (e, index) => {
        const value = e.target.value;

        if (!/^[0-9]?$/.test(value)) return; // allow only single digit (or empty)

        const updatedOtp = [...otpArray]; // copy old otp array
        updatedOtp[index] = value; // update current box
        setOtpArray(updatedOtp); // set new array

        const fullOtp = updatedOtp.join(""); // join to string like "123456"
        if (fullOtp.length === 6 && !updatedOtp.includes("")) {
            onComplete(fullOtp); // call parent function if all boxes filled
        }

        if (value && index < 5) {
            inputRefs.current[index + 1]?.focus(); // move to next box
        }
    };

    const handleKeyDown = (e, index) => {
        if (e.key === "Backspace") {
            if (otpArray[index]) {
                const updatedOtp = [...otpArray];
                updatedOtp[index] = "";
                setOtpArray(updatedOtp);
            } else if (index > 0) {
                inputRefs.current[index - 1]?.focus(); // go back if current empty
            }
        }
    };

    return (
        <div className="flex gap-2 justify-center">
            {otpArray.map((digit, index) => (
                <input
                    key={index}
                    type="text"
                    maxLength={1}
                    value={digit}
                    onChange={(e) => handleChange(e, index)}
                    onKeyDown={(e) => handleKeyDown(e, index)}
                    ref={(el) => (inputRefs.current[index] = el)}
                    className="w-10 h-12 text-center text-xl rounded border border-gray-400 bg-[#1e1e1e] text-white focus:outline-none focus:border-white"
                />
            ))}
        </div>
    );
};
