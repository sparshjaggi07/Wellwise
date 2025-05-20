import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Lottie from 'react-lottie';
import loaderAnimation from "/public/animations/loaderGreen.json";

function VideoFeed({ session }) {
    const [sessionActive, setSessionActive] = useState(false);
    const [isVideoLoading, setIsVideoLoading] = useState(false);

    const loaderOptions = {
        loop: true,
        autoplay: true,
        animationData: loaderAnimation,
        rendererSettings: {
            preserveAspectRatio: "xMidYMid slice",
        },
    };

    const startSession = async () => {
        try {
            setIsVideoLoading(true);
            const response = await axios.get('http://localhost:5000/start_session');
            console.log(response.data);
            setSessionActive(true);
            setTimeout(() => {
                setIsVideoLoading(false);
            }, 2000);
        } catch (error) {
            console.error("Error starting session: ", error);
            setIsVideoLoading(false);
        }
    };

    useEffect(() => {
        if (session) {
            startSession();
        }
    }, [session]);

    

    return (
        <div className="flex flex-col justify-center items-center">
            {isVideoLoading ? (
                <div className="flex justify-center items-center h-[250px]">
                    <Lottie options={loaderOptions} height={100} width={100} />
                </div>
            ) : (
                sessionActive && (
                    <img
                        src="http://localhost:5000/video_feed"
                        alt="Video Feed"
                        className="rounded-3xl mt-10 h-[250px]"
                        onLoad={() => setIsVideoLoading(false)}
                        onError={() => {
                            console.error("Error loading video feed");
                            setIsVideoLoading(false);
                        }}
                    />
                )
            )}
        </div>
    );
}

export default VideoFeed;
