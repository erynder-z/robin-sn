/* import parse from 'html-react-parser'; */

const parseHashtag = async (text) => {
  const hashify = (txt) => {
    const hashtagArray = [];
    txt.replace(/(?<=#).*?(?=( |$))/g, (ht) => {
      hashtagArray.push(ht);
    });
    return hashtagArray;
  };
  return hashify(text);
};

export default parseHashtag;
