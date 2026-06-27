// #29 — padStart for zero padding

const invoiceNum = 42;

const formattedBefore =
  invoiceNum < 10 ? `00${invoiceNum}` : invoiceNum < 100 ? `0${invoiceNum}` : String(invoiceNum);
const formattedAfter = String(invoiceNum).padStart(4, '0');

export { formattedBefore, formattedAfter };
