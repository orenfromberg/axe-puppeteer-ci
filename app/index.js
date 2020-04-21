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

  if (violations.length === 0) {
    cliReporter(colors.green('  0 violations found!'));
    return;
  }

  const issueCount = violations.reduce((count, violation) => {
    cliReporter(
      '\n' +
        error('  Violation of %j with %d occurrences!\n') +
        '    %s. Correct invalid elements at:\n' +
        violation.nodes
          .map(node => '     - ' + selectorToString(node.target) + '\n')
          .join('') +
        '    For details, see: %s',
      violation.id,
      violation.nodes.length,
      violation.description,
      link(violation.helpUrl.split('?')[0])
    );
    return count + violation.nodes.length;
  }, 0);

  cliReporter(error('\n%d Accessibility issues detected.'), issueCount);
}


if (process.argv.slice(2).length == 0) { 
  console.error("please specify a website")
} else {
  ;(async () => {
    const browser = await puppeteer.launch({args: ['--no-sandbox', '--disable-setuid-sandbox']})
    const page = await browser.newPage()
    await page.setBypassCSP(true)
  
    await page.goto(process.argv[2])
  
    const results = await new AxePuppeteer(page).analyze()
    const error_code = results.violations.length === 0 ? 0 : 1;
    logResults(results)
  
    await page.close()
    await browser.close()
    process.exit(error_code)
  })()
}

