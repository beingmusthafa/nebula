import loadingGif from "../assets/loading-2ball.gif";

const Loading = () => {
  return (
    <div
      className="flex flex-col h-screen w-screen items-center justify-center z-20 sticky top-0 left-0 right-0 bottom-0 mx-auto"
      style={{ backgroundColor: "rgba(255,255,255,0.5)" }}
    >
      <img src={loadingGif} height={60} width={60} alt="loading gif" />
    </div>
  );
};

export default Loading;
