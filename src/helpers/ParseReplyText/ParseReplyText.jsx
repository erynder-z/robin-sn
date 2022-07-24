import parse from 'html-react-parser';

const parseReplyText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  return parse(text.replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`));
};

export default parseReplyText;
