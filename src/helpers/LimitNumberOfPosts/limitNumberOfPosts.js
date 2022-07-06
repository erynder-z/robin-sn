const limitNumberOfPosts = (postsArray) => {
  while (postsArray.length > 25) {
    postsArray.shift();
  }
  return postsArray;
};

export default limitNumberOfPosts;
