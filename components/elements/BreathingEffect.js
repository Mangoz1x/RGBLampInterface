import { LampDB, rgbToHex, startBreathingEffect } from "@/utils/lampFunctions";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful"
import { SubmitButton } from "../bites/Button";
import CustomRangeSlider from "../bites/RangeSlider";

export const BreathingEffect = () => {
    const [color, setColor] = useState("#aabbcc");
    const [loading, setLoading] = useState(false);
    const [speed, setSpeed] = useState();

    const loadDefault = async () => {
        setLoading(true);
        const db = new LampDB();
        const result = await db.read(["breathing_effect"]);
        setLoading(false);
        if (result?.error) return;

        setSpeed(result?.result?.retrieved?.breathing_effect?.steps || 70);
        const savedValue = result?.result?.retrieved?.color_fill?.color || [100, 0, 0];
        setColor(rgbToHex(savedValue[0], savedValue[1], savedValue[2]));
    }

    useEffect(() => {
        loadDefault();
    }, []);

    return (
        <div className="w-full h-fit">
            <HexColorPicker color={color} onChange={setColor} />

            <div className="flex flex-col gap-2 mt-4 rounded-lg bg-gray-100 p-4">
                <label className="text-black">Speed</label>

                <div className="text-black px-4  mt-4 text-xs flex justify-between w-full">
                    <span>Fast</span>
                    <span>Medium</span>
                    <span>Mega Slow</span>
                </div>
        
                <CustomRangeSlider onChange={(percentage) => setSpeed(Math.min(Math.max(10, percentage + 10)), 110)} initialValue={speed - 10} hidePercentage={true} />
            </div>

            <SubmitButton isLoading={loading} onClick={() => {
                setLoading(true);
                startBreathingEffect(color, speed).then(res => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 300)
                })
            }}>
                Update Effect
            </SubmitButton>
        </div>
    )
}