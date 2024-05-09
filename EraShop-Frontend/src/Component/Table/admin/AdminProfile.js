import React from "react";
import Title from "../../extra/Title";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";

import {
  getProfile,
  updateImage,
  ChangePassword,
  updateProfile,
} from "../../store/admin/admin.action";
import { useEffect } from "react";
import { setToast } from "../../util/toast";

const AdminProfile = (props) => {
  const admin = useSelector((state) => state.admin.admin);

  const token = sessionStorage;
  const dispatch = useDispatch();
  console.log("admin", admin);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");
  const [oldPassword, setOldPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState({
    name: "",
    email: "",
    password: "",
    oldPassword: "",
    newPassword: "",
    confirmPassword: "",
  });

  useEffect(() => {
    setName(admin?.name);
    setEmail(admin?.email);
    setImagePath(admin?.image);
    setError({ name: "", email: "" });
  }, [admin]);

  useEffect(() => {
    dispatch(getProfile());
  }, [dispatch]);

  const handleSubmitEmail = () => {
    if (!name || !email) {
      let error = {};
      if (!name) error.name = "Name is required !";
      if (!email) error.email = "Email is required !";
      return setError({ ...error });
    } else {
      let data = {
        name,
        email,
      };
      props.updateProfile(data);
    }
  };
  const handleChangePassword = () => {
    if (
      !oldPassword ||
      !newPassword ||
      oldPassword === newPassword ||
      !confirmPassword ||
      newPassword !== confirmPassword
    ) {
      let error = {};
      if (!oldPassword) error.oldPassword = "Old Password Is Required!";
      if (!newPassword) error.newPassword = "New Password Is Required !";
      if (oldPassword === newPassword)
        error.newPassword = "New Password can't be same As Old Password !";
      if (!confirmPassword)
        error.confirmPassword = "Confirm Password Is Required !";
      if (newPassword !== confirmPassword)
        error.confirmPassword =
          "New Password and Confirm Password doesn't match";
      return setError({ ...error });
    } else {
      let data = {
        oldPass: oldPassword,
        confirmPass: confirmPassword,
        newPass: newPassword,
      };
      props.ChangePassword(data);
    }
  };
  const handleUploadImage = (e) => {
    setImage(e.target.files[0]);
    setImagePath(URL.createObjectURL(e.target.files[0]));
  };

  const handleChangeImage = () => {
    if (!image) {
      setToast("error", "Please select an image");
    }
    const formData = new FormData();
    formData.append("image", image);
    props.updateImage(formData);
  };

  const handlePrevious = (url) => {
    window.open(url, "_blank");
  };

  return (
    <>
      <div className="mainAdminTable">
        <div className="adminTable">
          <div className="adminHeader primeHeader">
            <div className="row">
              <div className="col-10"></div>
              <div className="col-2 text-end"></div>
              <div className="col-6"></div>
            </div>
          </div>
          <div className="userMain">
            <div style={{ margin: "10px 18px" }}>
              <div className="row">
                <div className="col-xxl-3 col-md-6 col-12 mt-sm-2">
                  <div
                    className="card userProfile boxCenter"
                    style={{ maxHeight: "295px", minHeight: "295px" }}
                  >
                    <div className="card-body">
                      <div className="userImgae d-flex boxCenter position-relative">
                        <input
                          id="file-input"
                          type="file"
                          accept="image/*"
                          className="d-none"
                          onChange={(e) => handleUploadImage(e)}
                        />
                        <img
                          className="p-2 image"
                          style={{
                            border: "3px solid #b93160",
                            width: "150px",
                            height: "150px",
                            objectFit: "cover",
                            borderRadius: "17%",
                          }}
                          src={imagePath ? imagePath : admin?.image}
                          onClick={() => handlePrevious(imagePath)}
                          alt=""
                        />
                        <div className="position-absolute middle">
                          <div
                            style={{
                              background: "#1f1c30",
                              borderRadius: "50px",
                              height: "30px",
                              width: "30px",
                            }}
                          >
                            <label for="file-input">
                              <i
                                class="fa-solid fa-camera d-flex justify-content-center  rounded-circle  p-2 cursorPointer"
                                style={{
                                  fontSize: "15px",
                                  color: "#ffff",
                                  cursor: "pointer",
                                }}
                              ></i>
                            </label>
                          </div>
                        </div>
                      </div>
                      <h2 className="fw-semibold boxCenter mt-2">
                        {" "}
                        {admin?.name}
                      </h2>

                      <div className="mt-4 boxCenter">
                        <Button
                          newClass={`whiteFont`}
                          btnColor={`btnBlackPrime`}
                          btnName={`Upload Image `}
                          onClick={handleChangeImage}
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                      <div
                        className="userDetails position-absolute"
                        style={{ top: "5px" }}
                      ></div>
                    </div>
                  </div>
                </div>
                <div className="col-xxl-9 col-md-6 col-12 mt-sm-2">
                  <div
                    className="card"
                    style={{ maxHeight: "295px", minHeight: "295px" }}
                  >
                    <div className="card-body">
                      <div className="title d-flex mb-2">
                        <h4 className="fw-bold me-2 ">Edit Profile</h4>
                        <i class="fa-solid fa-pen-to-square fs-5 pt-1"></i>
                      </div>
                      <Input
                        label={`Name`}
                        id={`loginEmail`}
                        type={`text`}
                        value={name}
                        errorMessage={error.name && error.name}
                        onChange={(e) => {
                          setName(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              name: `Name is required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              name: "",
                            });
                          }
                        }}
                      />
                      <Input
                        label={`Email`}
                        id={`loginEmail`}
                        type={`email`}
                        value={email}
                        errorMessage={error.email && error.email}
                        onChange={(e) => {
                          setEmail(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              email: `Email Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              email: "",
                            });
                          }
                        }}
                      />

                      <div className="d-flex justify-content-end mt-4">
                        <Button
                          newClass={`whiteFont`}
                          btnColor={`btnBlackPrime`}
                          btnName={`Submit`}
                          onClick={handleSubmitEmail}
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div className="row">
                <div className="col-12 mt-4">
                  <div className="card">
                    <div className="card-body">
                      <div className="title d-flex mb-2">
                        <h4 className="fw-bold me-2 ">Change Password</h4>
                        <i class="fa-solid fa-lock fs-5 pt-1"></i>
                      </div>
                      <div className="row">
                        <div className="col-12">
                          <Input
                            label={`Old Password`}
                            id={`Old Password`}
                            type={`password`}
                            errorMessage={
                              error.oldPassword && error.oldPassword
                            }
                            onChange={(e) => {
                              setOldPassword(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  oldPassword: `OldPassword Is Required`,
                                });
                              } else {
                                return setError({
                                  ...error,
                                  oldPassword: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-6">
                          <Input
                            label={`New Password`}
                            id={`New Password`}
                            type={`password`}
                            errorMessage={
                              error.newPassword && error.newPassword
                            }
                            onChange={(e) => {
                              setNewPassword(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  newPassword: `New Password Is Required`,
                                });
                              } else {
                                return setError({
                                  ...error,
                                  newPassword: "",
                                });
                              }
                            }}
                          />
                        </div>
                        <div className="col-6">
                          <Input
                            label={`Confirm Password`}
                            id={`Confirm Password`}
                            type={`password`}
                            errorMessage={
                              error.confirmPassword && error.confirmPassword
                            }
                            onChange={(e) => {
                              setConfirmPassword(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  confirmPassword: `Confirm Password Is Required`,
                                });
                              } else {
                                return setError({
                                  ...error,
                                  confirmPassword: "",
                                });
                              }
                            }}
                          />
                        </div>
                      </div>

                      <div className="d-flex justify-content-end mt-2">
                        <Button
                          newClass={`whiteFont`}
                          btnColor={`btnBlackPrime`}
                          btnName={`Submit`}
                          onClick={handleChangePassword}
                          style={{ borderRadius: "10px" }}
                        />
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="userFooter primeFooter"></div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  updateImage,
  getProfile,
  ChangePassword,
  updateProfile,
})(AdminProfile);
