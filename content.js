// Function to calculate QOQ growth
function calculateQOQGrowth(currentValue, previousValue) {
    return ((currentValue - previousValue) / previousValue) * 100;
}

// Function to add QOQ Growth row
function addQOQGrowthRow() {
    const table = document.querySelector('#quarters .data-table');
    if (!table) return;

    // Find index of 'Net Profit' row
    const rows = Array.from(table.querySelectorAll('tbody tr'));
    const netProfitRowIndex = rows.findIndex(row => row.cells[0].innerText.trim().includes('Net Profit'));
    if (netProfitRowIndex === -1) return;

    // Extract Net Profit values
    const netProfitCells = rows[netProfitRowIndex].cells;
    const netProfitValues = Array.from(netProfitCells).slice(1).map(cell => parseFloat(cell.innerText));

    // Calculate QOQ Growth values
    const qoqGrowthValues = ['Not applicable'];
    for (let i = 1; i < netProfitValues.length; i++) {
        const currentValue = netProfitValues[i];
        const previousValue = netProfitValues[i - 1];
        qoqGrowthValues.push(!isNaN(currentValue) && !isNaN(previousValue) ? calculateQOQGrowth(currentValue, previousValue).toFixed(2) + '%' : 'N/A');
    }

    // Check if QOQ Growth row already exists
    if (rows.some(row => row.cells[0].innerText.trim() === 'QoQ Net Profit Growth %')) return;

    // Create new row for QOQ Growth
    const newRow = table.insertRow(netProfitRowIndex + 2);
    newRow.className = '';
    newRow.insertCell(0).outerHTML = '<td class="text" style="padding-left: 2.5rem;">QoQ Net Profit Growth %</td>';
    qoqGrowthValues.forEach(value => newRow.insertCell().innerText = value);
}

// Function to observe changes in the table
function observeTableChanges() {
    const table = document.querySelector('#quarters .data-table');
    if (!table) return;

    const observer = new MutationObserver(() => addQOQGrowthRow());
    observer.observe(table, { childList: true, subtree: true });
}

// Detect tables and observe changes
window.addEventListener('load', observeTableChanges);
