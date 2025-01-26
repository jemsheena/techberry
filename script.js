// Function to generate ticket and QR code
function generateTicket() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const passengers = document.getElementById("passengers").value;

    if (!from || !to || !passengers) {
        alert("Please fill all fields.");
        return;
    }

    // Generate unique ticket ID
    const ticketId = "TKT-" + Date.now();

    // Display ticket details
    document.getElementById("ticket-from").innerText = from;
    document.getElementById("ticket-to").innerText = to;
    document.getElementById("ticket-passengers").innerText = passengers;
    document.getElementById("ticket-id").innerText = ticketId;

    // Show the ticket section
    document.getElementById("ticket").classList.remove("hidden");

    // Generate QR code with ticket data
    const qrData = JSON.stringify({ from, to, passengers, ticketId });
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 150,
        height: 150
    });

    alert("Ticket generated successfully!");
}
// Function to generate ticket and QR code
function generateTicket() {
    const from = document.getElementById("from").value;
    const to = document.getElementById("to").value;
    const passengers = document.getElementById("passengers").value;

    if (!from || !to || !passengers) {
        alert("Please fill all fields.");
        return;
    }

    // Generate unique ticket ID
    const ticketId = "TKT-" + Date.now();

    // Display ticket details
    document.getElementById("ticket-from").innerText = from;
    document.getElementById("ticket-to").innerText = to;
    document.getElementById("ticket-passengers").innerText = passengers;
    document.getElementById("ticket-id").innerText = ticketId;

    // Show the ticket section
    document.getElementById("ticket").classList.remove("hidden");

    // Generate QR code with ticket data
    const qrData = JSON.stringify({ from, to, passengers, ticketId });
    document.getElementById("qrcode").innerHTML = "";
    new QRCode(document.getElementById("qrcode"), {
        text: qrData,
        width: 150,
        height: 150
    });

    alert("Ticket generated successfully!");
}

// Function to download ticket as PDF
function downloadPDF() {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();

    const from = document.getElementById("ticket-from").innerText;
    const to = document.getElementById("ticket-to").innerText;
    const passengers = document.getElementById("ticket-passengers").innerText;
    const ticketId = document.getElementById("ticket-id").innerText;

    doc.setFont("helvetica", "bold");
    doc.setFontSize(20);
    doc.text("Bus Ticket", 80, 20);

    doc.setFontSize(14);
    doc.text(`From: ${from}`, 20, 40);
    doc.text(`To: ${to}`, 20, 50);
    doc.text(`Passengers: ${passengers}`, 20, 60);
    doc.text(`Ticket ID: ${ticketId}`, 20, 70);

    // Convert QR code canvas to image and add it to PDF
    const qrCanvas = document.querySelector("#qrcode canvas");
    const qrImage = qrCanvas.toDataURL("image/png");

    doc.addImage(qrImage, "PNG", 60, 80, 90, 90);

    doc.save(`Bus_Ticket_${ticketId}.pdf`);
}
