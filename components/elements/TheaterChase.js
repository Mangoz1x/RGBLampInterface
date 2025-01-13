'use client';

import { hexToRgb, LampDB, rgbObjectToArray, rgbToHex, startTheaterChase } from "@/utils/lampFunctions";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { SubmitButton } from "../bites/Button";
import CustomRangeSlider from "../bites/RangeSlider";

export const TheaterChase = () => {
    const [primaryColor, setPrimaryColor] = useState("#aabbcc");
    const [secondaryColor, setSecondaryColor] = useState("#aabbcc");
    const [speed, setSpeed] = useState(0.1); // 0.1-1.1
    const [loading, setLoading] = useState(false);

    const loadDefault = async () => {
        setLoading(true);
        const db = new LampDB();
        const result = await db.read(["theater_chase"]);
        setLoading(false);
        if (result?.error) return;
        const retrievedData = result?.result?.retrieved?.theater_chase;
        const primaryColor = retrievedData?.color;
        const secondaryColor = retrievedData?.alternate_color;
        const wait = retrievedData?.wait;

        if (primaryColor) setPrimaryColor(rgbToHex(...primaryColor));
        if (secondaryColor) setSecondaryColor(rgbToHex(...secondaryColor));
        if (wait) setSpeed(wait);
    }

    useEffect(() => {
        loadDefault();
    }, []);

    return (
        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 text-black w-full gap-4">
                <div className="flex flex-col gap-1">
                    <span>Primary color</span>
                    <HexColorPicker color={primaryColor} onChange={setPrimaryColor} />
                </div>
                <div className="flex flex-col gap-1">
                    <span>Secondary color</span>
                    <HexColorPicker color={secondaryColor} onChange={setSecondaryColor} />
                </div>
            </div>

            <div className="text-black bg-gray-100 rounded-lg p-4 mt-4">
                <span>Speed ({speed})</span>
                <div className="flex justify-between px-4 mt-4">
                    <span>Cheetah</span>
                    <span>Medium</span>
                    <span>Sloth</span>
                </div>
                <CustomRangeSlider initialValue={(speed * 100) - 10} onChange={(value) => setSpeed(parseFloat(((value + 10) / 100).toFixed(2)))} hidePercentage={true} />
            </div>

            <SubmitButton isLoading={loading} onClick={() => {
                setLoading(true);

                const primaryRgb = rgbObjectToArray(hexToRgb(primaryColor));
                const secondaryRgb = rgbObjectToArray(hexToRgb(secondaryColor));

                startTheaterChase(secondaryRgb, primaryRgb, speed).then(res => {
                    setLoading(false);
                })
            }}>
                Update Effect
            </SubmitButton>
        </div>
    )
}