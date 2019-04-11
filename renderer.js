/* Handles code rendering */
const outputDiv = document.getElementById('output-area');

/**
 * Adds html output
 * @param {string} html    Html output to add
 * @param {boolean} format Format the output? It ignores if the input is empty,
 *                         and adds a wrapper to differentiate
 * @param {boolean} br     Add a <br> after the output?
 */
function addData(html, format = false, br = true) {
    if (format) {
        if (!html) return;
        html = `<div class="special-output">${html}</div>`;
    }

    // Add data and scroll to bottom
    outputDiv.innerHTML += html + (br ? '<br>' : '');
    outputDiv.scrollTop = outputDiv.scrollHeight - outputDiv.clientHeight;
}

module.exports = {
    addData: addData,
    test: {
        addAllPasses: (arr, total) => {
            addData(`<details style="font-size: 16px" class="output-string">
<summary>${arr.length} / ${total} Tests passed</summary>
    ${arr.map(test => `<span>✔ ${test.parent.title}<br>
<div style="margin-left: 20px">${test.title}</div><span style="float: right">${test.duration} ms</span></span>`)
        .join('<br>')}
</details>`);
        },
        addAllFails: (arr, total) => {
            addData(`<details style="font-size: 16px" class="error-msg">
<summary>${arr.length} / ${total} Tests failed</summary>
    ${arr.map(test => `<span>✖ ${test[0].parent.title}<br>
<div style="margin-left: 20px">${test[0].title}</div><span style="float: right">${test[0].duration} ms</span>
<pre>
${test[1].message}
+ expected - actual
    + ${test[1].expected}
    - ${test[1].actual}
</pre></span>`)
        .join('<br>')}
</details>`);
        },
        summary: (successes, fails, total) => {
            let totalTime = successes.map(x => x.duration).reduce((a, b) => a + b) +
                fails.map(x => x[0].duration).reduce((a, b) => a + b);
            addData(`<pre style="font-size: 16px">
${(successes.length / total * 100).toFixed(2)}% Passing (${successes.length})
${(fails.length / total * 100).toFixed(2)}% Failing (${fails.length})            
Total time: ${totalTime} ms
</pre>`);
        },
    }
};