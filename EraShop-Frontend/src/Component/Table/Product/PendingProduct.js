import dayjs from "dayjs";
import React, { useEffect, useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import $ from "jquery";
import Button from "../../extra/Button";

import Searching from "../../extra/Searching";
import {
  getProductRequest,
  productAction,
  getUpdateProductRequest,
  updateProductAction,
} from "../../store/product/product.action";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../util/SkeletonColor";
import "react-loading-skeleton/dist/skeleton.css";

const PendingProduct = (props) => {
  const dispatch = useDispatch();

  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [updateData, setupdateData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [type, setType] = useState("Pending");
  const [status, setStatus] = useState("Create");

  const { productRequest, updateProductRequest } = useSelector(
    (state) => state.product
  );

  

  useEffect(() => {
    if (status === "Create") {
      dispatch(getProductRequest(type));
      setData([]);
    } else {
      dispatch(getUpdateProductRequest(type));
      setData([]);
    }
  }, [dispatch, type, status]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    if (status === "Create") {
      setData(productRequest);
    } else {
      setupdateData(updateProductRequest);
    }
  }, [productRequest, updateProductRequest]);

  // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  // create
  const handleApproved = (productId) => {
    
    if (status === "Create") {
      props.productAction(productId, "Approved");
    } else {
      props.updateProductAction(productId, "Approved");
    }
  };
  const handleRejected = (productId) => {
    

    if (status === "Create") {
      props.productAction(productId, "Rejected");
    } else {
      props.updateProductAction(productId, "Rejected");
    }
  };


 

  // table Data

  // create request

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span>{parseInt(index) + 1}</span>,
    },
    {
      Header: "Product",
      body: "image",
      Cell: ({ row }) => (
        <div className="d-flex ">
          <div className="position-relative">
            {loading ? (
              <>
                <Skeleton
                  height={60}
                  width={60}
                  className="StripeElement "
                  baseColor={colors?.baseColor}
                  highlightColor={colors?.highlightColor}
                />
              </>
            ) : (
              <>
                <img
                  src={row?.mainImage}
                  height={60}
                  width={60}
                  style={{ borderRadius: "10px" }}
                  alt=""
                />
              </>
            )}
          </div>
          <span className="ms-2 boxCenter">{row.productName}</span>
        </div>
      ),
    },

    { Header: "Product Code", body: "productCode" },

    {
      Header: "Price",
      body: "price",
      Cell: ({ row }) => (
        <span className="fw-bold text-dark">${row.price}</span>
      ),
    },
    {
      Header: "Shipping Charges",
      body: "shippingCharges",
      Cell: ({ row }) => <span>${row.shippingCharges}</span>,
    },

    {
      Header: "CreatedDate",
      body: "createdAt",
      Cell: ({ row }) => (
        <span>{dayjs(row.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    {
      Header: "Create Status",
      body: "status",
      Cell: ({ row }) => (
        <div className="boxCenter">
          <span className="badge badge-primary p-2">
            {status === "Create" ? (
              <>{row.createStatus}</>
            ) : (
              <>{row.updateStatus}</>
            )}
          </span>
        </div>
      ),
    },

    {
      Header: "Accept",
      body: "",
      Cell: ({ row }) => (
        <>
          <Button
            newClass={`themeFont boxCenter userBtn fs-5`}
           
            btnIcon={`fa-solid fa-check`}
            style={{
              borderRadius: "5px",
              margin: "auto",
              width: "40px",
              backgroundColor: "#fff",
              color: "green",
              cursor: "pointer",
            }}
            onClick={() => handleApproved(row?._id)}
          />
        </>
      ),
    },

    {
      Header: "Reject",
      body: "",
      Cell: ({ row }) => (
        <>
          <Button
            newClass={`themeFont boxCenter userBtn fs-5`}
           
            btnIcon={`fa-sharp fa-solid fa-xmark`}
            style={{
              borderRadius: "5px",
              margin: "auto",
              width: "40px",
              backgroundColor: "#fff",
              color: "red",
              cursor: "pointer",
            }}
            onClick={() => handleRejected(row?._id)}
          />
        </>
      ),
    },

    // add more columns as needed
  ];


  // searching
  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  return (
    <>
      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="sellerHeader primeHeader">
            <div className="row">
              <div className="col-4 d-flex" id="">
                <Button
                  newClass={`themeFont mx-2 text-light ${
                    status === "Create" ? "create-btn" : "default-btn"
                  }`}
                  btnName={`New Items `}
                  style={{
                    borderRadius: "5px",
                    width: "auto",

                    cursor: "pointer",
                  }}
                  onClick={() => setStatus("Create")}
                />
                <Button
                  newClass={`themeFont mx-2 text-light ${
                    status === "Update" ? "update-btn" : "default-btn"
                  }`}
                  btnName={`Updated Items`}
                  style={{
                    borderRadius: "5px",
                    width: "auto",

                    cursor: "pointer",
                  }}
                  onClick={() => setStatus("Update")}
                />
              </div>
              <div className="col-8">
                <Searching
                  type={`client`}
                  data={productRequest}
                  setData={setData}
                  column={data}
                  onFilterData={handleFilterData}
                  serverSearching={handleFilterData}
                  button={true}
                  setSearchValue={setSearch}
                  searchValue={search}
                />
              </div>
            </div>
          </div>
          <div className="sellerMain">
            <div className="tableMain">
              {type == "Pending" && (
                <>
                  <Table
                    data={status === "Create" ? data : updateData}
                    mapData={mapData}
                    PerPage={rowsPerPage}
                    Page={page}
                    type={"client"}
                  />
                </>
              )}
              <Pagination
                component="div"
                count={status === "Create" ? data?.length : updateData?.length}
                serverPage={page}
                type={"client"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={status === "Create" ? data?.length : updateData?.length}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
          <div className="sellerFooter primeFooter"></div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getProductRequest,
  productAction,
  getUpdateProductRequest,
  updateProductAction,
})(PendingProduct);
