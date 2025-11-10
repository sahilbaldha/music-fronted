import { Outlet } from "react-router-dom";
import { Fotter } from "../component/Fotter";
import { Header } from "../component/Header";
import { Profile } from "../component/Profile";
import { Popup } from "../component/Popup";
import { Song } from "./Song";
import { Home } from "../pages/Home";
import { useContext, useEffect, useRef, useState } from "react";
import { Start } from "../pages/Start";
import { Context } from "../store/FlowContext";

export const Applayout = () => {


    const scrollRef = useRef(null);
    const { setShowHeader } = useContext(Context)
    const [screen, setScreen] = useState(true);

    // splash screen
    useEffect(() => {
        const timer = setTimeout(() => {
            setScreen(false);
        }, 2000);
        return () => clearTimeout(timer);
    }, []);

    // scroll listener
    useEffect(() => {
        const handleScroll = () => {
            if (scrollRef.current) {
                // Here, we set showHeader to true when the scroll position is > 100px
                setShowHeader(scrollRef.current.scrollTop > 200);
            }
        };

        const scrollElement = scrollRef.current;
        if (scrollElement) {
            scrollElement.addEventListener("scroll", handleScroll);
        }

        return () => {
            if (scrollElement) {
                scrollElement.removeEventListener("scroll", handleScroll);
            }
        };
    }, [screen]);

    if (screen) {
        return <Start />;
    }

    return (
        <div className="relative font-bold font-tiktok min-h-screen bg-black">
            {/* top header (always visible) */}
            <Header />

            {/* main content area */}
            <div className="bg-black w-full min-h-[calc(100vh-132px)] text-white font-tiktok px-[12px] pt-[64px] pb-[6.5px] font-bold">
                <div className="flex gap-[5px] relative w-full min-h-[calc(100vh-132px)]">
                    {/* left sidebar */}
                    <Home />

                    {/* scrollable center content */}
                    <div
                        ref={scrollRef}
                        className="bg-gradient-to-b from-[#202020] to-[#121212]
                        xs:basis-[100%] md:basis-[64.5%] lg:basis-[72.5%]
                        rounded-[6.5px] relative
                        overflow-y-auto md:overflow-y-auto
                        h-[calc(100vh-142px)]
                        pb-[40px] custom_scroll"
                    >
                       
                        <Outlet />
                    </div>
                </div>
            </div>

            {/* fixed bottom items */}
            <Fotter />
            <Profile />
            <Popup />
            <Song />
        </div>
    );
};