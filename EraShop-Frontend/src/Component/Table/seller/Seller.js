import { Link, Navigate, useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import Title from "../../extra/Title";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { getSeller, sellerIsBlock } from "../../store/seller/seller.action";
import ToggleSwitch from "../../extra/ToggleSwitch";
import dayjs from "dayjs";
import Pagination from "../../extra/Pagination";
import Searching from "../../extra/Searching";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import SellerNotification from "./SellerNotification";

import Skeleton from "react-loading-skeleton";
import { colors } from "../../util/SkeletonColor";
import "react-loading-skeleton/dist/skeleton.css";

const Seller = (props) => {
  

  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { seller, totalSeller } = useSelector((state) => state.seller);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(getSeller(currentPage, size));
  }, [dispatch, currentPage, size]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(seller);
  }, [seller]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event), 10);
    setSize(parseInt(event), 10);
    setCurrentPage(1);
  };

  const handleClick = (sellerDetails) => {
    props.sellerIsBlock(
      sellerDetails,
      sellerDetails.isBlock === true ? false : true
    );
  };
  const handleOpen = (id) => {
    // window.location.href = "/admin/userProfile"
    navigate("/admin/sellerProfile", {
      state: id,
    });
  };

  const handleEdit = (id) => {
    navigate("/admin/addSeller", {
      state: id,
    });
  };

  // searching

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };

  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },
    {
      Header: "Seller",
      body: "firstName",
      Cell: ({ row }) => (
        <div className="d-flex">
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
                  src={row?.image}
                  style={{
                    borderRadius: "10px",
                    objectFit: "cover",
                    boxSizing: "border-box",
                  }}
                  height={60}
                  width={60}
                  alt=""
                />
              </>
            )}
          </div>
          <span className="boxCenter text-start ms-3">
            <b className="fw-bold text-dark">
              {row?.firstName + " " + row?.lastName}
            </b>
          </span>
        </div>
      ),
      sorting: true,
    },

    {
      Header: "Contact",
      body: "email",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 ">{row?.email ? row?.email : "xyz@gmail.com"}</p>
          <p className="mb-0">{row?.mobileNumber ? row?.mobileNumber : "-"}</p>
        </div>
      ),
      sorting: true,
    },
    {
      Header: "Business Name",
      body: "businessName",
      Cell: ({ row }) => (
        <span className="mb-0">
          {row?.businessName ? row?.businessName : "-"}
        </span>
      ),
    },
    {
      Header: "Business Tag",
      body: "businessTag",
      Cell: ({ row }) => (
        <span className="mb-0">{row.businessTag ? row.businessTag : "-"}</span>
      ),
    },

    {
      Header: "Total Product",
      body: "totalProduct",
      Cell: ({ row }) => (
        <span
          className="mb-0"
          style={{
            backgroundColor: "#c6e7ff",
            color: "#008df2",
            padding: "10px 15px",
            borderRadius: "5px",
          }}
        >
          {row.totalProduct ? row.totalProduct : 0}
        </span>
      ),
    },
    {
      Header: "Total Order",
      body: "totalOrder",
      Cell: ({ row }) => (
        <span
          className="mb-0"
          style={{
            backgroundColor: "#4dd39c75",
            color: "#075200",
            padding: "10px 15px",
            borderRadius: "5px",
          }}
        >
          {row?.totalOrder ? row?.totalOrder : 0}
        </span>
      ),
    },

    {
      Header: "Block",
      body: "isBlock",
      Cell: ({ row }) => (
        <div
          className={`boxCenter`}
        >
          <ToggleSwitch value={row?.isBlock} onClick={() => handleClick(row)} disabled={row?.email === "erashoptest@gmail.com" && true}  />
        </div>
      ),
    },
    {
      Header: "Created Date",
      body: "createdAt",
      Cell: ({ row }) => (
        <span>{dayjs(row.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    {
      Header: "Notification",
      body: "",
      Cell: ({ row }) => (
        <Button
          newClass={`themeFont boxCenter userBtn fs-5`}
          btnIcon={`fa-regular fa-bell`}
          style={{
            borderRadius: "5px",
            margin: "auto",
            width: "40px",
            backgroundColor: "#fff",
            color: "#3C3D51",
          }}
          onClick={() => {
            dispatch({
              type: OPEN_DIALOGUE,
              payload: { data: row, type: "SellerNotification" },
            });
          }}
        />
      ),
    },
    {
      Header: "Edit",
      body: "",
      Cell: ({ row }) => (
        <Button
          newClass={`themeFont boxCenter userBtn fs-5 `}
          btnIcon={`far fa-edit`}
          onClick={() => handleEdit(row)}
          disabled={row?.email === "erashoptest@gmail.com" && true}
          style={{
            borderRadius: "5px",
            margin: "auto",
            width: "40px",
            backgroundColor: "#fff",
            color: "#160d98",
            cursor: "pointer",
          }}
        />
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
          onClick={() => handleOpen(row?._id)}
          
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
      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="sellerHeader primeHeader">
            <div className="row">
              <div className="col-2">
                

                {dialogue && dialogueType === "SellerNotification" && (
                  <SellerNotification />
                )}
              </div>
              <div className="col-10 text-end">
                <Searching
                  type={`client`}
                  data={seller}
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
            <div className="tableMain mt-2">
              <Table
                data={data}
                mapData={mapData}
                serverPerPage={rowsPerPage}
                serverPage={page}
                type={"server"}
              />
              <Pagination
                component="div"
                count={seller?.length}
                type={"server"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={totalSeller}
                serverPage={currentPage}
                setCurrentPage={setCurrentPage}
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

export default connect(null, { getSeller, sellerIsBlock })(Seller);
// export default Seller;
