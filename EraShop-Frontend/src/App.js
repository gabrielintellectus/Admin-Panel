import "./App.css";
import Login from "./Component/Pages/Login.js";

import Admin from "./Component/Pages/Admin";
import PrivateRoute from "./Component/util/PrivateRoute";
import { useDispatch, useSelector } from "react-redux";

import { Route, Routes, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { LOGIN_ADMIN } from "./Component/store/admin/admin.type";
import { setToken } from "./Component/util/setAuth";
import AuthRoute from "./Component/util/AuthRoute";
import Registration from "./Component/Pages/Registration.js";
import UpdateCode from "./Component/Pages/UpdateCode.js";
import axios from "axios";

function App() {
  const dispatch = useDispatch();
  const key = sessionStorage.getItem("key");
  const token = sessionStorage.getItem("token");
  const [login, setLogin] = useState(true);

  useEffect(() => {
    axios
      .get("/login")
      .then((res) => {
        setLogin(res.data.login);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  useEffect(() => {
    if (!token && !key) return;
    dispatch({ type: LOGIN_ADMIN, payload: token });
  }, [setToken, key]);

  // const isAuth = true;
  const navigate = useNavigate();
  const isAuth = useSelector((state) => state.admin.isAuth);
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={login ? <Login /> : <Registration />} />
        {login && <Route path="/login" element={<Login />} />}
        <Route path="/registration" element={<Registration />} />
        <Route path="/code" element={<UpdateCode />} />
        <Route element={<PrivateRoute />}>
          <Route path="/admin/*" element={<Admin />} />
        </Route>
      </Routes>
    </div>
  );
}

export default App;
