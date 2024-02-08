import loadingGif from "../../assets/loading-2ball.gif";

const AdminLoading = () => {
  return (
    <div className="_admin-center">
      <img src={loadingGif} height={60} width={60} alt="loading gif" />
    </div>
  );
};

export default AdminLoading;
