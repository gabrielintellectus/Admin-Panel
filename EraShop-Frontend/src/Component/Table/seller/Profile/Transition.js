import React from "react";
import { useEffect } from "react";
import { useState } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import Table from "../../../extra/Table";
import Pagination from "../../../extra/Pagination";
import { getSellerTransition } from "../../../store/seller/seller.action";
import Analytics from "../../../extra/Analytics";

const Transition = (props) => {
  const { sellerTransition } = useSelector((state) => state.seller);
  const { state } = useLocation();
  const dispatch = useDispatch();
  const [page, setPage] = useState(0);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [startDate, setStartDate] = useState("ALL");
  const [endDate, setEndDate] = useState("ALL");

  const [rowsPerPage, setRowsPerPage] = useState(10);

  useEffect(() => {
    dispatch(getSellerTransition(state, startDate, endDate));
  }, [dispatch, state, startDate, endDate]);

  useEffect(() => {
    setData(sellerTransition);
  }, [sellerTransition]);

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
      Header: "Seller Name",
      body: "sellerName",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 fw-bold text-muted">
            {row.sellerFirstName + "  " + row.sellerLastName}
          </p>
        </div>
      ),
    },
    {
      Header: "Customer Name",
      body: "productCode",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0 fw-bold text-muted">
            {row.userFirstName + "  " + row.userLastName}
          </p>
        </div>
      ),
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
      Header: "Created At",
      body: "date",
      Cell: ({ row }) => {
        const date = row.date.split(",");
        return (
          <>
            <div className="">
              <p className="mb-0 fw-bold text-muted">{date[0]}</p>
              <p className="mb-0 fw-bold text-muted">{date[1]}</p>
            </div>
          </>
        );
      },
    },

    {
      Header: "Order Amount",
      body: "shippingCharges",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0">
            {row.sellerPendingAmount + row.adminCommission} $
          </p>
        </div>
      ),
    },
    {
      Header: "Seller Amount",
      body: "price",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0">{row?.sellerPendingAmount} $</p>
        </div>
      ),
    },
    {
      Header: "Admin Commission",
      body: "adminCommission  ",
      Cell: ({ row }) => (
        <div className="">
          <p className="mb-0">{row.adminCommission} $</p>
        </div>
      ),
    },

   

    // add more columns as needed
  ];
  console.log("sellerTransition", sellerTransition);
  return (
    <div>
      <div className="card mt-4">
        <div className="card-body">
          <div className="userMain">
            <div className="row">
              <div className="col-6">
                <Analytics
                  analyticsStartDate={startDate}
                  analyticsStartEnd={endDate}
                  setAnalyticsStartDate={setStartDate}
                  setAnalyticsEndDate={setEndDate}
                  title={"Transaction"}
                />
              </div>
              <div className="col-6"></div>
            </div>
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
                count={sellerTransition?.length}
                serverPage={page}
                type={"client"}
                onPageChange={handleChangePage}
                serverPerPage={rowsPerPage}
                totalData={sellerTransition?.length}
                onRowsPerPageChange={handleChangeRowsPerPage}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default connect(null, { getSellerTransition })(Transition);
