// Add console log at beginning to confirm script is loading
console.log('App.js loaded');

document.addEventListener('DOMContentLoaded', () => {
    console.log('DOM fully loaded');
    
    const fileInput = document.getElementById('file-input');
    const convertBtn = document.getElementById('convert-btn');
    const status = document.getElementById('status');
    const downloadBtn = document.getElementById('download-btn');
    
    // Verify elements were found
    if (!fileInput || !convertBtn || !status || !downloadBtn) {
        console.error('Could not find all required DOM elements');
        if (status) status.textContent = 'Error: UI elements not found';
        return;
    }
    
    console.log('All DOM elements found');
    
    let currentDxfContent = null;

    convertBtn.addEventListener('click', () => {
        console.log('Convert button clicked');
        const file = fileInput.files[0];
        if (!file) {
            status.textContent = 'Please select a CSV file first';
            return;
        }
        processFile(file);
    });

    function processFile(file) {
        if (!file.name.endsWith('.csv')) {
            status.textContent = 'Please select a CSV file';
            return;
        }

        status.textContent = 'Converting...';
        downloadBtn.style.display = 'none';

        const reader = new FileReader();
        reader.onload = (e) => {
            try {
                console.log('File loaded, parsing CSV');
                const points = parseCSV(e.target.result);
                if (points.length === 0) {
                    throw new Error('No valid points found in CSV');
                }
                console.log(`Parsed ${points.length} points`, points[0]);
                
                console.log('Generating DXF');
                currentDxfContent = generateDXF(points);
                console.log('DXF generated');
                
                status.textContent = `Successfully converted ${points.length} points`;
                downloadBtn.style.display = 'inline-block';
            } catch (error) {
                console.error('Error processing file:', error);
                status.textContent = 'Error processing file: ' + error.message;
                downloadBtn.style.display = 'none';
            }
        };

        reader.onerror = (error) => {
            console.error('FileReader error:', error);
            status.textContent = 'Error reading file';
            downloadBtn.style.display = 'none';
        };

        console.log('Starting file read');
        reader.readAsText(file);
    }

    downloadBtn.addEventListener('click', () => {
        console.log('Download button clicked');
        if (currentDxfContent) {
            const blob = new Blob([currentDxfContent], { type: 'application/dxf' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'output.dxf';
            document.body.appendChild(a);
            a.click();
            document.body.removeChild(a);
            URL.revokeObjectURL(url);
            console.log('Download initiated');
        }
    });
    
    // Add some initial status to confirm JavaScript is running
    status.textContent = 'Ready to convert CSV files';
    console.log('App initialization complete');
});
