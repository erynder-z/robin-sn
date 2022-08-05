import limitNumberOfPosts from './limitNumberOfPosts';

describe('limitNumberOfPosts', () => {
  const longArray = Array.from(Array(30).keys());
  const shortArray = Array.from(Array(5).keys());
  it('return an array with max. 25 items', () => {
    expect(limitNumberOfPosts(longArray)).toHaveLength(25);
    expect(limitNumberOfPosts(shortArray)).toHaveLength(5);
  });
});
