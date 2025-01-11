'use client';

import { checkServer } from "@/utils/serverAvailability";
import { useEffect, useRef, useState } from "react";
import SolidColor from "@/components/elements/SolidColor";
import { Brightness } from "@/components/elements/Brightness";
import { RainbowCycle } from "@/components/elements/RainbowCycle";
import { BreathingEffect } from "@/components/elements/BreathingEffect";
import { LampDB } from "@/utils/lampFunctions";

const Home = () => {
  const db = new LampDB();

  const Components = {
    SolidColor,
    RainbowCycle,
    BreathingEffect
  }

  const tabs = ["SolidColor", "RainbowCycle", "BreathingEffect"]

  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState(null);
  const isCheckingStatus = useRef(false);

  const [selectedTab, setSelectedTab] = useState(null);
  const [sidenavOpen, setSidenavOpen] = useState(false);

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

    db.read(["preset"]).then(res => {
      if (res?.error) return;
      const savedTab = res?.result?.retrieved?.preset || 'SolidColor';
      setSelectedTab(savedTab);
    }) 
  }, []);

  useEffect(() => {
    db.write("preset", selectedTab).then(res => {});
  }, [selectedTab]);

  return (
    <div className="flex w-full h-screen bg-white">
      <div onClick={(e) => {
        const path = e.nativeEvent.composedPath();
        if (path.find(el => el?.classList?.contains("no-close")))
          return;

        setSidenavOpen(false)
      }} className={`w-screen h-screen fixed bg-[rgba(0,0,0,0.5)] transition-all z-[100] ${sidenavOpen ? "left-0 opacity-1" : " left-[-100vw] opacity-0"}`}>
        <div className="flex flex-col gap-3 w-[300px] p-5 no-close h-full bg-white">
          {tabs.map(tab => {
            return <button key={tab} onClick={() => setSelectedTab(tab)} className={`w-full px-4 py-3 ${selectedTab === tab ? "hover:bg-blue-200 bg-blue-100" : "hover:bg-gray-200 bg-gray-100"} rounded-lg text-black cursor-pointer transition-all`}>
              {tab}
            </button>
          })}
        </div>
      </div>

      <div className={`${sidenavOpen ? "w-[300px]" : "w-[0px]"} shrink-0 transition-all h-screen`}>

      </div>

      {(!isLoaded || error) && <div className="p-10 w-full h-full flex items-center justify-center">
        {(!isLoaded && !error) && (
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
      </div>}

      {isLoaded && !error && (
        <div className="w-full h-full">
          <div className="items-center flex justify-between w-full px-8 py-3 shadow-md text-black">
            <div>
              <p>The Best RGB Lamp</p>
              <p className="text-sm text-gray-500">Made by the #1 greatest engineer in the world (your boyfriend)</p>
            </div>

            <button onClick={() => setSidenavOpen(!sidenavOpen)} className="flex items-center justify-center rounded-full bg-white hover:bg-gray-100 h-fit w-12 h-12 transition-all relative cursor-pointer">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6 absolute transition-all ${sidenavOpen ? "opacity-0 rotate-90" : "opacity-1 rotate-0"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
              </svg>

              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className={`size-6  absolute transition-all ${sidenavOpen ? "opacity-1 rotate-0" : "opacity-0 rotate-90"}`}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="w-full h-full p-10">
            <h1 className="mb-4 text-black text-xl">{selectedTab}</h1>
            <Brightness />

            {(() => {
              const Component = Components[selectedTab];
              if (!Component) return null;
              return <Component />
            })()}
          </div>
        </div>
      )}
    </div>
  );
};

export default Home;
