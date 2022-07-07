import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import AvatarEditor from 'react-avatar-editor';

function AvatarCreator({ image, setUserObject, setShowCropper }) {
  const editor = useRef(null);
  const [avatarDimensions, setAvatarDimensions] = useState({ height: 0, width: 0 });

  useEffect(() => {
    if (window.innerWidth < 768) {
      setAvatarDimensions({ height: 100, width: 100 });
    } else {
      setAvatarDimensions({ height: 250, width: 250 });
    }
  }, []);

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
      <button
        className="saveAvatarBtn"
        type="button"
        onClick={() => {
          if (editor) {
            const canvas = editor.current.getImage();
            /*    const canvasScaled = editor.current.getImageScaledToCanvas(); */

            setUserObject((prevState) => ({
              ...prevState,
              userPic: canvas.toDataURL()
            }));
            setShowCropper(false);
          }
        }}>
        Save
      </button>
    </div>
  );
}

export default AvatarCreator;

AvatarCreator.propTypes = {
  image: PropTypes.string.isRequired,
  setUserObject: PropTypes.func.isRequired,
  setShowCropper: PropTypes.func.isRequired
};
