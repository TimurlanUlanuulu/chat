import React, { useState } from "react";
import addImg from "../img/default.jpg";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { auth, storage, db } from "../firebase";
import { doc, setDoc } from "firebase/firestore";

import { ref, uploadBytesResumable, getDownloadURL } from "firebase/storage";
import { Link, useNavigate } from "react-router-dom";

const Register: React.FC = () => {
  const [err, setErr] = useState(false);
  
  const [progressUpload, setProgressUpload] = useState(0);

  const navigation = useNavigate();

  const handleSubmit = async (e: any) => {
    e.preventDefault();
    const displayName = e.target[0].value;
    const email = e.target[1].value;
    const password = e.target[2].value;
    const file = e.target[3].files[0];

    try {
      const res = await createUserWithEmailAndPassword(auth, email, password);

      const storageRef = ref(storage, displayName);

      const uploadTask = uploadBytesResumable(storageRef, file);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          const progress =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;

          setProgressUpload(progress); // to show progress upload

          switch (snapshot.state) {
            case "paused":
              console.log("Upload is paused");
              break;
            case "running":
              console.log("Upload is running");
              break;
          }
        },
        (error) => {
          setErr(true);
        },
        () => {
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await updateProfile(res.user, {
              displayName,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "users", res.user.uid), {
              uid: res.user.uid,
              displayName,
              email,
              photoURL: downloadURL,
            });
            await setDoc(doc(db, "userChats", res.user.uid), {});
            navigation("/");
          });
        }
      );
    } catch (error) {
      setErr(true);
    }
  };

  return (
    <div className="formContainer">
      <div className="formWrapper">
        <span className="logo">Lama Chat</span>
        <span className="title">Register</span>
        <form onSubmit={handleSubmit}>
          <input type="text" placeholder="display name" />
          <input type="email" placeholder="email" />
          <input type="password" placeholder="password" />
          <input style={{ display: "none" }} type="file" id="file" />
          <label htmlFor="file" className="label-file">
            <img src={addImg} width="20px" alt="" />
            <span>Add an avatar</span>
          </label>
          <button>Sign Up</button>
          {err ? <span>Something get wrong!</span> : ""}
        </form>
        <p>
          Already have an account?<Link to="/login">Login</Link>
        </p>
      </div>
    </div>
  );
};

export default Register;
