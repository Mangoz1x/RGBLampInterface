'use client';

import { fillLampColor, LampDB, rgbToHex } from "@/utils/lampFunctions";
import { useEffect, useState } from "react";
import { HexColorPicker } from "react-colorful";
import { SubmitButton } from "../bites/Button";

const SolidColor = () => {
    const [color, setColor] = useState("#aabbcc");
    const [loading, setLoading] = useState(false);

    const loadDefault = async () => {
        setLoading(true);
        const db = new LampDB();
        const result = await db.read(["color_fill"]);
        setLoading(false);
        if (result?.error) return;
        const savedValue = result?.result?.retrieved?.color_fill?.color; 
        setColor(rgbToHex(savedValue[0], savedValue[1], savedValue[2]));
    }

    useEffect(() => {
        loadDefault();
    }, []);

    return (
        <div>
            <HexColorPicker color={color} onChange={setColor} />

            <SubmitButton isLoading={loading} onClick={() => {
                setLoading(true);
                fillLampColor(color).then(res => {
                    setTimeout(() => {
                        setLoading(false);
                    }, 300)
                })
            }}>
                Update Color
            </SubmitButton>
        </div>
    )
}

export default SolidColor;