function generateDXF(points) {
    let dxf = [];
    
    // Header with units set to meters
    dxf.push('0\nSECTION');
    dxf.push('2\nHEADER');
    dxf.push('9\n$ACADVER');
    dxf.push('1\nAC1009');
    dxf.push('9\n$INSUNITS');
    dxf.push('70\n6');  // 6 = Meters
    dxf.push('9\n$LUNITS');
    dxf.push('70\n2');  // 2 = Decimal
    dxf.push('9\n$MEASUREMENT');
    dxf.push('70\n1');  // 1 = Metric
    dxf.push('0\nENDSEC');
    
    // Define the block
    dxf.push('0\nSECTION');
    dxf.push('2\nBLOCKS');
    
    // Point block definition
    dxf.push('0\nBLOCK');
    dxf.push('8\n0');
    dxf.push('2\nPOINT_BLOCK');  // Block name
    dxf.push('70\n0');
    dxf.push('10\n0.0');
    dxf.push('20\n0.0');
    dxf.push('30\n0.0');
    
    // X symbol using lines (replacing circle)
    // First line of X (bottom-left to top-right)
    dxf.push('0\nLINE');
    dxf.push('8\n0');
    dxf.push('10\n-0.1');
    dxf.push('20\n-0.1');
    dxf.push('30\n0.0');
    dxf.push('11\n0.1');
    dxf.push('21\n0.1');
    dxf.push('31\n0.0');
    
    // Second line of X (top-left to bottom-right)
    dxf.push('0\nLINE');
    dxf.push('8\n0');
    dxf.push('10\n-0.1');
    dxf.push('20\n0.1');
    dxf.push('30\n0.0');
    dxf.push('11\n0.1');
    dxf.push('21\n-0.1');
    dxf.push('31\n0.0');
    
    // Attribute definition
    dxf.push('0\nATTDEF');
    dxf.push('8\n0');
    dxf.push('10\n0.0');
    dxf.push('20\n0.15');  // Adjusted text position
    dxf.push('30\n0.0');
    dxf.push('40\n0.1');  // Text height
    dxf.push('1\nDESCRIPTION');  // Attribute prompt
    dxf.push('2\nDESC');         // Attribute tag
    dxf.push('3\n');             // Default value
    dxf.push('70\n0');           // Attribute flags
    
    dxf.push('0\nENDBLK');
    dxf.push('0\nENDSEC');
    
    // Tables section
    dxf.push('0\nSECTION');
    dxf.push('2\nTABLES');
    dxf.push('0\nTABLE');
    dxf.push('2\nLTYPE');
    dxf.push('70\n1');
    dxf.push('0\nLTYPE');
    dxf.push('2\nCONTINUOUS');
    dxf.push('70\n64');
    dxf.push('3\nSolid line');
    dxf.push('72\n65');
    dxf.push('73\n0');
    dxf.push('40\n0.0');
    dxf.push('0\nENDTAB');
    dxf.push('0\nENDSEC');
    
    // Entities section
    dxf.push('0\nSECTION');
    dxf.push('2\nENTITIES');
    
    points.forEach(point => {
        // Insert block for each point
        dxf.push('0\nINSERT');
        dxf.push('8\n0');
        dxf.push('2\nPOINT_BLOCK');  // Block name
        dxf.push('66\n1');           // Attributes follow flag
        dxf.push('10\n' + point.easting);
        dxf.push('20\n' + point.northing);
        dxf.push('30\n' + point.elevation);
        dxf.push('41\n1.0');  // X scale
        dxf.push('42\n1.0');  // Y scale
        dxf.push('43\n1.0');  // Z scale
        dxf.push('50\n0.0');  // Rotation
        
        // Add attribute
        dxf.push('0\nATTRIB');
        dxf.push('8\n0');
        dxf.push('10\n' + point.easting);
        dxf.push('20\n' + (point.northing + 0.2));
        dxf.push('30\n' + point.elevation);
        dxf.push('40\n0.1');  // Text height
        dxf.push('1\n' + (point.description ? point.description.trim() : ''));  // Attribute value
        dxf.push('2\nDESC');  // Attribute tag
        dxf.push('70\n0');    // Attribute flags
        
        dxf.push('0\nSEQEND');
    });
    
    dxf.push('0\nENDSEC');
    dxf.push('0\nEOF');
    
    return dxf.join('\n');
}
