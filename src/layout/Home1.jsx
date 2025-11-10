import React, { useContext, useEffect, useState } from 'react';
import { Swiper, SwiperSlide } from 'swiper/react';
import { NavLink } from "react-router-dom";
import 'swiper/css';
import 'swiper/css/navigation';
import { Navigation, Mousewheel, FreeMode } from 'swiper/modules';
import { FaPlay } from "react-icons/fa";
import { motion } from "motion/react"
import { Context } from '../store/FlowContext';
import { decryptData } from '../store/Secure';
import axios from "axios";
import { Context1 } from '../store/ApiContext';
export const Home1 = React.memo(() => {

    const { Setsongpopup, setsongdetails } = useContext(Context)
    const { handelclik, totalcatagory, albumsByCategory, hasMore } = useContext(Context1)


    useEffect(() => {
        const swiperList = document.querySelectorAll(".swiper");

        swiperList.forEach((swiper) => {
            const prevButton = swiper.querySelector(".swiper-button-prev");
            const nextButton = swiper.querySelector(".swiper-button-next");

            prevButton.style.display = "none";
            nextButton.style.display = "none";

            const showButtons = () => {
                prevButton.style.display = "block";
                nextButton.style.display = "block";
            };

            const hideButtons = () => {
                prevButton.style.display = "none";
                nextButton.style.display = "none";
            };

            const handleNextClick = () => {
                prevButton.style.display = "block";
            };

            swiper.addEventListener("mouseenter", showButtons);
            swiper.addEventListener("mouseleave", hideButtons);
            nextButton.addEventListener("click", handleNextClick);

            // Cleanup
            return () => {
                swiper.removeEventListener("mouseenter", showButtons);
                swiper.removeEventListener("mouseleave", hideButtons);
                nextButton.removeEventListener("click", handleNextClick);
            };
        });

    }, []);



    return (
        <>
            {totalcatagory.length > 0 && totalcatagory.map((ele) => (

                <div key={ele._id} className="flex flex-col gap-[15px]">
                    <div className="flex justify-between items-center px-[10px] lg:px-[20px] pt-[15px]">
                        <div className="hover:underline  text-[16px] md:text-[20px] lg:text-[25px] capitalize">{ele.catagory_name}</div>
                        <div className="hover:underline  text-gray-300  text-[14px] lg:text-[17px] hover:cursor-pointer">  <NavLink to={`album/${ele.catagory_name}`}>Show all</NavLink></div>
                    </div>

                    {albumsByCategory[ele.catagory_name]?.length > 0 && (

                        <Swiper
                            spaceBetween={10}
                            navigation={true}
                            centeredSlides={false}
                            freeMode={{
                                enabled: true,
                                momentum: false,
                            }}
                            mousewheel={{
                                forceToAxis: true,
                                releaseOnEdges: true,
                                sensitivity: 1,
                                thresholdDelta: 1,
                                thresholdTime: 0,
                            }}
                            breakpoints={{
                                0: {       // mobile
                                    slidesPerView: 3.5,
                                    spaceBetween: 6,
                                    freeMode: { enabled: true, momentum: true },
                                },
                                640: {     // sm (≥640px)
                                    slidesPerView: 4.5,
                                    spaceBetween: 6,
                                    freeMode: { enabled: true, momentum: true },
                                },
                                768: {     // md (≥768px)
                                    slidesPerView: 3.5,
                                    spaceBetween: 8,
                                    freeMode: { enabled: true, momentum: true },
                                },
                                1024: {    // lg (≥1024px)
                                    slidesPerView: 5.5,
                                    spaceBetween: 10,
                                },
                            }}
                            modules={[Navigation, Mousewheel, FreeMode]}
                            className="mySwiper w-full"
                        >
                            {albumsByCategory[ele.catagory_name].map((text, index) => (
                                <SwiperSlide key={index}>
                                    <NavLink to={`/${text._id}`}>
                                        <div className="flex flex-col gap-[10px] text-white font-bold hover:bg-gradient-to-b from-[#1B1B1B] via-[#121212] to-[#1F1F1F] p-[7px] rounded-[10px] relative group">
                                            <div className="w-full">
                                                <img
                                                    className="w-full xs:h-[100px] sm:h-[120px] md:h-[150px] lg:h-[180px]  object-cover rounded-[10px]"
                                                    src={text.albumimage}
                                                    alt={text.albumname}
                                                />
                                            </div>
                                            <div className=" xs:text-[11px] lg:text-[14px]">{text.albumname}</div>
                                            <div className=" xs:text-[10px] lg:text-[12px] text-gray-200 max-md:truncate">{text.description}</div>

                                            <motion.div
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    e.stopPropagation();
                                                    setsongdetails(text);
                                                    Setsongpopup(true);
                                                }}
                                                className="p-[11px] lg:p-[15px] rounded-full bg-[#3AE075] w-fit h-fit absolute  top-[70px] md:top-[100px] lg:top-[110px] right-[15px] flex justify-center items-center opacity-0 translate-y-[20px] group-hover:opacity-100 group-hover:translate-y-0 transition-all duration-500 ease-out"
                                            >
                                                <FaPlay className=" text-[12px] md:text-[16px] lg:text-[20px] text-black" />
                                            </motion.div>
                                        </div>
                                    </NavLink>
                                </SwiperSlide>
                            ))}
                        </Swiper>

                    )

                    }


                </div>

            )
            )}
            {hasMore && (
                <>
                    <div className='py-[25px]  flex justify-center'>
                        <button
                            onClick={handelclik}
                            className='text-center cursor-pointer text-white text-[18px]'
                        >
                            More Result
                        </button>
                    </div>
                </>

            )}
        </>
    )
})