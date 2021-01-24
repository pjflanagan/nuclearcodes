
const REGEX_MATCH_INSERTS = /(.*?)<(.*?)>(.*?)/g;

const parseTextForInserts = (text, inserts) => {
  if (!inserts) {
    return text;
  }

  const matches = [...text.matchAll(REGEX_MATCH_INSERTS)];
  if (matches.length === 0) {
    return text;
  }

  let finalText = '';
  matches.forEach((match, i) => {
    finalText += match[1];
    const insertText = inserts[match[2]];
    finalText += insertText;
  });

  finalText += text.substr(text.lastIndexOf(">") + 1);

  return finalText;
};

export { parseTextForInserts };
