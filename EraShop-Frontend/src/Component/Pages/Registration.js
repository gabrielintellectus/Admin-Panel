import React, { useState } from "react";
import { connect } from "react-redux";

import { signupAdmin } from "../store/admin/admin.action";
import Button from "../extra/Button";
import Input from "../extra/Input";

const Registration = (props) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [error, setError] = useState({
    email: "",
    password: "",
    newPassword: "",
    code: "",
  });

  const isEmail = (value) => {
    const val = value === "" ? 0 : value;
    const validNumber = /^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(val);
    return validNumber;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!email || !password || !code || !newPassword || !isEmail(email) || (newPassword !== password)) {
      let error = {};
      if (!email) error.email = "Email Is Required !";
      if (!password) error.password = "password is required !";
      if (!newPassword) error.newPassword = "new password is required !";

      if (newPassword !== password)
        error.newPassword = "New Password and Confirm Password doesn't match !";
      if (!code) error.code = "purchase code is required !";
      return setError({ ...error });
    } else {
      let login = {
        email,
        newPassword,
        password,
        code,
      };

      props.signupAdmin(login);
    }
  };

  const handleKeyPress = (event) => {
    if (event.key === "Enter") {
      handleSubmit();
    }
  };
  return (
    <>
     

      <div className="mainLoginPage">
        <div className="loginDiv">
          <div className="row">
            <div
              className="col-xl-6 d-xxl-block d-xl-block d-none  boxCenter"
              style={{ background: "#b93160" }}
            >
              <div
                className="p-5"
                style={{
                  background: "#b93160",
                 
                }}
              >
                <img
                  className="img-fluid"
                  src={require("../../assets/images/Group 2034.png")}
                  alt=""
                
                  srcset=""
                />
              </div>
            </div>
            <div className="col-xl-6 col-md-12 boxCenter">
              <div className="loginDiv2">
                <div className="loginPage pt-3">
                  <div className="my-4">
                    <div className="loginLogo  me-3 pt-1 pe-1">
                      <img
                        src={require("../../assets/images/Frame 1627472.png")}
                        alt=""
                        width={"80px"}
                      />
                    </div>
                  </div>
                  <div
                    style={{
                      color: "rgba(0, 0, 0, 0.50)",
                      fontSize: "16px",
                      fontWeight: "400",
                      lineHeight: "22px",
                      letterSpacing: "0.48px",
                    }}
                    className=""
                  >
                    <p>Welcome back !!!</p>
                  </div>
                  <div className=" mb-3">
                    <h3
                      className="fw-bold text-dark"
                      style={{ fontSize: "56px", fontWeight: "600" }}
                    >
                      Sign Up
                    </h3>
                  </div>
                  <div className="loginInput">
                    <Input
                      label={`Email`}
                      id={`loginEmail`}
                      type={`email`}
                      value={email}
                      style={{ background: "rgba(185, 49, 96, 0.11)" }}
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

                    <Input
                      label={`Password`}
                      id={`loginPassword`}
                      type={`password`}
                      value={password}
                      errorMessage={error.password && error.password}
                      onChange={(e) => {
                        setPassword(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            password: `Password Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            password: "",
                          });
                        }
                      }}
                    />

                    <Input
                      label={`New Password`}
                      id={`newPassword`}
                      type={`password`}
                      value={newPassword}
                      errorMessage={error.newPassword && error.newPassword}
                      onChange={(e) => {
                        setNewPassword(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            newPassword: `newPassword Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            newPassword: "",
                          });
                        }
                      }}
                    />
                     <Input
                      label={`purachse Code`}
                      id={`loginpurachse Code`}
                      type={`purachse Code`}
                      value={code}
                      errorMessage={error.code && error.code}
                      onChange={(e) => {
                        setCode(e.target.value);
                        if (!e.target.value) {
                          return setError({
                            ...error,
                            code: `code Is Required`,
                          });
                        } else {
                          return setError({
                            ...error,
                            code: "",
                          });
                        }
                      }}
                    />
                  </div>
                 
                  <div className="loginButton boxCenter mt-5">
                    <Button
                      newClass={`whiteFont`}
                      btnColor={`btnBlackPrime`}
                      style={{
                        borderRadius: "20px",
                        width: "150px",
                        height: "46px",
                      }}
                      btnName={`Sign In`}
                      // btnIcon={`fa fa-sign-in`}
                      onClick={handleSubmit}
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, { signupAdmin })(Registration);
