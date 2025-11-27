/**
 * Multi-Unit Splitter
 * Handles cells that contain multiple units separated by /
 */

export interface SplitUnit {
    unitCode: string;
    unitName?: string;
    lecturer?: string;
    room?: string;
}

/**
 * Splits a cell containing multiple units into separate parts
 * Example:
 * "MBChB 113 / MBChB 114
 *  Anatomy / Physiology
 *  CR5
 *  Dr Mwangi / Dr Wanjiku"
 * 
 * Returns: [{unitCode: "MBChB 113", unitName: "Anatomy", ...}, ...]
 */
export function splitMultiUnit(cellText: string): SplitUnit[] {
    const lines = cellText.split('\n').map(l => l.trim()).filter(l => l.length > 0);

    if (lines.length === 0) return [];

    // Split each line by /
    const splitLines = lines.map(line =>
        line.split('/').map(part => part.trim())
    );

    // Find the line with most parts (usually unit codes)
    const maxParts = Math.max(...splitLines.map(parts => parts.length));

    if (maxParts === 1) {
        // No multi-unit detected
        return [{
            unitCode: splitLines[0][0],
            unitName: splitLines[1]?.[0],
            lecturer: splitLines[2]?.[0],
            room: splitLines[3]?.[0],
        }];
    }

    // Create an array of units
    const units: SplitUnit[] = [];

    for (let i = 0; i < maxParts; i++) {
        units.push({
            unitCode: splitLines[0]?.[i] || '',
            unitName: splitLines[1]?.[i],
            lecturer: splitLines[2]?.[i] || splitLines[2]?.[0], // Reuse single value if not split
            room: splitLines[3]?.[i] || splitLines[3]?.[0],     // Reuse single value if not split
        });
    }

    return units.filter(u => u.unitCode.length > 0);
}

/**
 * Check if a cell text contains multiple units
 */
export function hasMultipleUnits(cellText: string): boolean {
    const firstLine = cellText.split('\n')[0];
    return firstLine.includes('/');
}
