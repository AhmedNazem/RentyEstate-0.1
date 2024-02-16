import { useSelector } from "react-redux";
import { useRef, useState, useEffect } from "react";
import { app } from "../firebase"; //check the oginal file
import {
  updateUserStart,
  updateUserFailure,
  updateUserSuccess,
  deleteUserFail,
  deleteUserStart,
  deleteUserSuccess,
  signOutStart,
  signInFaliure,
  signInSuccess,
  signOutFail,
  signOutSuccess,
} from "../redux/user/userSlice";
import { useDispatch } from "react-redux";
import {
  getDownloadURL,
  getStorage,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
function Profile() {
  const dispatch = useDispatch();
  const fileRef = useRef(null);
  const { currentUser, loading, error } = useSelector((state) => state.user);
  const [file, setFile] = useState(undefined);
  const [filePerc, setFilePerc] = useState(0);
  const [fileUploadErorr, setFileUploadErorr] = useState(false);
  const [formData, setFormData] = useState({});
  const [updateSuccess, setUpdateSuccess] = useState(false);
  console.log(formData);

  //
  //
  useEffect(() => {
    if (file) {
      handleFileUpload();
    }
  }, [file]);
  //* need to reveiw the action   it's kinda complex 0_0
  const handleFileUpload = () => {
    const storage = getStorage(app);
    const fileName = new Date().getTime() + file.name;
    const storageRef = ref(storage, fileName);
    const uploadTask = uploadBytesResumable(storageRef, file);
    uploadTask.on(
      "state_changed",
      (snapshot) => {
        const progress =
          (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
        setFilePerc(Math.round(progress));
      },
      (error) => {
        setFileUploadErorr(true);
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setFormData({ ...formData, avatar: downloadURL });
        });
      }
    );
  };
  //* end the misory
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      dispatch(updateUserStart());
      const res = await fetch(`/api/user/update/${currentUser._id}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(updateUserFailure(data.message));
        return;
      }
      dispatch(updateUserSuccess(data));
      setUpdateSuccess(true);
    } catch (err) {
      dispatch(updateUserFailure(err.message));
    }
  };
  const handleDeleteUser = async () => {
    //get the delete account functionality
    try {
      dispatch(deleteUserStart());
      const res = await fetch(`/api/user/delete/${currentUser._id}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFail(data.message));
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFail(err.message));
    }
  };
  const handleSignOut = async () => {
    try {
      dispatch(signOutStart());
      const res = await fetch("/api/auth/signout");
      const data = await res.json();
      if (data.success === false) {
        dispatch(deleteUserFail(data.message));
        return;
      }
      dispatch(deleteUserSuccess(data));
    } catch (err) {
      dispatch(deleteUserFail(data.message));
    }
  };
  return (
    <div className="p-3 max-w-lg mx-auto">
      <h1 className="text-3xl font-semibold text-center my-7 "> Profile</h1>
      <form className="flex flex-col gap-4" onSubmit={handleSubmit}>
        <input
          type="file"
          ref={fileRef}
          hidden
          accept="image/*"
          onChange={(e) => setFile(e.target.files[0])}
        />
        <img
          onClick={() => fileRef.current.click()}
          src={formData.avatar || currentUser.avatar}
          alt="profile img"
          className="rounded-full h-24 w-24 object-cover cursor-pointer self-center mt-2 "
        />

        <p className="text-sm self-center">
          {fileUploadErorr ? (
            <span className="text-red-700">
              Error Image Upload(image must be less than 2mb)
            </span>
          ) : filePerc > 0 && filePerc < 100 ? (
            <span className="text-slate-700">{`Uploading ${filePerc}%`}</span>
          ) : filePerc === 100 ? (
            <span className="text-cyan-500">Image successfully uploaded</span>
          ) : (
            ""
          )}
        </p>
        <input
          type="text"
          defaultValue={currentUser.username}
          placeholder="Username"
          className="border p-3 rounded-lg "
          id="username"
          onChange={handleChange}
        />
        <input
          type="email"
          defaultValue={currentUser.email}
          placeholder="Email"
          className="border p-3 rounded-lg "
          id="email"
          onChange={handleChange}
        />
        <input
          type="password"
          placeholder="Password"
          className="border p-3 rounded-lg "
          id="password"
          onChange={handleChange}
        />
        <button
          disabled={loading}
          className="bg-slate-700 text-white rounded-lg p-3 uppercase hover:opacity-95 disabled:opacity-80 "
        >
          {loading ? "Loading..." : "Update"}
        </button>
      </form>
      <div className=" flex justify-between at-5">
        <span
          onClick={handleDeleteUser}
          className="text-red-700 cursor-pointer hover:bg-red-100"
        >
          Delete Account
        </span>
        <span
          onClick={handleSignOut}
          className="text-red-700 cursor-pointer  hover:bg-red-100"
        >
          Sign Out
        </span>
      </div>
      <p className="text-red-700">{error ? error : ""}</p>
      <p className="text-cyan-500 mt-5">
        {updateSuccess ? "User updated successfully" : ""}
      </p>
    </div>
  );
}

export default Profile;
