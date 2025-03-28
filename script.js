document.getElementById('simulate-btn').addEventListener('click', () => {
    const referenceString = document.getElementById('reference-string').value.split(',').map(Number);
    const frameSize = parseInt(document.getElementById('frame-size').value, 10);
    const algorithm = document.getElementById('algorithm').value;

    if (!referenceString.length || isNaN(frameSize) || frameSize <= 0) {
        alert('Please provide valid inputs.');
        return;
    }

    let results;
    switch (algorithm) {
        case 'FIFO':
            results = simulateFIFO(referenceString, frameSize);
            break;
        case 'LRU':
            results = simulateLRU(referenceString, frameSize);
            break;
        case 'MRU':
            results = simulateMRU(referenceString, frameSize);
            break;
        case 'OPR':
            results = simulateOPR(referenceString, frameSize);
            break;
        default:
            alert('Invalid algorithm selected.');
            return;
    }

    displayResults(results);
});

function simulateFIFO(referenceString, frameSize) {
    const frames = [];
    const steps = [];
    let pageFaults = 0;

    referenceString.forEach(page => {
        if (!frames.includes(page)) {
            if (frames.length === frameSize) frames.shift();
            frames.push(page);
            pageFaults++;
        }
        steps.push([...frames]);
    });

    return { algorithm: 'FIFO', pageFaults, steps };
}

function simulateLRU(referenceString, frameSize) {
    const frames = [];
    const steps = [];
    let pageFaults = 0;

    referenceString.forEach((page, index) => {
        if (!frames.includes(page)) {
            if (frames.length === frameSize) {
                const lru = frames.reduce((leastUsed, frame) =>
                    referenceString.lastIndexOf(frame, index - 1) < referenceString.lastIndexOf(leastUsed, index - 1)
                        ? frame
                        : leastUsed
                );
                frames.splice(frames.indexOf(lru), 1);
            }
            frames.push(page);
            pageFaults++;
        }
        steps.push([...frames]);
    });

    return { algorithm: 'LRU', pageFaults, steps };
}

function simulateMRU(referenceString, frameSize) {
    const frames = [];
    const steps = [];
    let pageFaults = 0;

    referenceString.forEach((page, index) => {
        if (!frames.includes(page)) {
            if (frames.length === frameSize) {
                const mru = frames.reduce((mostUsed, frame) =>
                    referenceString.lastIndexOf(frame, index - 1) > referenceString.lastIndexOf(mostUsed, index - 1)
                        ? frame
                        : mostUsed
                );
                frames.splice(frames.indexOf(mru), 1);
            }
            frames.push(page);
            pageFaults++;
        }
        steps.push([...frames]);
    });

    return { algorithm: 'MRU', pageFaults, steps };
}

function simulateOPR(referenceString, frameSize) {
    const frames = [];
    const steps = [];
    let pageFaults = 0;

    referenceString.forEach((page, index) => {
        if (!frames.includes(page)) {
            if (frames.length === frameSize) {
                const futureIndices = frames.map(frame =>
                    referenceString.slice(index + 1).indexOf(frame)
                );
                const victimIndex = futureIndices.indexOf(-1) !== -1
                    ? futureIndices.indexOf(-1)
                    : futureIndices.indexOf(Math.max(...futureIndices));
                frames.splice(victimIndex, 1);
            }
            frames.push(page);
            pageFaults++;
        }
        steps.push([...frames]);
    });

    return { algorithm: 'OPR', pageFaults, steps };
}

function displayResults(results) {
    const resultsDiv = document.getElementById('results');
    resultsDiv.innerHTML = `
        <p>Algorithm: ${results.algorithm}</p>
        <p>Page Faults: ${results.pageFaults}</p>
        <p>Steps:</p>
        <pre>${results.steps.map((step, i) => `Step ${i + 1}: ${step.join(', ')}`).join('\n')}</pre>
    `;
}
