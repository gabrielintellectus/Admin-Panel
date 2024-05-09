import { Link, Navigate, useNavigate } from "react-router-dom";
import Table from "../../extra/Table";
import Button from "../../extra/Button";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect, useState } from "react";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import {
  getWithdraw,
  enabledDisabled,
} from "../../store/withdraw/withdraw.action";
import ToggleSwitch from "../../extra/ToggleSwitch";
import dayjs from "dayjs";
import WithdrawDialog from "./WithdrawDialog";
import Pagination from "../../extra/Pagination";
import {  warning } from "../../util/Alert";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../util/SkeletonColor";
import "react-loading-skeleton/dist/skeleton.css";

const Withdraw = (props) => {
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [loading, setLoading] = useState(true);

  const [rowsPerPage, setRowsPerPage] = useState(10);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { withdraw } = useSelector((state) => state.withdraw);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  

  useEffect(() => {
    dispatch(getWithdraw());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(withdraw);
  }, [withdraw]);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event, 10));
    setPage(0);
  };

  const handleClick = (withdrawDetail) => {
    props.enabledDisabled(
      withdrawDetail,
      withdrawDetail?.isEnabled === true ? false : true
    );
  };

  // Delete Withdraw


  const mapData = [
    {
      Header: "No",
      width: "20px",
      Cell: ({ index }) => <span>{parseInt(index) + 1}</span>,
    },

    {
      Header: "Image",
      body: "withdraw",
      Cell: ({ row }) => (
        <>
          {loading ? (
            <>
              <Skeleton
                height={100}
                width={100}
                className="StripeElement "
                baseColor={colors?.baseColor}
                highlightColor={colors?.highlightColor}
              />
            </>
          ) : (
            <>
              <img src={row.image} width={100} height={100} alt="" srcset="" />
            </>
          )}
        </>
      ),
    },
    {
      Header: "Name",
      body: "name",
    },

    {
      Header: "Details",
      body: "details",
      Cell: ({ row }) => {
        return (
          <>
            {row.details.map((condition, i) => (
              <>
                <div key={i} className="d-flex justify-content-start">
                  <i
                    style={{ color: "#B93160", fontSize: "15px" }}
                    className="bi bi-circle-fill mb-1 text-era"
                  ></i>
                  <span className="ms-2">{condition}</span>
                </div>
              </>
            ))}
          </>
        );
      },
    },

    {
      Header: "CreatedDate",
      body: "createdAt",
      Cell: ({ row }) => (
        <span>{dayjs(row.createdAt).format("DD MMM YYYY")}</span>
      ),
    },
    {
      Header: "Edit",
      body: "",
      Cell: ({ row }) => (
        <>
          <Button
            newClass={`themeFont boxCenter userBtn fs-5`}
            
            btnIcon={`far fa-edit`}
            style={{
              borderRadius: "5px",
              margin: "auto",
              width: "40px",
              backgroundColor: "#fff",
              color: "#160d98",
            }}
            onClick={() =>
              dispatch({
                type: OPEN_DIALOGUE,
                payload: { data: row, type: "withdraw" },
              })
            }
          />
          {dialogue && dialogueType === "withdraw" && <WithdrawDialog />}
        </>
      ),
    },
    {
      Header: "Disabled",
      body: "",
      Cell: ({ row }) => (
        <>
         
          <div className="boxCenter">
            <ToggleSwitch
              value={row.isEnabled}
              onClick={() => handleClick(row)}
            />
          </div>
        </>
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
              <div className="col-10">
                <Button
                  newClass={`whiteFont`}
                  btnColor={`btnBlackPrime`}
                  btnIcon={`fa-solid fa-plus`}
                  btnName={`Add`}
                  onClick={() => {
                    dispatch({
                      type: OPEN_DIALOGUE,
                      payload: { type: "withdraw" },
                    });
                  }}
                  style={{ borderRadius: "10px" }}
                />
                {dialogue && dialogueType === "withdraw" && <WithdrawDialog />}
              </div>
              <div className="col-2 text-end">
               
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
                count={withdraw?.length}
                serverPage={page}
                type={"client"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={withdraw?.length}
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

export default connect(null, { getWithdraw, enabledDisabled })(Withdraw);
