const parseMention = async (text) => {
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
