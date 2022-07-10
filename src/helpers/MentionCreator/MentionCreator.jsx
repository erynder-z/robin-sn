const parseMention = async (text) => {
  // return an array with all strings preceeded by a "@"" from passed in text
  const mention = (txt) => {
    const mentionsArray = [];
    txt.replace(/(?<=@).*?(?=( |$))/g, (m) => {
      mentionsArray.push(m);
    });
    return mentionsArray;
  };
  return mention(text);
};

export default parseMention;
