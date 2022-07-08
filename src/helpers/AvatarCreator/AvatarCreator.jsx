import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';

function AvatarCreator({
  image,
  setUserObject,
  uploadUserpic,
  setShowCropper,
  functionCallOrigin
}) {
  const editor = useRef(null);
  const [avatarDimensions, setAvatarDimensions] = useState({ height: 0, width: 0 });

  let button;

  useEffect(() => {
    if (window.innerWidth < 768) {
      setAvatarDimensions({ height: 100, width: 100 });
    } else {
      setAvatarDimensions({ height: 250, width: 250 });
    }
  }, []);

  // check which component rendered the cropper and change the button functionallity accordingly
  if (functionCallOrigin === 'createAccount') {
    button = (
      <button
        className="saveAvatarBtn"
        type="button"
        onClick={() => {
          if (editor) {
            const canvas = editor.current.getImage();

            setUserObject((prevState) => ({
              ...prevState,
              userPic: canvas.toDataURL()
            }));
            setShowCropper(false);
          }
        }}>
        Save
      </button>
    );
  } else if (functionCallOrigin === 'changeProfile') {
    button = (
      <button
        className="saveAvatarBtn"
        type="button"
        onClick={() => {
          if (editor) {
            const canvas = editor.current.getImage();

            uploadUserpic(canvas.toDataURL());
            setShowCropper(false);
          }
        }}>
        Save
      </button>
    );
  }

  return (
    <div className="avatarEditor-container">
      <h3>position your avatar</h3>
      <AvatarEditor
        ref={editor}
        image={image}
        width={avatarDimensions.width}
        height={avatarDimensions.height}
        border={0}
        borderRadius={125}
        color={[0, 0, 0, 1.0]}
        scale={1}
        rotate={0}
      />
      {button}
    </div>
  );
}

export default AvatarCreator;

AvatarCreator.propTypes = {
  image: PropTypes.string.isRequired,
  setUserObject: PropTypes.func,
  uploadUserpic: PropTypes.func,
  setShowCropper: PropTypes.func.isRequired,
  functionCallOrigin: PropTypes.string.isRequired
};

AvatarCreator.defaultProps = {
  setUserObject: null,
  uploadUserpic: null
};
