import getYoutubeID from './GetYoutubeID';

describe('getYoutubeID', () => {
  it('gets the videoID of a youtube video URL', () => {
    expect(getYoutubeID('https://www.youtube.com/watch?v=12345abcde')).toEqual('12345abcde');
  });

  it('returns undefined if URL is not a youtube video', () => {
    expect(getYoutubeID('https://www.example.com/')).toBeFalsy();
  });

  it('returns undefined if URL is not a youtube video', () => {
    expect(getYoutubeID('https://www.youtube.com/')).toBeFalsy();
  });

  it('returns undefined if URL is not even an URL ', () => {
    expect(getYoutubeID('something')).toBeFalsy();
  });
});
