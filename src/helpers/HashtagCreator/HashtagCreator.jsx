/* import parse from 'html-react-parser'; */

const parseHashtag = async (text) => {
  // return an array with all strings preceeded by a "#" from passed in text
  const hashify = (txt) => {
    const hashtagArray = [];
    /*  txt.replace(/(?<=#)\S+\b/g, (ht) => { */
    txt.replace(/\B#\w\w+\b/g, (ht) => {
      hashtagArray.push(ht.substring(1).toLowerCase());
    });
    return hashtagArray;
  };
  return hashify(text);
};

export default parseHashtag;
