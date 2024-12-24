'use client';

import { checkServer } from "@/utils/serverAvailability";
import { useEffect, useRef, useState } from "react";
import SolidColor from "@/components/elements/SolidColor";

const Home = () => {
  const Components = {
    SolidColor
  }

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const isCheckingStatus = useRef(false);

  const [selectedTab, setSelectedTab] = useState(null);

  useEffect(() => {
    if (isCheckingStatus.current) return;
    isCheckingStatus.current = true;

    // Retry 10 times
    setIsLoaded(false);
    checkServer(10).then(status => {
      if (!status.online) {
        return setError('Looks like there are no cool lamps connected to your network!');
      }

      setIsLoaded(true);
      setSelectedTab('SolidColor');
    });
  }, []);

  return (
    <div className="w-full h-screen p-10 bg-white flex items-center justify-center">
      {!isLoaded && (
        <div className="rotating-border">
          <div className="w-fit h-auto aspect-square bg-white p-5 sm:p-20 rounded-md flex flex-col justify-center items-center">
            <h1 className="text-5xl sm:text-6xl text-black text-center">Hang tight!</h1>
            <p className="text-black text-lg mt-4 text-center">
              Checking for cool lamps on your network
            </p>
          </div>
        </div>
      )}

      {error && (
        <div className="text-red-500 text-center mt-4">
          {error}
        </div>
      )}

      {isLoaded && !error && (
        <div className="w-full h-full">
          {(() => {
            const Component = Components[selectedTab];
            if (!Component) return null;
            return <Component />
          })()}
        </div>
      )}
    </div>
  );
};

export default Home;
