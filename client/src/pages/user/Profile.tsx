import React, { useState, useRef, useEffect } from "react";
import Loading from "../../components/Loading";
import { toast } from "react-toastify";
import { useDispatch, useSelector } from "react-redux";
import ChangeEmailVerification from "../../components/user/ChangeEmailVerification";
import { updateDetails } from "../../redux/user/userSlice";
import EnrollmentCard from "../../components/user/EnrollmentCard";

interface Enrollment {
  _id: string;
  course: { title: string; thumbnail: string; price: number };
  createdAt: Date;
}
const Profile = () => {
  const { currentUser } = useSelector((state: any) => state.user);
  const [loading, setLoading] = useState(false);
  const [email, setEmail] = useState<string>(currentUser.email);
  const [code, setCode] = useState<string>(currentUser.email);
  const [showVerification, setShowVerification] = useState(false);
  const [error, setError] = useState("");
  const [editing, setEditing] = useState(false);
  const [verificationComplete, setVerificationComplete] = useState(false);
  const [image, setImage] = useState<File | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  let nameRef = useRef<HTMLInputElement>(null);
  let emailRef = useRef<HTMLInputElement>(null);
  let bioRef = useRef<HTMLTextAreaElement>(null);
  let verificationRef = useRef<HTMLInputElement>(null);
  const dispatch = useDispatch();
  const getEnrollments = async () => {
    setLoading(true);
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/get-enrollments",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      setLoading(false);
      if (!res.success) throw new Error(res.message);
      setEnrollments(res.enrollments);
    } catch (error: any) {
      console.log(error);
      toast.error("Something went wrong");
    }
  };

  const handleEdit = async () => {
    const toastId = toast.loading("Saving details");
    setError("");
    try {
      if (!email.trim() || !nameRef.current?.value.trim()) {
        setError("All fields are required");
        toast.dismiss(toastId);
        return;
      }
      let body: any = {
        name: nameRef.current?.value,
        email: email,
        bio: bioRef.current?.value,
      };
      if (email !== currentUser.email) {
        const code = verificationRef.current?.value;
        if (!code) {
          toast.dismiss(toastId);
          return setError("Verification code is required");
        }
        body = { ...body, code: code };
      }
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/edit-profile",
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify(body),
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) throw new Error(res.message);
      toast.success("Details saved successfully");
      setEditing(false);
      setShowVerification(false);
      setLoading(true);
      const res2 = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/get-profile",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      setLoading(false);
      if (!res2.success) throw new Error(res2.message);
      dispatch(updateDetails(res2.user));
    } catch (error: any) {
      console.log(error);
      toast.error(error.message || error);
    }
  };

  const startVerification = async () => {
    const toastId = toast.loading("Sending verification code");
    try {
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL +
          "/api/send-email-change-verification",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          body: JSON.stringify({
            email: email,
          }),
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) throw new Error(res.message);
      toast.info("Verification code sent to your email");
      setShowVerification(true);
    } catch (error: any) {
      toast.error(error.message || error);
      console.log(error);
    }
  };

  const changeImage = async () => {
    const toastId = toast.loading("Changing profile image");
    try {
      if (!image) {
        toast.dismiss(toastId);
        throw new Error("Please select an image");
      }
      const formData = new FormData();
      formData.append("image", image!);
      setImage(null);
      const res = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/change-profile-image",
        {
          headers: {
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
          method: "PUT",
          body: formData,
        }
      ).then((res) => res.json());
      toast.dismiss(toastId);
      if (!res.success) throw new Error(res.message);
      toast.success("Profile image changed successfully");
      setLoading(true);
      const res2 = await fetch(
        import.meta.env.VITE_API_BASE_URL + "/api/get-profile",
        {
          headers: {
            "Content-Type": "application/json",
            "Authorization": "Bearer " + localStorage.getItem("token"),
          },
        }
      ).then((res) => res.json());
      setLoading(false);
      if (!res2.success) throw new Error(res2.message);
      dispatch(updateDetails(res2.user));
    } catch (error: any) {
      toast.error(error.message || error);
      console.log(error);
    }
  };

  useEffect(() => {
    getEnrollments();
  }, []);
  useEffect(() => {
    if (!image) return;
    changeImage();
  }, [image]);

  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <div className="flex flex-col md:flex-row items-center gap-10 justify-center w-full p-10">
            <div className="flex flex-col items-start gap-4 order-2 md:order-1">
              {error && (
                <p className="font-semibold text-base text-red-500">{error}</p>
              )}
              <div>
                <p className="text-black font-bold my-2">Name</p>
                <p className=" text-base text-slate-600">
                  {editing ? (
                    <input
                      ref={nameRef}
                      defaultValue={currentUser.name}
                      className="w-80 p-2 border border-black"
                    />
                  ) : (
                    currentUser?.name
                  )}
                </p>
              </div>
              <div>
                <div className="flex justify-between my-2">
                  <p className="text-black font-bold">Email</p>
                  {editing &&
                    email !== currentUser.email &&
                    !verificationComplete && (
                      <button
                        onClick={startVerification}
                        className="font-semibold text-sky-600"
                      >
                        Click to verify
                      </button>
                    )}
                  {editing &&
                    email !== currentUser.email &&
                    verificationComplete && (
                      <div className="font-semibold text-green-600 flex items-center">
                        <i className="bx bx-check-circle text-base"></i>
                        Verified
                      </div>
                    )}
                </div>
                {editing ? (
                  <input
                    onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                      setEmail(e.target.value)
                    }
                    ref={emailRef}
                    defaultValue={currentUser.email}
                    className="w-80 p-2 border border-black text-base"
                  />
                ) : (
                  <p className=" text-base text-slate-600">
                    {currentUser?.email}
                  </p>
                )}
              </div>
              {showVerification && (
                <div>
                  <p className="text-black font-bold my-2">Verification code</p>
                  <p className=" text-base text-slate-600 w-80">
                    <input
                      onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                        setCode(e.target.value)
                      }
                      type="number"
                      ref={verificationRef}
                      className="w-80 p-2 border border-black"
                    />
                  </p>
                </div>
              )}

              <div>
                <p className="text-black font-bold my-2">Bio</p>
                <p className=" text-base text-slate-600 w-80">
                  {editing ? (
                    <textarea
                      ref={bioRef}
                      rows={2}
                      defaultValue={currentUser.bio}
                      className="w-80 p-2 border border-black _no-scrollbar"
                    />
                  ) : (
                    currentUser?.bio || "No bio provided"
                  )}
                </p>
              </div>
              {editing ? (
                <div className="flex">
                  <button
                    onClick={() => setEditing(false)}
                    className="py-2 px-4 font-semibold text-red-600"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleEdit}
                    className=" _fill-btn-blue text-white  py-2 px-4 font-semibold"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => setEditing(true)}
                  className=" _fill-btn-blue text-white  py-2 px-4 font-semibold"
                >
                  Edit
                </button>
              )}
            </div>
            <div className="flex flex-col items-center gap-6 order-1 md:order-2 md:mb-auto">
              <img
                className="w-36 h-36 rounded-full "
                src={currentUser?.image}
                alt=""
              />
              <input
                id="imageInput"
                type="file"
                className="hidden"
                onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
                  setImage(e.target.files![0])
                }
              />
              <label
                htmlFor="imageInput"
                className="font-semibold text-sky-500 cursor-pointer"
              >
                Change image
              </label>
            </div>
          </div>
          {enrollments?.length > 0 && (
            <>
              <h2 className="_section-title2 text-center my-6">
                Enrollment history
              </h2>
              {enrollments.map((enrollment) => {
                return (
                  <EnrollmentCard
                    key={enrollment._id}
                    enrollment={enrollment}
                  />
                );
              })}
            </>
          )}
        </>
      )}
    </>
  );
};

export default Profile;
