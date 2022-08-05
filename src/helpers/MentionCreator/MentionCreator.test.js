import parseMention from './MentionCreator';

describe('parseHashtag', () => {
  it('returns an array containing all mentions inside a string', async () => {
    const mentionArray = await parseMention('i am talking to you @travis and @taxi_driver');
    expect(mentionArray).toEqual(['travis', 'taxi_driver']);
  });

  it('ignores case', async () => {
    const mentionArray = await parseMention('i am talking to you @Travis and @TAXI_driver');
    expect(mentionArray).toEqual(['travis', 'taxi_driver']);
  });

  it('ignores special characters after the mention', async () => {
    const mentionArray = await parseMention('hallo @spencer!!!!!!');
    expect(mentionArray).toEqual(['spencer']);
  });

  it('returns an empty array if sting contains no mentions', async () => {
    const mentionArray = await parseMention('some text without mention');
    expect(mentionArray).toEqual([]);
  });
});
