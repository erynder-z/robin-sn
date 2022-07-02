import parse from 'html-react-parser';

const parseText = (text) => {
  const urlRegex = /(https?:\/\/[^\s]+)/g;
  const hashtag = /(?=#).*?(?=( |$))/g;
  const mention = /(?=@).*?(?=( |$))/g;
  return parse(
    text
      .replace(urlRegex, (url) => `<a href="${url}" target="_blank">${url}</a>`)
      .replace(hashtag, (ht) => `<span className="hashtag">${ht}</span>`)
      .replace(mention, (m) => `<span className="mention">${m}</span>`)
  );
};

export default parseText;
