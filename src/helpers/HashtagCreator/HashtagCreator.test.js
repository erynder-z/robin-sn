import parseHashtag from './HashtagCreator';

describe('parseHashtag', () => {
  it('returns an array containing all hashtags inside a string', async () => {
    const hashtagArray = await parseHashtag('some #text with a #hashtag');
    expect(hashtagArray).toEqual(['text', 'hashtag']);
  });

  it('ignores case', async () => {
    const hashtagArray = await parseHashtag('some #Text with a #HASHTAG');
    expect(hashtagArray).toEqual(['text', 'hashtag']);
  });

  it('ignores special characters after the hashtag', async () => {
    const hashtagArray = await parseHashtag('some #trend, test and #Text!!!!!!');
    expect(hashtagArray).toEqual(['trend', 'text']);
  });

  it('works if hashtag contains numbers', async () => {
    const hashtagArray = await parseHashtag('#1337, #factor5');
    expect(hashtagArray).toEqual(['1337', 'factor5']);
  });

  it('returns an empty array if sting contains no hashtags', async () => {
    const hashtagArray = await parseHashtag('some text without hashtag');
    expect(hashtagArray).toEqual([]);
  });
});
