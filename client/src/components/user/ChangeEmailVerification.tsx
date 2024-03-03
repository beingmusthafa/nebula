import React, { useState } from "react";
import Loading from "../Loading";

interface Props {
  setShow: React.Dispatch<React.SetStateAction<boolean>>;
}
const ChangeEmailVerification: React.FC<Props> = ({ setShow }) => {
  let [loading, setLoading] = useState(false);
  let [error, setError] = useState("");
  let [processing, setProcessing] = useState(false);
  const handleSubmit = () => {};
  return loading ? (
    <Loading />
  ) : (
    <div className="flex w-full justify-center">
      <form
        className="_screen-center flex flex-col bg-white border-4 _border-blue-black-gradient gap-4 p-6 min-w-72"
        style={{ zIndex: 15 }}
        onSubmit={handleSubmit}
      >
        <h1 className="_font-dm-display text-center text-lg">Verify email</h1>
        {error && <p className="text-red-500 font-semibold my-4">{error}</p>}
        <p>Enter the verification code sent to your email</p>
        <input
          type="number"
          placeholder="Verification code"
          className="p-2 text-base border border-black pl-4 w-64 md:w-80"
        />
        <button
          className={`_fill-btn-blue2 uppercase ${
            processing ? "cursor-not-allowed" : ""
          }`}
          disabled={processing}
        >
          Verify
        </button>
        <button
          onClick={() => setShow(false)}
          className="text-red-600 font-semibold mx-auto"
        >
          Cancel
        </button>
      </form>
    </div>
  );
};

export default ChangeEmailVerification;
