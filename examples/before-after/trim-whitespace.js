// #30 — trim vs regex

const input = '  hello world  ';

const trimmedBefore = input.replace(/^\s+|\s+$/g, '');
const trimmedAfter = input.trim();

export { trimmedBefore, trimmedAfter };
