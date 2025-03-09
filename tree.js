const fs = require('fs');
const path = require('path');

function generateTree(startPath, indent = '', excludePatterns = ['node_modules', '.next']) {
    let output = '';
    const files = fs.readdirSync(startPath);

    files.forEach((file, index) => {
        const filePath = path.join(startPath, file);
        
        // Skip excluded directories
        if (excludePatterns.some(pattern => filePath.includes(pattern))) {
            return;
        }

        const stats = fs.statSync(filePath);
        const isLast = index === files.length - 1;
        
        // Create branch symbols
        const prefix = indent + (isLast ? '└── ' : '├── ');
        const childIndent = indent + (isLast ? '    ' : '│   ');

        // Add file/directory to output
        output += prefix + file + '\n';

        // Recursively process directories
        if (stats.isDirectory()) {
            output += generateTree(filePath, childIndent, excludePatterns);
        }
    });

    return output;
}

function saveDirectoryTree(rootPath, outputPath = 'directory-structure.txt', excludePatterns = ['node_modules','.next']) {
    try {
        // Get the absolute path
        const absolutePath = path.resolve(rootPath);
        
        // Generate timestamp
        const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
        
        // Create output filename with timestamp
        const fileName = outputPath.replace('.txt', `-${timestamp}.txt`);
        
        // Generate the tree content
        let content = `Directory Structure for: ${absolutePath}\n`;
        content += `Generated on: ${new Date().toLocaleString()}\n`;
        content += '='.repeat(50) + '\n\n';
        content += generateTree(rootPath, '', excludePatterns);
        
        // Save to file
        fs.writeFileSync(fileName, content);
        
        console.log(`Directory structure has been saved to: ${fileName}`);
        
        // Also return the content in case it's needed
        return content;
    } catch (error) {
        console.error('Error generating directory tree:', error.message);
        throw error;
    }
}

// Export for use as a module
module.exports = {
    generateTree,
    saveDirectoryTree
};

// If running directly
if (require.main === module) {
    const rootPath = process.argv[2] || '.';
    const outputPath = process.argv[3] || 'directory-structure.txt';
    saveDirectoryTree(rootPath, outputPath);
}
// How to use?
// >node tree.js [directory] [filename.txt]
// >node tree.js frontend frontend_structure.txt
// >node tree.js backend backend_structure.txt