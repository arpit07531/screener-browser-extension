// Function to calculate QOQ growth
function calculateQOQGrowth(currentValue, previousValue) {
    const growth = ((currentValue - previousValue) / previousValue) * 100;
    console.log(`Calculating QOQ Growth: Current Value = ${currentValue}, Previous Value = ${previousValue}, Growth = ${growth}%`);
    return growth;
}

// Function to add QOQ Growth row
function addQOQGrowthRow() {
    console.log('Starting to add QOQ Growth row...');
    
    // Identify and select your table
    const table = document.querySelector('#quarters .data-table');
    console.log('Table found:', table);

    if (!table) {
        console.log('Table not found.');
        return;
    }

    // Find index of 'Net Profit' row
    let netProfitRowIndex;
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    rows.forEach((row, index) => {
        console.log(`Inspecting row ${index}: ${row.cells[0].innerText.trim()}`);
        if (row.cells[0].innerText.trim().includes('Net Profit')) {
            netProfitRowIndex = index;
        }
    });

    if (netProfitRowIndex === undefined) {
        console.log('Net Profit row not found.');
        return;
    }
    console.log('Net Profit row index:', netProfitRowIndex);

    // Extract Net Profit values
    const netProfitValues = [];
    const netProfitCells = rows[netProfitRowIndex].cells;
    
    for (let i = 1; i < netProfitCells.length; i++) { // Assuming first cell is label
        const value = parseFloat(netProfitCells[i].innerText.replace(/,/g, ''));
        netProfitValues.push(value);
        console.log(`Extracted Net Profit value for column ${i}: ${value}`);
    }

    // Calculate QOQ Growth values
    const qoqGrowthValues = ['Not applicable']; // First column is "Not applicable"
    
    for (let i = 1; i < netProfitValues.length; i++) { // Start from second column to compare with previous quarter
        const currentValue = netProfitValues[i];
        const previousValue = netProfitValues[i - 1];
        if (!isNaN(currentValue) && !isNaN(previousValue)) {
            const growth = calculateQOQGrowth(currentValue, previousValue);
            qoqGrowthValues.push(growth.toFixed(2) + '%');
        } else {
            qoqGrowthValues.push('N/A');
        }
    }
    console.log('QOQ Growth values:', qoqGrowthValues);

    // Check if QOQ Growth row already exists
    const existingRow = Array.from(table.querySelectorAll('tbody tr')).find(row => row.cells[0].innerText.trim() === 'QoQ Profit Growth %');
    if (existingRow) {
        console.log('QoQ Profit Growth % row already exists.');
        return;
    }

    // Create new row for QOQ Growth
    const newRow = table.insertRow(netProfitRowIndex + 2); // Insert after dynamically added row
    newRow.className = ''; // Match the class of the existing row
    const newCell = newRow.insertCell(0);
    newCell.className = 'text';
    newCell.style.paddingLeft = '2.5rem';
    newCell.innerText = 'QoQ Profit Growth %';

    for (let i = 0; i < qoqGrowthValues.length; i++) {
        const cell = newRow.insertCell(i + 1);
        cell.innerText = qoqGrowthValues[i];
        console.log(`Inserted QOQ Growth value for column ${i + 1}: ${qoqGrowthValues[i]}`);
    }

    console.log('Finished adding QOQ Growth row.');
}

// Function to observe changes in the table
function observeTableChanges() {
    const table = document.querySelector('#quarters .data-table');
    if (!table) {
        console.log('Table not found.');
        return;
    }

    const observer = new MutationObserver((mutations) => {
        mutations.forEach((mutation) => {
            if (mutation.addedNodes.length) {
                console.log('Detected changes in the table.');
                addQOQGrowthRow();
                observer.disconnect(); // Stop observing after adding the row
            }
        });
    });

    observer.observe(table, { childList: true, subtree: true });
}

// Detect tables and observe changes
window.addEventListener('load', () => {
    console.log('Window loaded, detecting tables...');
    observeTableChanges();
});
