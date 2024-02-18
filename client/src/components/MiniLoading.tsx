import loadingGif from "../assets/loading-2ball.gif";

const MiniLoading = () => {
  return (
    <div className="flex fixed h-full w-full items-center justify-center z-20 mx-auto top-0 left-0 right-0">
      <img src={loadingGif} height={60} width={60} alt="loading gif" />
    </div>
  );
};

export default MiniLoading;
