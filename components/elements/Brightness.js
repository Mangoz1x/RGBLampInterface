import { useEffect, useState } from "react"
import CustomRangeSlider from "../bites/RangeSlider";
import { LampDB, updateLampBrightness } from "@/utils/lampFunctions";
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

    return (
        <div className="pt-20">
            <p className="text-black">Brightness</p>
            <CustomRangeSlider
                onChange={(newVal) => setBrightness(newVal / 100)}
                initialValue={Math.round(brightness * 100)}
            />

            <SubmitButton isLoading={loading} onClick={() => updateBrightness()} >
                Update Brightness
            </SubmitButton>
        </div>
    )
}
