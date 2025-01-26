const socket = io();

socket.on('ticketData', (tickets) => {
    const tableBody = document.getElementById('ticket-table');
    tableBody.innerHTML = ''; // Clear existing rows

    tickets.forEach(ticket => {
        const row = document.createElement('tr');
        row.innerHTML = `
            <td>${ticket.from}</td>
            <td>${ticket.to}</td>
            <td>${ticket.passengers}</td>
            <td>${ticket.ticketId}</td>
            <td>${ticket.status}</td>
        `;
        tableBody.appendChild(row);
    });
});
