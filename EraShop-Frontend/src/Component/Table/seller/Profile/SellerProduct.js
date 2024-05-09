import React from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import Pagination from "../../../extra/Pagination";
import { useLocation, useNavigate } from "react-router-dom";
import { useEffect } from "react";
import { useState } from "react";
import { getSellerProduct } from "../../../store/seller/seller.action";
import {
  NewCollection,
  outOfStock,
} from "../../../store/product/product.action";
import ToggleSwitch from "../../../extra/ToggleSwitch";
import Table from "../../../extra/Table";
import Button from "../../../extra/Button";

const SellerProduct = (props) => {
  const { product } = useSelector((state) => state.seller);
  const { state } = useLocation();
  const navigate = useNavigate();
  const dispatch = useDispatch();



  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getSellerProduct(state));
  }, [dispatch, state]);

  useEffect(() => {
    setData(product);
  }, [product]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  // toggle switch

  const handleClick = (product, data) => {
    props.NewCollection(product, data);
  };

  const handleOpen = (id) => {
    navigate("/admin/productDetail", {
      state: id,
    });
  };

  // table Data

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },
    {
      Header: "Product",
      body: "image",
      Cell: ({ row }) => (
        <div className="d-flex">
          <div className="">
            <img
              src={row.mainImage}
              style={{ borderRadius: "10px" }}
              height={50}
              width={50}
              alt=""
            />
          </div>
          <span className=" ms-2">
            <span className="">{row.productName}</span> <br />
            <p className="text-muted text-start">
              {"review (" + row.review + ")"}
            </p>
          </span>
        </div>
      ),
    },


    {
      Header: "Product Code",
      body: "productCode",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 fw-bold text-muted">{row.productCode}</p>
        </div>
      ),
    },
    {
      Header: "Category",
      body: "category",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0">
            {row.subCategory.name + "(" + row.category.name + ")"}
          </p>
        </div>
      ),
    },

    {
      Header: "Shipping Charge",
      body: "shippingCharges",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0">{row.shippingCharges} $</p>
        </div>
      ),
    },
    {
      Header: "Selling Price",
      body: "price",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0">{row.price} $</p>
        </div>
      ),
    },

    {
      Header: "Info",
      body: "",
      Cell: ({ row }) => (
        <Button
          newClass={`themeFont boxCenter userBtn fs-4`}
          btnColor={``}
          
          btnIcon={`bi bi-info-circle`}
          onClick={() => handleOpen(row._id)}
          
          style={{
            borderRadius: "5px",
            margin: "auto",
            width: "40px",
            backgroundColor: "#fff",
          }}
        />
      ),
    },

    // add more columns as needed
  ];
  return (
    <>
      <div className="userMain">
    
        <div className="tableMain mt-4">
          <Table
            data={data}
            mapData={mapData}
            PerPage={rowsPerPage}
            Page={page}
            type={"client"}
          />
          <Pagination
            component="div"
            count={product?.length}
            serverPage={page}
            type={"client"}
            onPageChange={handleChangePage}
            serverPerPage={rowsPerPage}
            totalData={product?.length}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </div>
      </div>
    </>
  );
};

export default connect(null, { getSellerProduct, NewCollection, outOfStock })(
  SellerProduct
);
