import { useState } from "react";
import { useEffect } from "react";
import { createContext } from "react"
import { decryptData } from './Secure';
import axios from "axios";
export const Context1 = createContext()
export const ApiContext = ({ children }) => {
    const API_URL = import.meta.env.VITE_API_URL;
    const [totalcatagory, settotalcatagory] = useState([])
    const [albumsByCategory, setAlbumsByCategory] = useState({});
    const [hasMore, setHasMore] = useState(true); // 🔑 NEW
    const [screen, setScreen] = useState(true)
    const [page, setpage] = useState(1)
    const limit = 3;
    let allOk = true;

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${API_URL}/api/listcatagory`, {
                    params: { page: page, limit },
                    headers: { 'x-api-key': import.meta.env.VITE_API_KEY },
                });

                const decrypted = await decryptData(res.data.encryptedData);

                if (!decrypted || decrypted.length < limit) {
                    setHasMore(false);
                }
                // ✅ Prevent duplicate appends
                settotalcatagory((pre) => {
                    if (page === 1) {
                        return decrypted;
                    } else {
                        return [...pre, ...decrypted];
                    }
                });

                // Fetch albums for each category
                for (const cat of decrypted) {
                    try {
                        const albumRes = await axios.get(`${API_URL}/api/alllistalbum`, {
                            params: { catagory_name: cat.catagory_name }, // Use correct param key
                            headers: { 'x-api-key': import.meta.env.VITE_API_KEY },
                        });


                        if (albumRes.status !== 200) {
                            allOk = false;
                        }

                        const albumDecrypted = decryptData(albumRes.data.encryptedData);

                        setAlbumsByCategory(prev => ({
                            ...prev,
                            [cat.catagory_name]: albumDecrypted || [],
                        }));
                    } catch (albumErr) {
                        console.error("Album fetch failed for", cat.catagory_name, albumErr);
                        allOk = false;
                    }
                }
                if (allOk) {
                    // smooth transition (Start → AppLayout)
                    setTimeout(() => {
                        setScreen(false);
                    }, 500);
                } else {
                    // Start SCREEN must stay ON — no white screen
                    setScreen(true);
                }
            } catch (err) {
                console.error("Category fetch failed", err);
                settotalcatagory([]);
            }
        };

        fetchData();
    }, [page]);

    const handelclik = () => {

        setpage((pre) => pre + 1)
    }



    return (
        <>
            <Context1.Provider value={{ screen, handelclik, totalcatagory, albumsByCategory, hasMore }}>{children}</Context1.Provider>
        </>
    )
}