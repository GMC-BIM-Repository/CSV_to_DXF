document.addEventListener('DOMContentLoaded', () => {
    const fileInput = document.getElementById('file-input');
    const convertBtn = document.getElementById('convert-btn');
    const status = document.getElementById('status');
    const downloadBtn = document.getElementById('download-btn');
    let currentDxfContent = null;

    convertBtn.addEventListener('click', () => {
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
                const points = parseCSV(e.target.result);
                if (points.length === 0) {
                    throw new Error('No valid points found in CSV');
                }
                currentDxfContent = generateDXF(points);
                status.textContent = `Successfully converted ${points.length} points`;
                downloadBtn.style.display = 'inline-block';
            } catch (error) {
                status.textContent = 'Error processing file: ' + error.message;
                downloadBtn.style.display = 'none';
            }
        };

        reader.onerror = () => {
            status.textContent = 'Error reading file';
            downloadBtn.style.display = 'none';
        };

        reader.readAsText(file);
    }

    downloadBtn.addEventListener('click', () => {
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
        }
    });
});
