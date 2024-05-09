import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { getOrderDetail, orderUpdate } from "../../store/order/order.action";
import { useLocation, useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import EditOrder from "./EditOrder";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../util/SkeletonColor";
import "react-loading-skeleton/dist/skeleton.css";

const OrderDetail = (props) => {
  const { orderDetail } = useSelector((state) => state.order);

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );

  const { state } = useLocation();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [size, setSize] = useState(10);
  const [page, setPage] = useState(0);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const dispatch = useDispatch();
  const navigate = useNavigate();

  console.log("state", orderDetail);

  useEffect(() => {
    dispatch(getOrderDetail(state?._id ? state?._id : state));
  }, [dispatch, state]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(orderDetail);
  }, [orderDetail]);

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span>{parseInt(index) + 1}</span>,
    },

    {
      Header: "Iteam Detail",
      body: "",
      Cell: ({ row }) => (
        <>
          <div className="">
            <div className="d-flex">
              {loading ? (
                <>
                  <Skeleton
                    height={55}
                    width={55}
                    className="StripeElement "
                    baseColor={colors?.baseColor}
                    highlightColor={colors?.highlightColor}
                  />
                </>
              ) : (
                <>
                  <img
                    src={row.productId?.mainImage}
                    style={{
                      borderRadius: "10px",
                      width: "70px",
                      height: "70px",
                      objectFit: "cover",
                    }}
                    alt=""
                    srcset=""
                  />
                </>
              )}
              <div className="ms-3 text-start">
                <p
                  className="text-muted fw-bold mb-0"
                  style={{ fontSize: "18px", color: "rgb(64,81,137)" }}
                >
                  {row.productId?.productName}
                </p>
           
                {row?.attributesArray.map((att) => {
                  return (
                    <>
                      <span style={{ fontSize: "14px" }}>
                        {att?.name} :-
                        <b
                          className="text-dark ms-1"
                          style={{ fontSize: "14px" }}
                        >
                          {att?.value}
                        </b>
                      </span>
                      <br />
                    </>
                  );
                })}
              </div>
            </div>
          </div>
        </>
      ),
    },

    {
      Header: "Price",
      body: "price",
      Cell: ({ row }) => {
        return (
          <>
            <div className="">
              <span>{"$" + row.purchasedTimeProductPrice}</span>
            </div>
          </>
        );
      },
    },

    {
      Header: "Quantity",
      body: "Quantity",
      Cell: ({ row }) => {
        return (
          <>
            <div className="">
              <span>{row.productQuantity}</span>
            </div>
          </>
        );
      },
    },

 

    {
      Header: "Shipping Charge",
      body: "purchasedTimeShippingCharges",
      Cell: ({ row }) => {
        return (
          <>
            <span className="fs-6">{row?.purchasedTimeShippingCharges}$</span>
          </>
        );
      },
    },
    {
      Header: "Delivered Service",
      body: "deliveredServiceName",
      Cell: ({ row }) => {
        return (
          <>
            <span className="fs-6">
              {row?.deliveredServiceName ? row?.deliveredServiceName : "-"}
            </span>
          </>
        );
      },
    },

    {
      Header: "Status",
      body: "status",
      Cell: ({ row }) => {
        return (
          <>
            {(row?.status === "Pending" && (
              <span className="badge badge-primary p-2">Pending</span>
            )) ||
              (row?.status === "Confirmed" && (
                <span className="badge badge-success p-2">Confirmed</span>
              )) ||
              (row?.status === "Cancelled" && (
                <span className="badge badge-danger p-2">Cancelled</span>
              )) ||
              (row?.status === "Out Of Delivery" && (
                <span className="badge badge-warning p-2">Out Of Delivery</span>
              )) ||
              (row?.status === "Delivered" && (
                <span className="badge badge-info p-2">Delivered</span>
              ))}
          </>
        );
      },
    },

    {
      Header: "Total",
      body: "purchTotal AmountasedTimeShippingCharges",
      Cell: ({ row }) => {
        return (
          <>
            <b className="fs-6">
              {row?.purchasedTimeProductPrice * row?.productQuantity}$
            </b>
          </>
        );
      },
    },


    // add more columns as needed
  ];

  return (
    <>
      <div>
        <div className="mainUserTable">
          <div className="userTable">
            <div className="userMain">
              <div style={{ margin: "10px 18px" }}>
                <div className="row">
                  <div className="col-xl-9 col-md-12 col-12">
                    <div className="card mt-3" style={{ borderRadius: "5px" }}>
                      <div className="card-header">
                        <p className="fs-5 fw-bolder">
                          OrderID :{orderDetail?.orderId}
                        </p>
                      </div>
                      <div className="card-body p-0">
                        <div className="dashBoardTable">
                          <div className="tableMain m-0">
                            <Table
                              data={data?.items}
                              mapData={mapData}
                              PerPage={rowsPerPage}
                              Page={page}
                              type={"client"}
                            />
                          </div>
                        </div>
                        <div className="row mb-3">
                          <div className="col-md-6">
                            <table className="w-100 ms-4">
                              <tbody>
                                <tr className="text-start ">
                                  <td
                                    width="180px"
                                    className="py-3 text-profile "
                                  >
                                    Total Items
                                  </td>
                                  <td width="30px">:</td>
                                  <td className="text-capitalize text-start">
                                    {orderDetail?.totalItems}
                                  </td>
                                </tr>
                                <tr className="text-start ">
                                  <td
                                    width="180px"
                                    className="py-3 text-profile "
                                  >
                                    Total Quantity
                                  </td>
                                  <td width="30px">:</td>
                                  <td className="text-capitalize text-start">
                                    {orderDetail?.totalQuantity}
                                  </td>
                                </tr>
                              </tbody>
                            </table>
                          </div>
                          <div className="col-md-6 d-flex justify-content-end">
                            <div>
                              <table className="w-100">
                                <tbody>
                                  <tr className="text-start ">
                                    <td
                                      width="180px"
                                      className="py-3 text-profile "
                                    >
                                      <b>Amount</b>
                                    </td>
                                    <td width="30px">:</td>
                                    <td className="text-capitalize text-start">
                                      <b> {orderDetail?.subTotal} $</b>
                                    </td>
                                  </tr>
                                  <tr className="text-start ">
                                    <td
                                      width="180px"
                                      className="py-3 text-profile "
                                    >
                                      <b>Shipping Charge</b>
                                    </td>
                                    <td width="30px">:</td>
                                    <td className="text-capitalize text-success text-start">
                                      <b>
                                        {" "}
                                        {"+" +
                                          orderDetail?.totalShippingCharges}{" "}
                                        $
                                      </b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="180px" className="py-3"></td>
                                    <td width="30px"></td>
                                    <td className="text-capitalize text-start">
                                      <hr width="60px" />
                                    </td>
                                  </tr>
                                  <tr className="text-start ">
                                    <td
                                      width="180px"
                                      className=" text-profile "
                                    >
                                      <b>Total Amount</b>
                                    </td>
                                    <td width="30px">:</td>
                                    <td className="text-capitalize text-start">
                                      <b> {orderDetail?.total} $</b>
                                    </td>
                                  </tr>
                                  <tr className="text-start ">
                                    <td
                                      width="180px"
                                      className=" text-profile "
                                    >
                                      <b>Discount</b>
                                    </td>
                                    <td width="30px">:</td>
                                    <td className="text-capitalize text-danger text-start">
                                      <b> {"-" + orderDetail?.discount} $</b>
                                    </td>
                                  </tr>
                                  <tr>
                                    <td width="180px" className="">
                                 
                                    </td>
                                    <td width="30px"></td>
                                    <td className="text-capitalize text-start">
                                      <hr width="60px" />
                                    </td>
                                  </tr>
                                  <tr className="text-start ">
                                    <td
                                      width="180px"
                                      className=" text-profile "
                                    >
                                      <b>Total</b>
                                    </td>
                                    <td width="30px">:</td>
                                    <td className="text-capitalize text-start">
                                      <b> {orderDetail?.finalTotal} $</b>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                  <div className="col-xl-3">
                    <div className="card mt-3" style={{ borderRadius: "5px" }}>
                      <div className="card-header">
                        <div className="d-flex py-2">
                          <h5 className="card-title fw-bold flex-grow-1 mb-0">
                            <i className="bi bi-truck align-middle me-1 text-muted" />{" "}
                            Logistics Details
                          </h5>
                          <div className="flex-shrink-0">
                            <a
                              href="javascript:void(0);"
                              className="badge bg-secondary-subtle text-secondary fs-11"
                            >
                              Track Order
                            </a>
                          </div>
                        </div>
                      </div>
                      <div className="card-body">
                        {data?.items?.map((item) => {
                          return (
                            <>
                              <div className="d-flex my-2">
                                <div className="item-img">
                                  {loading ? (
                                    <>
                                      <Skeleton
                                        height={70}
                                        width={70}
                                        className="StripeElement "
                                        baseColor={colors?.baseColor}
                                        highlightColor={colors?.highlightColor}
                                      />
                                    </>
                                  ) : (
                                    <>
                                      <img
                                        src={item.productId?.mainImage}
                                        style={{
                                          borderRadius: "10px",
                                          width: "70px",
                                          height: "70px",
                                          objectFit: "cover",
                                        }}
                                        alt=""
                                      />
                                    </>
                                  )}
                                </div>
                                <span className="d-flex align-items-center mx-2">
                                  {" "}
                                  :-
                                </span>
                                <div className="item-content d-flex align-items-center">
                                  <span className="f-bold">
                                    <a
                                      className="fs-5"
                                      style={{ textDecoration: "underline" }}
                                      href={item?.trackingLink}
                                      target="_blank"
                                    >
                                      {item?.trackingLink
                                        ? item?.trackingLink
                                        : "-"}
                                    </a>
                                  </span>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                    </div>
                    <div className="card mt-4" style={{ borderRadius: "5px" }}>
                      <div className="card-header">
                        <h5 className="card-title fw-bold my-2">
                          <i className="bi bi-geo-alt align-middle me-1 fw-bold text-muted" />{" "}
                          Shipping Address
                        </h5>
                      </div>
                      <div className="card-body">
                        <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
                          <li className="fw-bold fs-14">
                            {data?.shippingAddress?.name}
                          </li>
                          <li className="py-1">
                            {data?.shippingAddress?.address}
                          </li>
                          <li className="py-1">
                            {data?.shippingAddress?.city}
                          </li>
                          <li className="py-1">
                            {data?.shippingAddress?.state}
                          </li>
                          <li className="py-1">
                            {data?.shippingAddress?.country +
                              " - " +
                              data?.shippingAddress?.zipCode}
                          </li>
                        </ul>
                      </div>
                    </div>
                    {data?.promoCode?.promoCode === null ? (
                      <></>
                    ) : (
                      <>
                        <div
                          className="card mt-4"
                          style={{ borderRadius: "5px" }}
                        >
                          <div className="card-header">
                            <h5 className="card-title fw-bold my-2">
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="35"
                                height="35"
                                viewBox="0 0 35 35"
                                fill="none"
                                className="me-2"
                              >
                                <path
                                  d="M29.5312 7.65625H14.1903C13.4842 7.65751 12.7976 7.88779 12.2336 8.3125C11.8589 8.5911 11.4044 8.74155 10.9375 8.74155C10.4706 8.74155 10.0161 8.5911 9.64141 8.3125C9.07717 7.88814 8.39069 7.65791 7.68469 7.65625H5.46875C4.59851 7.65625 3.76391 8.00195 3.14856 8.61731C2.5332 9.23266 2.1875 10.0673 2.1875 10.9375V24.0625C2.1875 24.9327 2.5332 25.7673 3.14856 26.3827C3.76391 26.998 4.59851 27.3437 5.46875 27.3438H7.68469C8.39075 27.3425 9.07736 27.1122 9.64141 26.6875C10.0161 26.4089 10.4706 26.2585 10.9375 26.2585C11.4044 26.2585 11.8589 26.4089 12.2336 26.6875C12.7978 27.1119 13.4843 27.3421 14.1903 27.3438H29.5312C30.4015 27.3437 31.2361 26.998 31.8514 26.3827C32.4668 25.7673 32.8125 24.9327 32.8125 24.0625V10.9375C32.8125 10.0673 32.4668 9.23266 31.8514 8.61731C31.2361 8.00195 30.4015 7.65625 29.5312 7.65625ZM30.625 24.0625C30.625 24.3526 30.5098 24.6308 30.3046 24.8359C30.0995 25.041 29.8213 25.1562 29.5312 25.1562H14.1903C13.9585 25.1554 13.7333 25.0786 13.5494 24.9375C13.0958 24.5995 12.5799 24.3546 12.0312 24.2167V22.9688C12.0312 22.6787 11.916 22.4005 11.7109 22.1954C11.5058 21.9902 11.2276 21.875 10.9375 21.875C10.6474 21.875 10.3692 21.9902 10.1641 22.1954C9.95898 22.4005 9.84375 22.6787 9.84375 22.9688V24.2167C9.29513 24.3556 8.77926 24.6013 8.32562 24.9397C8.14189 25.0812 7.91659 25.1581 7.68469 25.1584H5.46875C5.17867 25.1584 4.90047 25.0432 4.69535 24.8381C4.49023 24.633 4.375 24.3548 4.375 24.0647V10.9375C4.375 10.6474 4.49023 10.3692 4.69535 10.1641C4.90047 9.95898 5.17867 9.84375 5.46875 9.84375H7.68469C7.91651 9.84461 8.14165 9.92145 8.32562 10.0625C8.77955 10.3973 9.29565 10.6382 9.84375 10.7712V12.0312C9.84375 12.3213 9.95898 12.5995 10.1641 12.8046C10.3692 13.0098 10.6474 13.125 10.9375 13.125C11.2276 13.125 11.5058 13.0098 11.7109 12.8046C11.916 12.5995 12.0312 12.3213 12.0312 12.0312V10.7712C12.5793 10.637 13.0953 10.3954 13.5494 10.0603C13.7331 9.91883 13.9584 9.84193 14.1903 9.84156H29.5312C29.8213 9.84156 30.0995 9.9568 30.3046 10.1619C30.5098 10.367 30.625 10.6452 30.625 10.9353V24.0625Z"
                                  fill="#7A7A7A"
                                />
                                <path
                                  d="M10.9375 14.583C10.6474 14.583 10.3692 14.6982 10.1641 14.9033C9.95898 15.1084 9.84375 15.3866 9.84375 15.6767V19.3233C9.84375 19.6133 9.95898 19.8915 10.1641 20.0967C10.3692 20.3018 10.6474 20.417 10.9375 20.417C11.2276 20.417 11.5058 20.3018 11.7109 20.0967C11.916 19.8915 12.0312 19.6133 12.0312 19.3233V15.6767C12.0312 15.3866 11.916 15.1084 11.7109 14.9033C11.5058 14.6982 11.2276 14.583 10.9375 14.583ZM24.383 13.4455L17.8205 20.008C17.716 20.1089 17.6327 20.2295 17.5754 20.363C17.518 20.4964 17.4879 20.6399 17.4866 20.7852C17.4853 20.9304 17.513 21.0744 17.568 21.2088C17.623 21.3433 17.7042 21.4654 17.8069 21.5681C17.9096 21.6708 18.0317 21.752 18.1661 21.807C18.3006 21.862 18.4446 21.8896 18.5898 21.8884C18.735 21.8871 18.8786 21.857 19.012 21.7996C19.1454 21.7423 19.2661 21.659 19.367 21.5545L25.9295 14.992C26.1288 14.7857 26.239 14.5095 26.2365 14.2227C26.234 13.9359 26.119 13.6616 25.9162 13.4588C25.7134 13.256 25.4391 13.141 25.1523 13.1385C24.8655 13.136 24.5893 13.2462 24.383 13.4455Z"
                                  fill="#7A7A7A"
                                />
                                <path
                                  d="M19.1406 16.4062C20.0467 16.4062 20.7812 15.6717 20.7812 14.7656C20.7812 13.8595 20.0467 13.125 19.1406 13.125C18.2345 13.125 17.5 13.8595 17.5 14.7656C17.5 15.6717 18.2345 16.4062 19.1406 16.4062Z"
                                  fill="#7A7A7A"
                                />
                                <path
                                  d="M24.6094 21.875C25.5155 21.875 26.25 21.1405 26.25 20.2344C26.25 19.3283 25.5155 18.5938 24.6094 18.5938C23.7033 18.5938 22.9688 19.3283 22.9688 20.2344C22.9688 21.1405 23.7033 21.875 24.6094 21.875Z"
                                  fill="#7A7A7A"
                                />
                              </svg>
                              Promocode
                            </h5>
                          </div>
                          <div className="card-body">
                            <ul className="list-unstyled vstack gap-2 fs-13 mb-0">
                              <li className=" fs-14">
                                PromoCode : {data?.promoCode?.promoCode}
                              </li>
                              <li className="py-1">
                                Discount Amount :{" "}
                                {data?.promoCode?.discountAmount}{" "}
                                {data?.promoCode?.discountType === 1
                                  ? "%"
                                  : "$"}
                              </li>
                            </ul>
                          </div>
                        </div>
                      </>
                    )}
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

export default connect(null, { getOrderDetail, orderUpdate })(OrderDetail);
