export const SERVER_URL = 'http://lampraspberrypi.local:5000/';

export const checkServer = async (retryAmount = 5) => {
    let found = false;

    for (let i = 0; i < retryAmount; i++) {
        try {
            const res = await fetch(SERVER_URL, { method: "GET" }).then(res => res.text());

            if (res && res === 'WS2815 RGB Strip Control API') {
                found = true;
                break;
            }
        } catch (err) {
            console.log(err)
        }
    }

    if (found) {
        return { online: true };
    }

    return { online: false };
}