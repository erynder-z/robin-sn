import parse from 'html-react-parser';

const parseText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hashtag = /(?=#).*?(?=( |$))/g;
  return parse(
    text
      .replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`)
      .replace(hashtag, (ht) => `<span className="hashtag">${ht}</span>`)
  );
};

export default parseText;
