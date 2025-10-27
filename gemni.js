
const API_KEY = "AIzaSyCH-lSk7eg2kl6je33US3pBMEbEDAP4et4";
const MODEL = "gemini-2.5-flash";

async function runGemini() {
    const url = `https://generativelanguage.googleapis.com/v1beta/models/${MODEL}:streamGenerateContent?key=${API_KEY}`;

    const body = {
        contents: [
            {
                role: "user",
                parts: [
                    { text: "Write a short funny poem about developers and coffee." }
                ]
            }
        ]
    };

    const res = await fetch(url, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(body)
    });

    const data = await res.json();
    console.log(JSON.stringify(data, null, 2));
}

runGemini().catch(console.error);
