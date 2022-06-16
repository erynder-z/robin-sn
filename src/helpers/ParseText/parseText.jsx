import parse from 'html-react-parser';

const parseText = (text) => {
  const urlify = (txt) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    // parse = parse <a> as jsx
    return parse(txt.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`));
  };

  return urlify(text);
};

export default parseText;
