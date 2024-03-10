import React, { SetStateAction } from "react";
import IVideo from "../../interfaces/videos.interface";

interface Props {
  video: IVideo;
  setShow: React.Dispatch<SetStateAction<boolean>>;
}
const VideoPreview: React.FC<Props> = ({ video, setShow }) => {
  return (
    <div className="_admin-center">
      <div className="_screen-center border p-4 w-full flex flex-col md:w-[100vh] bg-white border-sky-500">
        <div className="w-full justify-end">
          <button
            onClick={() => setShow(false)}
            className="_fill-btn-black my-2"
          >
            Close
          </button>
        </div>
        <video className="w-full" controls>
          <source src={video.video} />
        </video>
        <p className="font-semibold text-base text-center">{video.title}</p>
      </div>
    </div>
  );
};

export default VideoPreview;
