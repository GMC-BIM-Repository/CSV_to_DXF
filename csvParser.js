function getFormatIndices(format) {
    const formats = {
        'pnend': { point: 0, north: 1, east: 2, elev: 3, desc: 4 },
        'pend': { point: 0, east: 1, north: 2, elev: 3, desc: 4 },
        'endzp': { east: 0, north: 1, desc: 2, elev: 3, point: 4 },
        'endp': { east: 0, north: 1, desc: 2, point: 3, elev: -1 }
    };

    return formats[format] || formats['pend'];
}

function parseCSV(content) {
    const lines = content.split(/\r\n|\n/).filter(line => line.trim());
    const format = document.getElementById('format-select').value;
    const indices = getFormatIndices(format);
    const data = [];
    
    const firstLine = lines[0].split(',').map(item => item.trim());
    const hasHeaders = isHeader(firstLine);
    const startIndex = hasHeaders ? 1 : 0;
    
    for (let i = startIndex; i < lines.length; i++) {
        const values = lines[i].split(',').map(item => item.trim());
        
        try {
            const point = {
                pointNumber: values[indices.point] || '',
                easting: parseFloat(values[indices.east]),
                northing: parseFloat(values[indices.north]),
                elevation: indices.elev >= 0 ? parseFloat(values[indices.elev]) : 0,
                description: values[indices.desc] || ''
            };
            
            if (!isNaN(point.easting) && !isNaN(point.northing)) {
                data.push(point);
            }
        } catch (error) {
            console.warn(`Skipping invalid line ${i + 1}`);
        }
    }
    
    return data;
}

function isHeader(line) {
    const headerTerms = ['point', 'easting', 'northing', 'elev', 'desc'];
    const lineStr = line.join(',').toLowerCase();
    return headerTerms.some(term => lineStr.includes(term));
}
