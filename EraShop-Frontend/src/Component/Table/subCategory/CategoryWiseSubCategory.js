import React from "react";
import Button from "../../extra/Button";
import { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getCategoryWiseSubCategory,
  deleteSubCategory,
} from "../../store/subCategory/subCategory.action";

import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import SubCategoryDialoge from "./SubCategoryDialoge";
import {  warning } from "../../util/Alert";
import Table from "../../extra/Table";
import Pagination from "../../extra/Pagination";
import { useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../util/SkeletonColor";

const CategoryWiseSubCategory = (props) => {
  const { categoryWiseSubCategory } = useSelector((state) => state.subCategory);

  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  

  const [size, setSize] = useState(10);
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [loading, setLoading] = useState(true);

  const dispatch = useDispatch();
  const { state } = useLocation();

  useEffect(() => {
    dispatch(getCategoryWiseSubCategory(state?.id));
  }, [dispatch, state]);

  useEffect(() => {
    setData(categoryWiseSubCategory);
  }, [categoryWiseSubCategory]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  console.log("categoryWiseSubCategory", categoryWiseSubCategory);

  const navigate = useNavigate();
  // Delete Category
  const handleDelete = (id) => {
    

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteSubCategory(id);
        }
      })
      .catch((err) => console.log(err));
  };

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },
    {
      Header: "Image",
      body: "image",
      Cell: ({ row }) => (
        <>
          {loading ? (
            <>
              <Skeleton
                height={80}
                width={80}
                className="StripeElement "
                baseColor={colors?.baseColor}
                highlightColor={colors?.highlightColor}
              />
            </>
          ) : (
            <>
              <img
                src={row?.image}
                style={{ borderRadius: "10px", cursor: "pointer" }}
                height={80}
                width={80}
                alt=""
              />
            </>
          )}
        </>
      ),
    },
    {
      Header: "Sub Category",
      body: "name",
      Cell: ({ row }) => (
        console.log("row", row),
        (
          <div className="">
            <p className="mb-0 fw-bolder">{row?.name}</p>
            <p className="text-muted text-center">
              {"(" + row?.category + ")"}
            </p>
          </div>
        )
      ),
    },
    {
      Header: "Product",
      body: "name",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 fw-bolder">
            {row?.sameSubcategoryProductCount
              ? row?.sameSubcategoryProductCount
              : 0}
          </p>
        </div>
      ),
    },
    {
      Header: "Edit",
      body: "",
      Cell: ({ row }) => (
        <Button
          newClass={`themeFont boxCenter userBtn fs-5`}
          btnIcon={`fa-solid fa-edit`}
          style={{
            borderRadius: "5px",
            margin: "auto",
            width: "40px",
            backgroundColor: "#fff",
            color: "#160d98",
          }}
          onClick={() => {
            dispatch({
              type: OPEN_DIALOGUE,
              payload: { data: row, type: "subCategory" },
            });
          }}
        />
      ),
    },
    {
      Header: "Delete",
      body: "",
      Cell: ({ row }) => (
        <button
          className={`themeBtn text-center `}
          style={{
            borderRadius: "5px",
            margin: "auto",
            width: "40px",
            backgroundColor: "#fff",
            color: "#cd2c2c",
          }}
          onClick={() => handleDelete(row?.subCategoryId)}
        >
          <svg
            width="25"
            height="25"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              d="M4.04017 6L4.9258 16.6912C4.98927 17.4622 5.646 18.0667 6.41993 18.0667H14.5801C15.354 18.0667 16.0108 17.4622 16.0742 16.6912L16.9598 6H4.04017ZM7.99953 16.0667C7.7378 16.0667 7.5176 15.8631 7.501 15.5979L7.001 7.53123C6.9839 7.25537 7.19337 7.01807 7.46877 7.00097C7.7544 6.98093 7.98147 7.19287 7.99903 7.46873L8.49903 15.5354C8.51673 15.8211 8.2907 16.0667 7.99953 16.0667ZM11 15.5667C11 15.843 10.7764 16.0667 10.5 16.0667C10.2236 16.0667 10 15.843 10 15.5667V7.5C10 7.22363 10.2236 7 10.5 7C10.7764 7 11 7.22363 11 7.5V15.5667ZM13.999 7.53127L13.499 15.5979C13.4826 15.8604 13.2638 16.0791 12.9687 16.0657C12.6933 16.0486 12.4839 15.8113 12.501 15.5354L13.001 7.46877C13.0181 7.1929 13.2598 6.9922 13.5312 7.001C13.8066 7.0181 14.0161 7.2554 13.999 7.53127ZM17 3H14V2.5C14 1.67287 13.3271 1 12.5 1H8.5C7.67287 1 7 1.67287 7 2.5V3H4C3.4477 3 3 3.4477 3 4C3 4.55223 3.4477 5 4 5H17C17.5523 5 18 4.55223 18 4C18 3.4477 17.5523 3 17 3ZM13 3H8V2.5C8 2.22413 8.22413 2 8.5 2H12.5C12.7759 2 13 2.22413 13 2.5V3Z"
              fill="#CD2C2C"
            />
          </svg>
        </button>
      ),
    },
  ];
  return (
    <>
      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="sellerHeader primeHeader">
            <div className="row">
              <div className="col-8">
                <Button
                  newClass={`whiteFont mt-1`}
                  btnColor={`btnBlackPrime`}
                  btnIcon={`fa-solid fa-plus`}
                  btnName={`Add`}
                  onClick={() => {
                    dispatch({
                      type: OPEN_DIALOGUE,
                      payload: { type: "subCategory", extraData: state?.id },
                    });
                  }}
                  style={{ borderRadius: "10px" }}
                />
                {dialogue && dialogueType === "subCategory" && (
                  <SubCategoryDialoge />
                )}
              </div>
              <div className="col-4 ">
                <div
                  className="d-flex justify-content-end"
                  style={{ margin: "10px 32px 10px 0px" }}
                >
                  <Button
                    newClass={`themeFont boxCenter userBtn fs-5`}
                    btnIcon={`fa-solid fa-angles-left text-white fs-6`}
                    style={{
                      borderRadius: "5px",

                      width: "60px",
                      backgroundColor: "#b93160",
                      color: "#fff",
                    }}
                    onClick={() => navigate("/admin/category")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sellerMain">
            <div className="tableMain mt-2">
              <Table
                data={data}
                mapData={mapData}
                PerPage={rowsPerPage}
                Page={page}
                type={"client"}
              />
              <Pagination
                component="div"
                count={categoryWiseSubCategory?.length}
                serverPage={page}
                type={"client"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={categoryWiseSubCategory?.length}
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

export default connect(null, { getCategoryWiseSubCategory, deleteSubCategory })(
  CategoryWiseSubCategory
);
