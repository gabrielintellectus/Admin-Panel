import React, { useEffect, useState } from "react";
import Table from "../../../extra/Table";
import Pagination from "../../../extra/Pagination";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { getSellerOrder } from "../../../store/seller/seller.action";
import Button from "../../../extra/Button";

const SellerOrder = (props) => {
  const { sellerOrder } = useSelector((state) => state.seller);
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
    dispatch(getSellerOrder(state, currentPage, size, status));
  }, [dispatch, state, currentPage, size, status]);

  useEffect(() => {
    setData(sellerOrder);
  }, [sellerOrder]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleOpen = (id) => {
    navigate("/admin/order/orderDetail", {
      state: id,
    });
  };

  // table Data
  let date;

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },

    {
      Header: "Order Id",
      body: "orderId",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 fw-bold text-muted">{row.orderId}</p>
        </div>
      ),
    },
    {
      Header: "User",
      body: "userFirstName",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0">{row.userFirstName + " " + row.userLastName}</p>
        </div>
      ),
    },
    {
      Header: "Items",
      body: "items",
      Cell: ({ row }) =>
        row?.items?.map((data) => {
          return (
            <>
              <div className="py-2">
                <div className="d-flex">
                  <img
                    src={data.productId?.mainImage}
                    width={55}
                    height={55}
                    style={{
                      borderRadius: "10px",
                      margin: "5px",
                    }}
                    alt=""
                    srcset=""
                  />
                  <div className="ms-3 text-start">
                    <b className="fs-6 text-muted">
                      {data.productId?.productName}
                    </b>
                    <br />
                    <span style={{ fontSize: "13px" }}>
                      <b className="text-dark">Quantity</b> :
                      {data?.productQuantity}
                    </span>
                    <br />
                    <span style={{ fontSize: "13px" }}>
                      <b className="text-dark">Price</b> :
                      {data?.purchasedTimeProductPrice}$
                    </span>
                  </div>
                </div>
              </div>
            </>
          );
        }),
    },
    {
      Header: "PaymentGateway",
      body: "paymentGateway",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0">{row.paymentGateway}</p>
        </div>
      ),
    },
    {
      Header: "Status",
      body: "status",
      Cell: ({ row }) =>
        row.items.map((data) => {
          return (
            <>
              <div className="py-4 boxCenter">
                {(data?.status === "Pending" && (
                  <span className="badge badge-primary p-2">Pending</span>
                )) ||
                  (data?.status === "Confirmed" && (
                    <span className="badge badge-success p-2">Confirmed</span>
                  )) ||
                  (data?.status === "Cancelled" && (
                    <span className="badge badge-danger p-2">Cancelled</span>
                  )) ||
                  (data?.status === "Out Of Delivery" && (
                    <span className="badge badge-warning p-2">
                      Out Of Delivery
                    </span>
                  )) ||
                  (data?.status === "Delivered" && (
                    <span className="badge badge-info p-2">Delivered</span>
                  ))}
              </div>
            </>
          );
        }),
    },
    {
      Header: "Info",
      body: "",
      Cell: ({ row }) => (
        <>
          <Button
            newClass={`themeFont boxCenter fs-4 cursor-pointer`}
            btnColor={``}
            btnIcon={`bi bi-info-circle`}
            onClick={() => handleOpen(row?._id)}
            style={{
              cursor: "pointer",
              borderRadius: "5px",
              margin: "auto",
              width: "40px",
              color: "#04037e",
              backgroundColor: "#fff",
            }}
          />
     
        </>
      ),
    },

    // add more columns as needed
  ];
  return (
    <>
      <div className="row">
        <div className="col-12">
          <div className="btn-group p-3 ms-2">
            <button
              type="button"
              className="btn btnthemePrime dropdown-toggle"
              data-bs-toggle="dropdown"
              aria-expanded="false"
            >
              {status ? (
                <span className="caret">{status}</span>
              ) : (
                <span className="caret text-capitalize">Status</span>
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
      <div className="userMain">
        <div className="tableMain mt-2">
          <Table
            data={data}
            mapData={mapData}
            serverPerPage={rowsPerPage}
            serverPage={page}
            type={"server"}
          />
          <Pagination
            count={sellerOrder?.length}
            type={"server"}
            onPageChange={handleChangePage}
            serverPerPage={rowsPerPage}
            totalData={sellerOrder?.length}
            serverPage={currentPage}
            setCurrentPage={setCurrentPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
};

export default connect(null, { getSellerOrder })(SellerOrder);
