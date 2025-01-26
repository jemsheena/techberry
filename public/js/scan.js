let currentTicketId = '';

// Start the QR code scanner
function startScanner() {
    const codeReader = new ZXing.BrowserQRCodeReader();

    codeReader.getVideoInputDevices()
        .then((videoInputDevices) => {
            const selectedDeviceId = videoInputDevices[0].deviceId;

            codeReader.decodeOnceFromVideoDevice(selectedDeviceId, 'video')
                .then((result) => {
                    const ticketData = JSON.parse(result.text);
                    const { from, to, passengers, ticketId } = ticketData;

                    // Display ticket details
                    document.getElementById('from').textContent = from;
                    document.getElementById('to').textContent = to;
                    document.getElementById('passengers').textContent = passengers;
                    document.getElementById('ticketId').textContent = ticketId;

                    currentTicketId = ticketId;

                    // Send ticket data to the bus interface
                    fetch('/api/tickets/generate', {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(ticketData),
                    })
                    .then(response => response.json())
                    .then(() => {
                        alert('Ticket uploaded and validated successfully!');
                        document.getElementById('exitBus').style.display = 'inline-block';
                    })
                    .catch(error => {
                        console.error('Error uploading ticket:', error);
                        alert('Failed to upload ticket.');
                    });
                })
                .catch((err) => {
                    console.error('QR Code scanning failed:', err);
                    alert('Failed to scan the ticket. Please try again.');
                });
        })
        .catch((err) => {
            console.error('No video input devices found:', err);
            alert('No camera found. Please enable camera access.');
        });
}

// Upload PDF file
document.getElementById('upload-pdf').addEventListener('click', function () {
    const file = document.getElementById('pdf').files[0];

    if (file) {
        const formData = new FormData();
        formData.append('pdf', file);

        fetch('/api/pdf/upload', {
            method: 'POST',
            body: formData,
        })
        .then(response => response.json())
        .then(() => {
            alert('PDF file uploaded successfully!');
        })
        .catch(error => {
            console.error('Error uploading PDF:', error);
            alert('Failed to upload PDF file.');
        });
    } else {
        alert('Please select a PDF file first.');
    }
});

// Exit Bus button click
document.getElementById('exitBus').addEventListener('click', function () {
    fetch('/api/tickets/exit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ticketId: currentTicketId }),
    })
    .then(response => response.json())
    .then(() => {
        alert('Successfully exited the bus.');
        document.getElementById('exitBus').style.display = 'none';
    })
    .catch(error => {
        console.error('Error during exit:', error);
        alert('Failed to exit the bus.');
    });
});

// Initialize the scanner
document.addEventListener('DOMContentLoaded', function () {
    startScanner();
});
