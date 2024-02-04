import loadingGif from "../assets/loading-2ball.gif";

const MiniLoading = () => {
  return (
    <div className="flex flex-col h-full w-full items-center justify-center z-20 mx-auto">
      <img src={loadingGif} height={60} width={60} alt="loading gif" />
    </div>
  );
};

export default MiniLoading;
