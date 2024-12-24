import { SERVER_URL } from "./serverAvailability";

const hexToRgb = (hex) => {
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

const sendRepeatedRequest = async (retries = 10, body, endpoint) => {
    let updated = false;
    let result = "There was an error trying to update the color.";

    for (let i = 0; i < retries; i++) {
        try {
            let r = await fetch(`${SERVER_URL}${endpoint}`, {
                method: "POST",
                headers: {
                    'Content-Type': 'application/json'
                },
                body: body
            }).then(res => res.text());

            const data = JSON.parse(result);
            if (data.status) {
                updated = true;
                result = r;
                break;
            }
        } catch (err) {
            console.log(err.message);
        }
    }
}

export const fillLampColor = async (hex) => {
    const c = hexToRgb(hex);
    console.log(c)

    sendRepeatedRequest(
        10,
        JSON.stringify({
            "color": [c.r, c.g, c.b]
        }),
        'color_fill'
    )
}