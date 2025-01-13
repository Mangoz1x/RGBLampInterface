import { SERVER_URL } from "./serverAvailability";

const broadcastEffectUpdate = () => {
    // Broadcast a run event
    window.dispatchEvent(new CustomEvent("effectUpdateBroadcasted", { detail: {} }));
}

const sendRepeatedRequest = async (retries = 10, body, endpoint) => {
    let updated = false;
    let result = "There was an error attempting the update.";

    for (let i = 0; i < retries; i++) {
        try {
            let r = await fetch(`${SERVER_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            });

            if (r.status === 400) {
                updated = false;
                result = r.statusText;
                break;
            }

            const tr = await r.text();
            const data = JSON.parse(tr);

            if (r.status === 200 && tr) {
                updated = true;
                result = data;
                break;
            }
        } catch (err) {
        }
    }

    if (updated) {
        return { updated, result };
    }

    return { error: result }
}

export const runFunctionOnBroadcast = (eventName, func = () => { }) => {
    window.listeningTo = window.listeningTo || {};
    if (window.listeningTo[eventName]) {
        window.removeEventListener(eventName, window.listeningTo[eventName]);
    };
    window.listeningTo[eventName] = func;
    window.addEventListener(eventName, func);
}

export const hexToRgb = (hex) => {
    // Remove leading '#' if present
    hex = hex.replace(/^#/, '');

    // Check for valid length (3 or 6 characters)
    if (![3, 6].includes(hex.length)) {
        console.error('Invalid hex color format. Use 3 or 6 characters.');
        return null;
    }

    // If 3 characters, expand to 6 characters (e.g., "03F" -> "0033FF")
    if (hex.length === 3) {
        hex = hex.split('').map(char => char + char).join('');
    }

    // Validate that all characters are valid hex digits
    const validHex = /^[0-9A-Fa-f]{6}$/;
    if (!validHex.test(hex)) {
        console.error('Invalid hex color. Only hexadecimal digits (0-9, A-F) are allowed.');
        return null;
    }

    // Convert hex pairs to decimal values
    const bigint = parseInt(hex, 16);
    const r = (bigint >> 16) & 255; // Extract the red component
    const g = (bigint >> 8) & 255;  // Extract the green component
    const b = bigint & 255;         // Extract the blue component

    return { r, g, b };
}

export const rgbObjectToArray = (obj) => {
    return [obj.r, obj.g, obj.b];
}

export const rgbToHex = (r, g, b) => {
    // Ensure the RGB values are within the valid range (0-255)
    if ((r < 0 || r > 255) || (g < 0 || g > 255) || (b < 0 || b > 255)) {
        throw new Error('Invalid RGB value. Each value must be between 0 and 255.');
    }

    // Convert each RGB value to a 2-character hexadecimal string
    const toHex = (value) => {
        const hex = value.toString(16).toUpperCase();
        return hex.length === 1 ? '0' + hex : hex;
    };

    // Combine the hex values for R, G, and B
    return `#${toHex(r)}${toHex(g)}${toHex(b)}`;
}

export const fillLampColor = async (hex) => {
    const c = hexToRgb(hex);

    broadcastEffectUpdate();

    const response = await sendRepeatedRequest(
        10,
        JSON.stringify({
            "color": [c.r, c.g, c.b]
        }),
        'color_fill'
    );

    return response;
}

export const startBreathingEffect = async (hex, speed = 10) => {
    if (speed < 10) return { error: "Speed must be greater than or equal to 10" };
    if (speed > 110) return { error: "Speed must be less than or equal to  110" }

    const c = hexToRgb(hex);

    broadcastEffectUpdate();

    const response = await sendRepeatedRequest(
        10,
        JSON.stringify({
            "color": [c.r, c.g, c.b],
            "steps": speed,
            "wait": 0.03
        }),
        'breathing_effect'
    );

    return response;
}

export const startLampRainbowCycle = async (gradientSteps = 20, colors = [[255, 0, 0], [0, 255, 0], [0, 0, 255]], wait = 0.05) => {
    broadcastEffectUpdate();

    const response = await sendRepeatedRequest(
        10,
        JSON.stringify({
            gradient_steps: gradientSteps,
            colors,
            wait
        }),
        "rainbow_cycle"
    );

    return response;
}

export const startTheaterChase = async (primaryColor, secondaryColor, wait = 0.05) => {
    broadcastEffectUpdate();

    const response = await sendRepeatedRequest(
        10,
        JSON.stringify({
            color: primaryColor,
            alternate_color: secondaryColor,
            wait
        }),
        "theater_chase"
    );

    return response;
}

export const powerOff = async () => {
    const response = await sendRepeatedRequest(
        10,
        JSON.stringify({}),
        "stop"
    );

    return response;
}

// Brightness
export const updateLampBrightness = async (brightnessDecimal = 0.2) => {
    if (brightnessDecimal <= 0) return { error: "Value must be greater than zero." };
    if (brightnessDecimal > 1) return { error: "Value must be less than one." };

    const response = await sendRepeatedRequest(
        10,
        JSON.stringify({
            brightness: brightnessDecimal
        }),
        "set_brightness"
    );
}

// Lamp DB
export class LampDB {
    constructor() { }

    async write(key, value) {
        const val = await sendRepeatedRequest(
            10,
            JSON.stringify({
                key,
                value
            }),
            "write"
        );

        return val;
    }

    async read(keys) {
        const val = await sendRepeatedRequest(
            10,
            JSON.stringify({
                keys
            }),
            "retrieve"
        );

        return val;
    }

    async delete(keys) {
        const val = await sendRepeatedRequest(
            10,
            JSON.stringify({
                keys
            }),
            "delete"
        );

        return val;
    }
}