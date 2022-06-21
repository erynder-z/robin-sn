import { screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';
import { render, unmountComponentAtNode } from 'react-dom';
import { act } from 'react-dom/test-utils';

import Profile from './Profile';

let container = null;
beforeEach(() => {
  // setup a DOM element as a render target
  container = document.createElement('div');
  document.body.appendChild(container);
});

afterEach(() => {
  // cleanup on exiting
  unmountComponentAtNode(container);
  container.remove();
  container = null;
});

const userData = {
  userID: 'not important',
  isSetup: true,
  username: 'someUser',
  description: 'not important',
  userPic: 'not important',
  useremail: 'not important',
  joined: { seconds: 123456798 },
  numberOfPosts: 0,
  followers: [{ userID: '12314' }],
  following: [{ userID: '12314' }],
  posts: [{ postID: '1234567' }],
  replies: [{ postID: '1234567' }],
  bookmarks: [{ postID: '1234567' }]
};

describe('Profile component', () => {
  it('renders username', () => {
    act(() => {
      render(<Profile userData={userData} />, container);
    });
    expect(container.textContent).toMatch(/(someUser)/i);
  });
});
