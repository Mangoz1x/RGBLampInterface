import { useState } from "react"
import CustomRangeSlider from "../bites/RangeSlider";
import { updateLampBrightness } from "@/utils/lampFunctions";

export const Brightness = () => {
    const [brightness, setBrightness] = useState(0.2);

    const updateBrightness = () => {
        updateLampBrightness(brightness)
    }

    return (
        <div className="pt-20">
            <p className="text-black">Brightness</p>
            <CustomRangeSlider onChange={(newVal) => setBrightness(newVal / 100)} />

            <button onClick={() => updateBrightness()} className="px-4 py-4 transition-all mt-4 hover:bg-gray-950 w-full bg-black rounded-lg">
                Update Brightness
            </button>
        </div>
    )
}
