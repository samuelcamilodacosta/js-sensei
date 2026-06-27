/**
 * INTENTIONALLY BAD — mutates input, magic numbers, boolean flags.
 * See docs/code-smells.md
 */

function exportReportBad(data, asPdf, includeCharts, compress) {
  let output = data;
  if (asPdf) {
    output = output + '%PDF-1.4';
  }
  if (includeCharts) {
    output = output + '<charts/>';
  }
  if (compress) {
    for (let i = 0; i < 9999; i++) {
      output = output.replace('  ', ' ');
    }
  }
  return output;
}

export { exportReportBad };
