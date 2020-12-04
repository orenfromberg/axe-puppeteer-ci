const { AxePuppeteer } = require('axe-puppeteer')
const puppeteer = require('puppeteer')
const colors = require('colors');
const link = colors.underline.blue;
const error = colors.red.bold;

const selectorToString = (selectors, separator) => {
	separator = separator || ' ';
	return selectors
		.reduce((prev, curr) => prev.concat(curr), [])
		.join(separator);
};

const cliReporter = (...args) => {
  console.log(...args);
};

const logResults = (results) => {
  const { violations } = results;
  const issueCount = violations.reduce((count, violation) => {
    cliReporter(
      '\n' +
        error('  Violation of %j with %d occurrences on %s\n') +
        '    %s. Correct invalid elements at:\n' +
        violation.nodes
          .map(node => '     - ' + selectorToString(node.target) + '\n')
          .join('') +
        '    For details, see: %s',
      violation.id,
      violation.nodes.length,
      results.url,
      violation.description,
      link(violation.helpUrl.split('?')[0])
    );
    return count + violation.nodes.length;
  }, 0);

  cliReporter(error('\n%d Accessibility issues detected on %s'), issueCount, results.url);
}

const processResults = (results_array) => {
  var num_violations = 0
  results_array.forEach(results => {
    const { violations } = results;
    num_violations += violations.length
    if (violations.length !== 0) {
      logResults(results)
    }
  });

  if (num_violations === 0) {
    cliReporter(colors.green('  0 violations found!'));
    return 0;
  }
  else {
    return 1;
  }
}


if (process.argv.slice(2).length == 0) { 
  console.error("please specify a website")
} else {
  ;(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
    const page = await browser.newPage()
    await page.setBypassCSP(true)
    const num_args = process.argv.slice(2).length
    var results_array = []
    for ( let i = 0; i < num_args; i++ ) {
      await page.goto(process.argv[i+2]) // the input arguments start at index 2
      results = await new AxePuppeteer(page).analyze()
      results_array.push(results)
    }
    await page.close()
    await browser.close()
    error_code = await processResults(results_array)
    process.exit(error_code)
  })()
}

