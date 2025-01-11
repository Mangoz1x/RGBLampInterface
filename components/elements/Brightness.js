import { useEffect, useState } from "react"
import CustomRangeSlider from "../bites/RangeSlider";
import { LampDB, runFunctionOnBroadcast, updateLampBrightness } from "@/utils/lampFunctions";
import { SubmitButton } from "../bites/Button";

export const Brightness = () => {
    const [brightness, setBrightness] = useState(0.2);
    const [loading, setLoading] = useState(false);

    const updateBrightness = () => {
        setLoading(true);
        updateLampBrightness(brightness).then(res => {
            setLoading(false);
        })
    }

    const loadDefault = async () => {
        const db = new LampDB();
        const result = await db.read(["set_brightness"]);
        if (result?.error) return;
        setBrightness(parseFloat((parseFloat(result?.result?.retrieved?.set_brightness?.brightness) || 0.2).toFixed(2)))
    }

    useEffect(() => {
        loadDefault();
    }, []);

    useEffect(() => {
        runFunctionOnBroadcast("effectUpdateBroadcasted", () => {
            updateBrightness();
        });
    }, [brightness]);

    return (
        <div className="pb-4">
            <div className="p-4 rounded-lg bg-gray-100">
                <p className="text-black">Brightness</p>
                <CustomRangeSlider
                    onChange={(newVal) => setBrightness(newVal / 100)}
                    initialValue={Math.round(brightness * 100)}
                />

                {brightness > 0.5 && (
                    <div className="mt-4 text-black rounded-lg p-4 bg-red-200 w-full h-fit">
                        <h2 className="text-2xl">Warning!</h2>
                        <p className="max-w-[800px]">Operating the lamp above 50% brightness can cause it to heat up rapidly, which may pose a fire hazard. Always supervise the lamp when used at these higher brightness levels and never leave it unattended.</p>
                    </div>
                )}
            </div>

            {/* <SubmitButton isLoading={loading} onClick={() => updateBrightness()} >
                Update Brightness
            </SubmitButton> */}
        </div>
    )
}
