'use client';

import { fillLampColor } from "@/utils/lampFunctions";
import { useState } from "react";
import { HexColorPicker } from "react-colorful";

const SolidColor = () => {
    const [color, setColor] = useState("#aabbcc");

    return (
        <div>
            <HexColorPicker color={color} onChange={setColor} />

            <button onClick={() => fillLampColor(color)} className="px-4 py-4 transition-all mt-4 hover:bg-gray-950 w-full bg-black rounded-lg">
                Update Color
            </button>
        </div>
    )
}

export default SolidColor;