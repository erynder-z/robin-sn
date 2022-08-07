const parseMention = async (text) => {
  // return an array with all strings preceeded by a "@"" from passed in text
  const mention = (txt) => {
    const mentionsArray = [];
    // match string after "@" until next whitespace. positive lookbehind to exclude the "@". word boundary to ignore special characters after the string..
    /*    txt.replace(/(?<=@)\S+\b/g, (m) => { */
    txt.replace(/@[A-Za-z0-9_]+/, (m) => {
      mentionsArray.push(m.substring(1).toLowerCase());
    });
    return mentionsArray;
  };
  return mention(text);
};

export default parseMention;
