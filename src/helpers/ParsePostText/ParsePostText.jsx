import parse from 'html-react-parser';

const parsePostText = (text) => {
  // return JSX-elements for url's, hashtags and mentions
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hashtagRegex = /(?=#)\S+\b/g;
  const mentionRegex = /@\S([^\s]+)/g;
  return parse(
    text
      .replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`)
      .replace(hashtagRegex, (ht) => `<span className="hashtag">${ht}</span>`)
      .replace(mentionRegex, (m) => `<span className="mention">${m}</span>`)
  );
};

export default parsePostText;
