import { Link, Navigate, useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import Title from "../../extra/Title";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import {
  getFakeSeller,
  deleteFakeSeller,
  sellerIsLive,
} from "../../store/fake Seller/fakeSeller.action";
import ToggleSwitch from "../../extra/ToggleSwitch";
import dayjs from "dayjs";
import Pagination from "../../extra/Pagination";
import Searching from "../../extra/Searching";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
// import SellerNotification from "./SellerNotification";
import {  warning } from "../../util/Alert";
import FakeSellerDialogue from "./FakeSellerDialogue";
import "react-loading-skeleton/dist/skeleton.css";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../util/SkeletonColor";

const FakeSeller = (props) => {
  

  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const { fakeSeller, totalSellers } = useSelector((state) => state.fakeSeller);
 
  const navigate = useNavigate();
  const dispatch = useDispatch();



  useEffect(() => {
    dispatch(getFakeSeller(currentPage, size));
  }, [dispatch,currentPage, size]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(fakeSeller);
  }, [fakeSeller]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event), 10);
    setSize(parseInt(event), 10);
    setCurrentPage(1);
  };

  const handleClick = (seller) => {
    
    props.sellerIsLive(seller, seller?.isLive === true ? false : true);
  };

  // searching

  const handleFilterData = (filteredData) => {
    if (typeof filteredData === "string") {
      setSearch(filteredData);
    } else {
      setData(filteredData);
    }
  };


  // Edit Fake Seller

  const handleEdit = (id) => {
    navigate("/admin/addFakeSeller", {
      state: id,
    });
  };


  // Delete FakeSeller
  const handleDelete = (id) => {
    

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteFakeSeller(id);
        }
      })
      .catch((err) => console.log(err));
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
      Header: "Video",
      body: "video",
      Cell: ({ row }) => (
        <div className="position-relative">
          <video
            src={row?.video}
            controls
            style={{
              borderRadius: "10px",
              objectFit: "cover",
              boxSizing: "border-box",
            }}
            height={60}
            width={60}
            alt=""
          />
        </div>
      ),
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
      Header: "Created Date",
      body: "createdAt",
      Cell: ({ row }) => (
        <span>{dayjs(row.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    {
      Header: "isLive",
      body: "isLive",
      Cell: ({ row }) => (
        <div className="boxCenter">
          <ToggleSwitch value={row.isLive} onClick={() => handleClick(row)} />
        </div>
      ),
    },

    {
      Header: "Edit",
      body: "",
      Cell: ({ row }) => (
        <Button
          newClass={`themeFont boxCenter userBtn fs-5`}
          btnIcon={`far fa-edit`}
          onClick={() => handleEdit(row)}
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
          onClick={() => handleDelete(row?._id)}
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
    // add more columns as needed
  ];
  return (
    <>
      <div className="mainSellerTable">
        <div className="sellerTable">
          <div className="sellerHeader primeHeader">
            <div className="row">
              <div className="col-2">
                <Button
                  newClass={`whiteFont`}
                  btnColor={`btnthemePrime`}
                  btnIcon={`fa-solid fa-plus`}
                  btnName={`Add`}
                  onClick={() => {
                  
                    navigate("/admin/addFakeSeller");
                  }}
                  style={{ borderRadius: "10px" }}
                />
            
              </div>
              <div className="col-10 text-end">
                <Searching
                  type={`client`}
                  data={fakeSeller}
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
                count={fakeSeller?.length}
                type={"server"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={totalSellers}
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

export default connect(null, { getFakeSeller, deleteFakeSeller, sellerIsLive })(
  FakeSeller
);
// export default Seller;
