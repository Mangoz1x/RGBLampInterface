'use client';

import { startLampRainbowCycle } from "@/utils/lampFunctions";

export const RainbowCycle = () => {
    return (
        <div>
            <button onClick={() => startLampRainbowCycle()} className="px-4 py-4 transition-all mt-4 hover:bg-gray-950 w-full bg-black rounded-lg">
                Start Rainbow Cycle
            </button>
        </div>
    )
}