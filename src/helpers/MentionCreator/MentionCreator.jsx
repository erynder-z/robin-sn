const parseMention = async (text) => {
  const mention = (txt) => {
    const mentionsAssay = [];
    txt.replace(/(?<=@).*?(?=( |$))/g, (m) => {
      mentionsAssay.push(m);
    });
    return mentionsAssay;
  };
  return mention(text);
};

export default parseMention;
