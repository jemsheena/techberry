const video = document.getElementById("camera-feed");
const scanBtn = document.getElementById("scan-btn");
const resultText = document.getElementById("result");

const socket = io.connect("http://localhost:5000");

// Start camera stream
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" } })
    .then((stream) => {
        video.srcObject = stream;
    })
    .catch((err) => console.error("Camera access denied:", err));

scanBtn.addEventListener("click", async () => {
    const canvas = document.createElement("canvas");
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext("2d");

    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);

    const code = jsQR(imageData.data, canvas.width, canvas.height);

    if (code) {
        resultText.innerText = `QR Code: ${code.data}`;
        validateTicket(code.data);
    } else {
        resultText.innerText = "No QR code detected.";
    }
});

// Send QR code to backend for validation
async function validateTicket(ticketId) {
    try {
        const response = await fetch("http://localhost:5000/api/tickets/validate", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ticketId })
        });

        const result = await response.json();
        if (response.ok) {
            resultText.innerText = `Ticket Validated: ${ticketId}`;
            socket.emit("ticketValidated", { ticketId, destination: result.ticket.to });
        } else {
            resultText.innerText = "Invalid ticket!";
            alert("ALERT! Unauthorized passenger detected.");
        }
    } catch (error) {
        console.error("Error:", error);
    }
}
