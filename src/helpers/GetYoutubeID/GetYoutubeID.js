// extract video id if link is a youtube video
const getYoutubeID = (url) => {
  let URLcopy = url;
  URLcopy = URLcopy.split(/(vi\/|v%3D|v=|\/v\/|youtu\.be\/|\/embed\/)/);
  return undefined !== URLcopy[2] ? URLcopy[2].split(/[^0-9a-z_-]/i)[0] : null;
};

export default getYoutubeID;
