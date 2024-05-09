import Title from "../../extra/Title";
import {
  getUserProfile,
  userIsBlock,
  getUserOrder,
} from "../../store/user/user.action";
import ToggleSwitch from "../../extra/ToggleSwitch";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import Button from "../../extra/Button";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import EditOrder from "../Order/EditOrder";
import Male from "../../../assets/images/defaultUser.png";


const UserProfile = (props) => {
  const { userProfile, order, totalOrder } = useSelector((state) => state.user);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );


  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();

  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [status, setStatus] = useState("All");

  useEffect(() => {
    dispatch(getUserProfile(state));
  }, [dispatch, state]);

  useEffect(() => {
    dispatch(getUserOrder(state, currentPage, size, status));
  }, [dispatch, state, currentPage, size, status]);

  useEffect(() => {
    setData(order);
  }, [order]);

  const handleClick = (userDetails) => {
    
    console.log("userDetails", userDetails);
    props.userIsBlock(userDetails, userDetails.isBlock === true ? false : true);
  };

  //  pagination
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event), 10);
    setSize(parseInt(event), 10);
    setCurrentPage(1);
  };

  const handleOpen = (id) => {
    navigate("/admin/order/orderDetail", {
      state: id,
    });
  };

  return (
    <>
      <div>
        <div className="mainUserTable positon-relative">
          <div className="userTable">
            <div className="userMain">
              <div style={{ margin: "10px 18px" }}>
                <div className="row">
                  <div className="col-xl-3 col-md-12  col-12 mt-4">
                    <div
                      className="card userProfile"
                      style={{ borderRadius: "0px" }}
                    >
                      <div
                        className="card-body p-0"
                        style={{ maxHeight: "750px", minHeight: "750px" }}
                      >
                        <div
                          className=" mt-4"
                          style={{ borderBottom: "1px solid gray" }}
                        >
                          <div className=" d-flex justify-content-center  ">
                            <div className="text-center top-spacer">
                              <div className="avatar-border">
                                <div
                                  className="avatar avatar--density-default avatar--variant-flat "
                                  style={{ width: "100px", height: "100px" }}
                                >
                                  <img
                                    src={
                                      userProfile?.image
                                        ? userProfile?.image
                                        : Male
                                    }
                                    width={100}
                                    height={100}
                                    alt="Mathew"
                                  />
                                  <span className="v-avatar__underlay" />
                                </div>
                              </div>
                              <h5 className="mt-3 fs-5 fw-bold">
                                {userProfile?.firstName + userProfile?.lastName}
                              </h5>
                            </div>
                          </div>
                          <div className="px-2 mt-4">
                            <div className="row mb-4">
                              <div className="col-6 boxEnd">
                                <div className="d-flex">
                                  <div className="boxCenter">
                                 
                                  </div>
                                  <div className="ms-2">
                                    <p className="mb-1 text-center fw-bold">
                                      {userProfile?.followers}
                                    </p>
                                    <p className="text-p mb-0 font-weight-regular">
                                      Followers
                                    </p>
                                  </div>
                                </div>
                              </div>
                              <div className="col-6 ">
                                <div className="d-flex">
                                  <div className="boxCenter">
                                   
                                  </div>
                                  <div className="ms-2">
                                    <p className="mb-1 text-center fw-bold">
                                      {userProfile?.following}
                                    </p>
                                    <p className="text-p mb-0 font-weight-regular">
                                      Following
                                    </p>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </div>
                        
                        </div>
                        <div className="userAbout">
                          <h4 className="ms-2 text-muted fs-5 pt-3">Details</h4>
                        </div>
                        <div className="userDetail m-3">
                          <ul>
                            <li className="pb-4">
                              <span className="mb-0 text-h6 font-weight-regular">
                                Email
                              </span>
                              <span className="mx-2">:</span>
                              <span className="">{userProfile?.email}</span>
                            </li>
                            <li className="pb-4">
                              <span className="mb-0 text-h6 font-weight-regular">
                                Contact
                              </span>
                              <span className="mx-2">:</span>
                              <span className="">
                                {userProfile?.mobileNumber
                                  ? userProfile?.mobileNumber
                                  : "-"}
                              </span>
                            </li>
                            <li className="pb-4">
                              <span className="mb-0 text-h6 font-weight-regular">
                                Gender
                              </span>
                              <span className="mx-2">:</span>
                              <span className="">{userProfile?.gender}</span>
                            </li>
                            <li className="pb-4">
                              <span className="mb-0 text-h6 font-weight-regular">
                                Birth Date
                              </span>
                              <span className="mx-2">:</span>
                              <span className="">{userProfile?.dob}</span>
                            </li>
                            <li className="pb-4">
                              <span className="mb-0 text-h6 font-weight-regular">
                                Location
                              </span>
                              <span className="mx-2">:</span>
                              <span className="">{userProfile?.location}</span>
                            </li>

                            <li className="pb-4">
                              <span className="mb-0 text-h6 font-weight-regular">
                                Block
                              </span>
                              <span className="mx-2">:</span>

                              <ToggleSwitch
                                style={{ marginTop: "15px" }}
                                value={userProfile?.isBlock}
                                disabled={
                                  userProfile?.email ===
                                    "erashoptest@gmail.com" && true
                                }
                                onClick={() => handleClick(userProfile)}
                              />
                            </li>
                          </ul>
                        </div>
                      </div>
                    </div>
                  </div>

                  <div className="col-xl-9 col-md-12 col-12 mt-4">
                    <div
                      className="card userProfile"
                      style={{ borderRadius: "0px" }}
                    >
                      <div className="heading2 d-flex justify-content-between py-2 px-3">
                        <h5 className="fw-bold fs-5 ms-2 pt-2">
                          Order Details
                        </h5>
                        <div className="row">
                          <div className="col-12">
                            <div className="btn-group">
                              <button
                                type="button"
                                className="btn btnthemePrime dropdown-toggle"
                                data-bs-toggle="dropdown"
                                aria-expanded="false"
                              >
                                {status ? (
                                  <span className="caret">{status}</span>
                                ) : (
                                  <span className="caret text-capitalize">
                                    Status
                                  </span>
                                )}
                              </button>
                              <ul className="dropdown-menu">
                                <li style={{ cursor: "pointer" }}>
                                  <a
                                    className="dropdown-item"
                                    href={() => false}
                                    onClick={() => setStatus("Pending")}
                                  >
                                    Pending
                                  </a>
                                </li>
                                <li style={{ cursor: "pointer" }}>
                                  <a
                                    className="dropdown-item"
                                    href={() => false}
                                    onClick={() => setStatus("Confirmed")}
                                  >
                                    Confirmed
                                  </a>
                                </li>
                                <li style={{ cursor: "pointer" }}>
                                  <a
                                    className="dropdown-item"
                                    href={() => false}
                                    onClick={() => setStatus("Out Of Delivery")}
                                  >
                                    Out Of Delivery
                                  </a>
                                </li>
                                <li style={{ cursor: "pointer" }}>
                                  <a
                                    className="dropdown-item"
                                    href={() => false}
                                    onClick={() => setStatus("Delivered")}
                                  >
                                    Delivered
                                  </a>
                                </li>
                                <li style={{ cursor: "pointer" }}>
                                  <a
                                    className="dropdown-item"
                                    href={() => false}
                                    onClick={() => setStatus("Cancelled")}
                                  >
                                    Cancelled
                                  </a>
                                </li>
                                <li style={{ cursor: "pointer" }}>
                                  <a
                                    className="dropdown-item"
                                    href={() => false}
                                    onClick={() => setStatus("All")}
                                  >
                                    All
                                  </a>
                                </li>
                              </ul>
                            </div>
                          </div>
                        </div>
                      </div>
                      <div
                        className="card-body p-0"
                        style={{
                          maxHeight: "690px",
                          minHeight: "690px",
                          overflowY: "auto",
                        }}
                      >
                        <div className="dashBoardTable p-0">
                          <div className="tableMain m-0">
                            <div className="primeMain">
                              <table
                                width="100%"
                                border
                                className="primeTable text-center"
                                style={{ maxHeight: "680px" }}
                              >
                                <thead
                                  className="sticky-top"
                                  style={{ top: "-1px", zIndex: "1" }}
                                >
                                  <tr>
                                    <th
                                      className="fw-bold py-3"
                                      style={{ width: "330px" }}
                                    >
                                      No
                                    </th>
                                    <th
                                      className="fw-bold py-3"
                                      style={{ width: "330px" }}
                                    >
                                      Order Id
                                    </th>
                                    <th
                                      className="fw-bold py-3"
                                      style={{ width: "450px" }}
                                    >
                                      Items
                                    </th>
                                    <th
                                      className="fw-bold py-3"
                                      style={{ width: "330px" }}
                                    >
                                      Price
                                    </th>
                                    <th
                                      className="fw-bold py-3"
                                      style={{ width: "330px" }}
                                    >
                                      Shipping Charge
                                    </th>
                                    <th
                                      className="fw-bold py-3"
                                      style={{ width: "330px" }}
                                    >
                                      Status
                                    </th>
                                   
                                  </tr>
                                </thead>
                                <tbody>
                                  {data?.length > 0 ? (
                                    <>
                                      {data?.map((mapData, index) => {
                                        return (
                                          <>
                                            <tr>
                                              <td>
                                                <span>{index + 1}</span>
                                              </td>
                                              <td width="160px">
                                                <span className="tableBoldFont orderId">
                                                  <b
                                                    className="fw-bold orderIdText"
                                                    onClick={() =>
                                                      handleOpen(mapData)
                                                    }
                                                    style={{
                                                      cursor: "pointer",
                                                      color: "#0B5ED7",
                                                    }}
                                                  >
                                                    {mapData?.orderId}
                                                  </b>
                                                </span>
                                              </td>

                                              <td
                                                colSpan={6}
                                                style={{ width: "70%" }}
                                                className="py-0"
                                              >
                                                {mapData?.items.map((data) => {
                                                  return (
                                                    <>
                                                      <div className="">
                                                        <table
                                                          width="100%"
                                                          border
                                                          className=" text-center"
                                                        >
                                                          <tbody>
                                                            <tr
                                                              style={{
                                                                borderLeft:
                                                                  "2px solid #f3f3f3",
                                                              }}
                                                            >
                                                              <td
                                                                className="my-2"
                                                                style={{
                                                                  width:
                                                                    "350px",
                                                                }}
                                                              >
                                                                <div className="">
                                                                  <div className="d-flex">
                                                                    <img
                                                                      src={
                                                                        data
                                                                          .productId
                                                                          ?.mainImage
                                                                      }
                                                                      width={55}
                                                                      height={
                                                                        55
                                                                      }
                                                                      style={{
                                                                        borderRadius:
                                                                          "10px",
                                                                        margin:
                                                                          "5px",
                                                                      }}
                                                                      alt=""
                                                                      srcset=""
                                                                    />
                                                                    <div className="ms-3 text-start">
                                                                      <b className="fs-6 text-muted">
                                                                        {
                                                                          data
                                                                            .productId
                                                                            ?.productName
                                                                        }
                                                                      </b>
                                                                      <br />
                                                                      <span
                                                                        style={{
                                                                          fontSize:
                                                                            "13px",
                                                                        }}
                                                                      >
                                                                        <b className="text-dark">
                                                                          Quantity
                                                                        </b>
                                                                        :
                                                                        {
                                                                          data?.productQuantity
                                                                        }
                                                                      </span>
                                                                      <br />
                                                                      <span
                                                                        style={{
                                                                          fontSize:
                                                                            "13px",
                                                                        }}
                                                                      >
                                                                        <b className="text-dark">
                                                                          Price
                                                                        </b>
                                                                        :
                                                                        {
                                                                          data?.purchasedTimeProductPrice
                                                                        }
                                                                        $
                                                                      </span>
                                                                    </div>
                                                                  </div>
                                                                </div>
                                                              </td>
                                                              <td
                                                                className="my-2"
                                                                style={{
                                                                  width:
                                                                    "550px",
                                                                }}
                                                              >
                                                                <div className="">
                                                                  <b className="fs-6">
                                                                    {data?.purchasedTimeProductPrice *
                                                                      data?.productQuantity}
                                                                    $
                                                                  </b>
                                                                </div>
                                                              </td>
                                                              <td
                                                                className="my-2"
                                                                style={{
                                                                  width:
                                                                    "450px",
                                                                }}
                                                              >
                                                                <div className="">
                                                                  <b className="fs-6">
                                                                    {
                                                                      data?.purchasedTimeShippingCharges
                                                                    }
                                                                    $
                                                                  </b>
                                                                </div>
                                                              </td>
                                                              <td
                                                                className="my-2"
                                                                style={{
                                                                  width:
                                                                    "250px",
                                                                }}
                                                              >
                                                                <div className="boxCenter">
                                                                  {(data?.status ===
                                                                    "Pending" && (
                                                                    <span className="badge badge-primary p-2">
                                                                      Pending
                                                                    </span>
                                                                  )) ||
                                                                    (data?.status ===
                                                                      "Confirmed" && (
                                                                      <span className="badge badge-success p-2">
                                                                        Confirmed
                                                                      </span>
                                                                    )) ||
                                                                    (data?.status ===
                                                                      "Cancelled" && (
                                                                      <span className="badge badge-danger p-2">
                                                                        Cancelled
                                                                      </span>
                                                                    )) ||
                                                                    (data?.status ===
                                                                      "Out Of Delivery" && (
                                                                      <span className="badge badge-warning p-2">
                                                                        Out Of
                                                                        Delivery
                                                                      </span>
                                                                    )) ||
                                                                    (data?.status ===
                                                                      "Delivered" && (
                                                                      <span className="badge badge-info p-2">
                                                                        Delivered
                                                                      </span>
                                                                    ))}
                                                                </div>
                                                              </td>
                                                             
                                                            </tr>
                                                          </tbody>
                                                        </table>
                                                      </div>
                                                    </>
                                                  );
                                                })}
                                              </td>
                                            </tr>
                                          </>
                                        );
                                      })}
                                    </>
                                  ) : (
                                    <tr>
                                      <td colSpan="12" className="text-center">
                                        No Data Found !
                                      </td>
                                    </tr>
                                  )}
                                </tbody>
                              </table>
                            </div>
                            <Pagination
                              component="div"
                              count={totalOrder}
                              totalData={totalOrder}
                              type={"server"}
                              onPageChange={handleChangePage}
                              serverPerPage={rowsPerPage}
                              serverPage={currentPage}
                              setCurrentPage={setCurrentPage}
                              onRowsPerPageChange={handleChangeRowsPerPage}
                            />
                          </div>
                        </div>
                      </div>
                    </div>
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

export default connect(null, { getUserProfile, userIsBlock, getUserOrder })(
  UserProfile
);
