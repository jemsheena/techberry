const express = require('express');
const bodyParser = require('body-parser');
const multer = require('multer');
const path = require('path');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);
const port = 5000;

app.use(bodyParser.json());
app.use(express.static('public'));

// Ticket storage
let tickets = [];

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => cb(null, Date.now() + path.extname(file.originalname)),
});

const upload = multer({ storage });

// Generate tickets
app.post('/api/tickets/generate', (req, res) => {
    const { from, to, passengers, ticketId } = req.body;
    const ticket = { from, to, passengers, ticketId, status: 'OnBoard' };
    tickets.push(ticket);

    io.emit('ticketData', tickets); // Notify bus interface
    res.json({ ticket });
});

// Upload PDF
app.post('/api/pdf/upload', upload.single('pdf'), (req, res) => {
    if (req.file) {
        res.json({ message: 'PDF file uploaded successfully', filename: req.file.filename });
    } else {
        res.status(400).json({ message: 'No file uploaded.' });
    }
});

// Exit ticket
app.post('/api/tickets/exit', (req, res) => {
    const { ticketId } = req.body;
    const ticket = tickets.find(t => t.ticketId === ticketId);

    if (ticket) {
        ticket.status = 'Exited';
        res.json({ message: 'Successfully exited.', ticket });
    } else {
        res.status(400).json({ message: 'Ticket not found.' });
    }
});

// WebSocket connection
io.on('connection', (socket) => {
    console.log('Bus interface connected');
    socket.emit('ticketData', tickets);

    socket.on('disconnect', () => {
        console.log('Bus interface disconnected');
    });
});

server.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
