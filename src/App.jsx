import { Suspense, lazy, useContext } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import { Context, FlowContext } from "./store/FlowContext";
import { ApiContext } from "./store/ApiContext";
import { useMediaSession } from "./Props/useMediaSession";

// ✅ Lazy load components
const Applayout = lazy(() => import("./layout/Applayout").then(m => ({ default: m.Applayout })));
const Signin = lazy(() => import("./pages/Signin").then(m => ({ default: m.Signin })));
const Signup = lazy(() => import("./pages/Signup").then(m => ({ default: m.Signup })));
const Reset = lazy(() => import("./pages/Reset").then(m => ({ default: m.Reset })));
const Home1 = lazy(() => import("./layout/Home1").then(m => ({ default: m.Home1 })));
const SongDetails = lazy(() => import("./layout/Songdetails").then(m => ({ default: m.SongDetails })));
const Showall = lazy(() => import("./pages/Showall").then(m => ({ default: m.Showall })));
const Searchsong = lazy(() => import("./pages/Searchsong").then(m => ({ default: m.Searchsong })));
const LikeSong = lazy(() => import("./layout/Likesong").then(m => ({ default: m.LikeSong })));
const Playlist = lazy(() => import("./layout/Playlist").then(m => ({ default: m.Playlist })));
const Sidebar = lazy(() => import("./component/Sidebar").then(m => ({ default: m.Sidebar })));

const router = createBrowserRouter(
  [
    {
      path: "/",
      element: <Applayout />,
      children: [
        {
          path: "",
          element: <Home1 />
        },
        {
          path: ":albumid",
          element: <SongDetails />
        },
        {
          path: "likesong",
          element: <LikeSong />
        },
        {
          path: "album/:catagory_name",
          element: <Showall />
        },
        {
          path: "listofsong",
          element: <Searchsong />
        },
        {
          path: "playlist/:playlistId",
          element: <Playlist />
        },
        {
          path: "songdetails",
          element: <Sidebar />
        }
      ]
    },
    {
      path: "/signin",
      element: <Signin />,

    }, {
      path: "/signup",
      element: <Signup />
    },

    {
      path: "/signin/reset",
      element: <Reset />
    }
  ]
)

// useMediaSession.js

function AppContent() {
  const {
    audioRef,
    handleTimeUpdate,
    handleLoadedMetadata,
    handleEnded,
    fottersong,
    isLoggedIn
  } = useContext(Context);

  useMediaSession();
  return (
    <>
      <Suspense>
        <RouterProvider router={router} />
      </Suspense>
      {
        isLoggedIn && (

          <audio
            ref={audioRef}
            onTimeUpdate={handleTimeUpdate}
            onLoadedMetadata={handleLoadedMetadata}
            onEnded={handleEnded}
          >
            <source src={fottersong?.song_file} type="audio/mp4" />
            Your browser does not support the audio tag.
          </audio>
        )
      }

    </>
  );
}





export const App = () => {

  return (
    <>
      <ApiContext>
        <FlowContext>
          <AppContent />
        </FlowContext>
      </ApiContext>

    </>
  )
}