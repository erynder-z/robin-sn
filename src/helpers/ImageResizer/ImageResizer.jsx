import Resizer from 'react-image-file-resizer';

const resizeFile = (file) =>
  // resize images to 500x500px
  new Promise((resolve) => {
    Resizer.imageFileResizer(
      file,
      500,
      500,
      'JPEG',
      100,
      0,
      (uri) => {
        resolve(uri);
      },
      'file'
    );
  });

export default resizeFile;
