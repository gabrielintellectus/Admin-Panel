import { useEffect, useRef, useState } from "react";

import {
  getDashboard,
  getTopSellingProduct,
  getTopSellingSeller,
  getTopUser,
  getPopularProduct,
  getRecenetOrder,
  getUser,
  getOrder,
  getUserChart,
  getRevenueChart,
} from "../../store/dashboard/dashboard.action";
import { connect, useDispatch, useSelector } from "react-redux";

// chart
import { Chart as ChartJS, registerables } from "chart.js";
import { Line } from "react-chartjs-2";

import Table from "../../extra/Table";
import { useNavigate } from "react-router-dom";
import { DateRangePicker } from "react-date-range";

import DateRangePicker1 from "react-bootstrap-daterangepicker";
import DateRangePicker2 from "react-bootstrap-daterangepicker";
import "bootstrap-daterangepicker/daterangepicker.css";
//Calendar Css
import "react-date-range/dist/styles.css"; // main style file
import "react-date-range/dist/theme/default.css";

import dayjs from "dayjs";

const Dashboard = (props) => {
  let label = [];
  let label1 = [];
  let dataUser = [];
  let data = [];
  let dataTotal = [];
  let dataWith = [];
  let dataWithOut = [];
  const {
    dashboard,
    product,
    seller,
    user,
    orderData,
    popularProduct,
    recentOrders,
    userCount,
    userChart,
    total,
    withCom,
    withOut,
  } = useSelector((state) => state.dashboard);

  const [type, setType] = useState("Product");
  const [order, setOrder] = useState([]);

  const [page, setPage] = useState(1);

  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [dateRangerShowType, setDateRangerShowType] = useState({
    toggle: false,
    type: "",
  });
  const dispatch = useDispatch();
  const [date, setDate] = useState([]);
  const [sDate, setsDate] = useState("All");
  const [eDate, seteDate] = useState("All");

  const [date2, setDate2] = useState([]);

  const [sDate3, setSDate3] = useState("All");
  const [eDate3, setEDate3] = useState("All");

  const [sDate2, setsDate2] = useState("All");
  const [eDate2, seteDate2] = useState("All");

  const startDateFormat = (startDate) => {
    return startDate && dayjs(startDate).isValid()
      ? dayjs(startDate).format("YYYY-MM-DD")
      : dayjs().subtract(7, "day").format("YYYY-MM-DD");
  };
  const endDateFormat = (endDate) => {
    return endDate && dayjs(endDate).isValid()
      ? dayjs(endDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
  };

  const startDateData = startDateFormat(sDate);
  const endDateData = endDateFormat(eDate);

  const [userChartData, setUserChartData] = useState();

  // chart

  const [startDate, setStartDate] = useState("All");
  const [endDate, setEndDate] = useState("All");

  const [sDate1, setSDate1] = useState("All");
  const [eDate1, setEDate1] = useState("All");

  const startDateFormat1 = (startDate) => {
    return startDate && dayjs(startDate).isValid()
      ? dayjs(startDate).format("YYYY-MM-DD")
      : dayjs().subtract(7, "day").format("YYYY-MM-DD");
  };
  const endDateFormat1 = (endDate) => {
    return endDate && dayjs(endDate).isValid()
      ? dayjs(endDate).format("YYYY-MM-DD")
      : dayjs().format("YYYY-MM-DD");
  };

  const startDateData1 = startDateFormat1(sDate1);
  const endDateData1 = endDateFormat1(eDate1);

  const [analyticTotal, setAnalyticTotal] = useState([]);
  const [analyticWith, setAnalyticWith] = useState([]);
  const [analyticWithOut, setAnalyticWithOut] = useState([]);
  const dateRangePickerRef = useRef();
  const dateRangePickerRef1 = useRef();

  useEffect(() => {
    setAnalyticTotal(total);
  }, [total]);

  useEffect(() => {
    setAnalyticWith(withCom);
  }, [withCom]);
  useEffect(() => {
    setAnalyticWithOut(withOut);
  }, [withOut]);

  var dateAnalytic = new Date();
  var firstDay = new Date(
    dateAnalytic?.getFullYear(),
    dateAnalytic?.getMonth() - 1,
    1
  );

  const maxDate = new Date();

  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getDashboard());
    dispatch(getTopSellingProduct());
    dispatch(getTopSellingSeller());
    dispatch(getTopUser());
    dispatch(getPopularProduct());
    dispatch(getRecenetOrder());
    dispatch(getOrder(startDate, endDate));
  }, [dispatch, startDate, endDate]);

  useEffect(() => {
    dispatch(getUserChart(startDateData, endDateData));
  }, [dispatch, startDateData, endDateData]);

  useEffect(() => {
    dispatch(getRevenueChart(startDateData1, endDateData1));
  }, [dispatch, startDateData1, endDateData1]);

  useEffect(() => {
    dispatch(getUser(sDate1, eDate1));
  }, [dispatch, sDate3, eDate3]);

  useEffect(() => {
    setOrder(recentOrders);
    // setUserData(userCount);
    // setOrderDate(orderData);
    setUserChartData(userChart);
  }, [recentOrders, userChart]);

  const collapsedDatePicker = (type) => {
    if (type === "dateRangeOne") {
      setDateRangerShowType({
        type: "dateRangeOne",
        toggle: !dateRangerShowType.toggle,
      });
    } else {
      setDateRangerShowType({
        type: "dateRangeTwo",
        toggle: !dateRangerShowType.toggle,
      });
    }
  };

  const handleCloseDateRange = () => {
    setDateRangerShowType({
      type: "",
      toggle: false,
    });
  };
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (
        dateRangePickerRef.current &&
        !dateRangePickerRef.current.contains(event.target) &&
        dateRangePickerRef1.current &&
        !dateRangePickerRef1.current.contains(event.target)
      ) {
        handleCloseDateRange();
      }
    };

    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  // Display the label name based on the startDatee
  useEffect(() => {
    if (date.length === 0) {
      setDate([
        {
          startDate: new Date(),
          endDate: new Date(),

          key: "selection",
        },
      ]);
    }
  }, [date]);

  useEffect(() => {
    if (date2.length === 0) {
      setDate2([
        {
          startDate: new Date(),
          endDate: new Date(),

          key: "selection",
        },
      ]);
    }
  }, [date2]);

  const handleOpen = (id) => {
    navigate("/admin/order/orderDetail", {
      state: id,
    });
  };

  // CHART

  if (userChartData?.length > 0) {
    userChartData.map((data_) => {
      const newDate = data_._id;

      var date;
      if (newDate._id) {
        data = dayjs(newDate?._id).format("DD MMM YYYY");
      } else {
        date = dayjs(newDate).format("DD MMM YYYY");
      }

      date?.length > 0 && label1.push(date);

      dataUser.push(data_.count);
    });
  }

  const chartData = {
    labels: label1,

    datasets: [
      {
        type: "line",
        label: "USER",
        data: dataUser,

        fill: false,
        backgroundColor: "rgb(212, 100, 138,0.3)",
        borderColor: "#B93160",
        lineTension: 0.5,
        pointBorderWidth: 2,
      },
    ],
  };

  const handleApply = (event, picker) => {
    picker.element.val(
      picker.startDate.format("YYYY-MM-DD") +
        " / " +
        picker.endDate.format("YYYY-MM-DD")
    );
    const dayStart = dayjs(picker.startDate).format("YYYY-MM-DD");

    const dayEnd = dayjs(picker.endDate).format("YYYY-MM-DD");

    setsDate(dayStart);
    seteDate(dayEnd);

    dispatch(getUserChart(dayStart, dayEnd));
  };

  //Cancel button function for analytic
  const handleCancel = (event, picker) => {
    picker.element.val("");
    setsDate("All");
    seteDate("All");
    dispatch(getUserChart("All", "All"));
  };

  // revenue chart

  if (
    analyticTotal?.length > 0 ||
    analyticWith?.length > 0 ||
    analyticWithOut?.length > 0
  ) {
    analyticTotal.map((data_) => {
      const newDate = data_._id;

      var date;
      if (newDate._id) {
        data = dayjs(newDate?._id).format("DD MMM YYYY");
      } else {
        date = dayjs(newDate).format("DD MMM YYYY");
      }

      date?.length > 0 && label.push(date);

      dataTotal.push(data_?.totalCommission);
    });
  }

  if (analyticWith?.length > 0 || analyticWithOut?.length > 0) {
    analyticWith.map((data_, index) => {
      const newDate = data_._id;

      var date;
      if (newDate._id) {
        date = newDate?._id.split("T");
      } else {
        date = newDate.split("T");
      }

      dataWith.push(data_?.totalEarningWithCommission);
    });
  }

  if (analyticWithOut?.length > 0) {
    analyticWithOut.map((data_, index) => {
      const newDate = data_._id;

      var date;
      if (newDate._id) {
        date = newDate?._id.split("T");
      } else {
        date = newDate.split("T");
      }

      dataWithOut.push(data_?.totalEarningWithoutCommission);
    });
  }

  const chartData1 = {
    labels: label,

    datasets: [
      {
        type: "line",
        label: "Total Earning",
        data: dataTotal,

        fill: true,
        backgroundColor: "rgb(212, 100, 138,0.3)",
        borderColor: "#B93160",
        lineTension: 0.5,
        pointBorderWidth: 2,
      },
      {
        type: "line",
        label: "Earning With Commission",
        data: dataWith,
        fill: true,
        backgroundColor: "rgb(223, 240, 250,0.3)",
        borderColor: "#236E9B",
        lineTension: 0.5,
        pointBorderWidth: 2,
      },
      {
        type: "line",
        label: "Earning WithOut Commission",
        data: dataWithOut,
        fill: true,
        backgroundColor: "rgb(218, 244, 240,0.3)",
        borderColor: "#008772",
        lineTension: 0.5,
        pointBorderWidth: 2,
      },
    ],
  };

  const handleApply1 = (event, picker) => {
    picker.element.val(
      picker.startDate.format("YYYY-MM-DD") +
        " / " +
        picker.endDate.format("YYYY-MM-DD")
    );
    const dayStart = dayjs(picker.startDate).format("YYYY-MM-DD");

    const dayEnd = dayjs(picker.endDate).format("YYYY-MM-DD");

    setSDate1(dayStart);
    setEDate1(dayEnd);

    dispatch(getRevenueChart(dayStart, dayEnd));
  };

  //Cancel button function for analytic
  const handleCancel1 = (event, picker) => {
    picker.element.val("");
    setSDate1(sDate1);
    setEDate1(eDate1);
    dispatch(getRevenueChart(sDate1, eDate1));
  };

  // Order Table Data
  const mapData = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span className="py-4">{index + 1}</span>,
    },

    {
      Header: "Order Id",
      body: "orderId",
      Cell: ({ row }) => (
        <span
          className="tableBoldFont orderIdText py-4"
          style={{
            cursor: "pointer",
            color: "#0B5ED7",
          }}
          onClick={() => handleOpen(row._id)}
        >
          <b className="fw-bold">{row?.orderId}</b>
        </span>
      ),
    },

    {
      Header: "User",
      body: "user",
      Cell: ({ row }) => (
        <div>
          <span className="tableBoldFont py-4">
            <b className="fw-bold">
              {row?.userId?.firstName
                ? row?.userId?.firstName + " "
                : "EraShop" + " "}
              {row?.userId?.lastName ? row?.userId?.lastName : "User"}
            </b>
          </span>
        </div>
      ),
    },
    {
      Header: "PaymentGateway",
      body: "paymentGateway",
      Cell: ({ row }) => <span className="py-4">{row?.paymentGateway}</span>,
    },
    {
      Header: "Total",
      body: "totalPrice",
      Cell: ({ row }) => (
        <>
          <span className="py-4">{row?.total}$</span>
        </>
      ),
    },

    // add more columns as needed
  ];

  const mapData1 = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },
    {
      Header: "User",
      body: "firstName",
      Cell: ({ row }) => (
        <div
          className="d-flex"
          onClick={() => navigate("/admin/userProfile", { state: row._id })}
          style={{ cursor: "pointer" }}
        >
          <div className="">
            <img
              src={row.image}
              style={{ borderRadius: "10px" }}
              height={60}
              width={60}
              alt=""
            />
          </div>
          <span
            className="fw-bold d-flex align-items-center text-start"
            style={{ paddingLeft: "10px" }}
          >
            <b className="fw-bold text-capitalize" style={{ color: "#000" }}>
              {row.firstName + " " + row.lastName}
            </b>
          </span>
        </div>
      ),
    },

    {
      Header: "Country",
      body: "location",
      Cell: ({ row }) => {
        return (
          <>
            <div className="">
              <span className="fw-bold text-uppercase">
                <p className="mb-0 text-uppercase">{row?.location}</p>
              </span>
            </div>
          </>
        );
      },
    },
    {
      Header: "Total Order",
      body: "orderCount",
      Cell: ({ row }) => (
        <span className="mb-0 fw-bold">
          {row.orderCount ? row.orderCount : 0}
        </span>
      ),
    },

    // add more columns as needed
  ];
  const mapData2 = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span>{index + 1}</span>,
    },
    {
      Header: "Seller",
      body: "firstName",
      Cell: ({ row }) => (
        <div
          className="d-flex"
          onClick={() => navigate("/admin/sellerProfile", { state: row._id })}
          style={{ cursor: "pointer" }}
        >
          <div className="position-relative">
            <img
              src={row?.image}
              style={{ borderRadius: "10px" }}
              height={60}
              width={60}
              alt=""
            />
          </div>
          <span
            className="d-flex align-items-center text-start"
            style={{ paddingLeft: "30px" }}
          >
            <b className="fw-bold">{row?.firstName + " " + row?.lastName}</b>
          </span>
        </div>
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
      Header: "Total Sold Product",
      body: "totalSales",
      Cell: ({ row }) => (
        <span className="mb-0">
          {row.totalProductsSold ? row.totalProductsSold : "0"}
        </span>
      ),
    },

    // add more columns as needed
  ];
  const mapData3 = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span>{parseInt(index) + 1}</span>,
    },
    {
      Header: "Product",
      body: "images",
      Cell: ({ row }) => (
        <div
          className="d-flex"
          onClick={() => navigate("/admin/productDetail", { state: row?._id })}
          style={{ cursor: "pointer" }}
        >
          <div className="">
            <img
              src={row?.mainImage}
              height={60}
              width={60}
              style={{ borderRadius: "10px" }}
              alt=""
            />
          </div>
          <span className="fw-bold boxCenter ms-3">
            <b className="fw-bold">{row?.productName}</b>
          </span>
        </div>
      ),
    },

    {
      Header: "Sold",
      Cell: ({ row }) => (
        <span className="tableBoldFont">
          <b className="fw-bold">{row?.sold}</b>
        </span>
      ),
    },
    {
      Header: "Rating",
      Cell: ({ row }) => (
        <span className="tableBoldFont">
          <i className="bi bi-star-fill"></i>
          <b className="fw-bold">{"(" + row?.rating + ")"}</b>
        </span>
      ),
    },
  ];

  const mapData4 = [
    {
      Header: "No",
      width: "60px",
      Cell: ({ index }) => <span>{parseInt(index) + 1}</span>,
    },
    {
      Header: "Product",
      body: "images",
      Cell: ({ row }) => (
        <div
          className="d-flex"
          onClick={() => navigate("/admin/productDetail", { state: row?._id })}
          style={{ cursor: "pointer" }}
        >
          <div className="">
            <img
              src={row?.mainImage}
              height={60}
              width={60}
              style={{ borderRadius: "10px" }}
              alt=""
            />
          </div>
          <span className="fw-bold boxCenter" style={{ paddingLeft: "30px" }}>
            <b className="fw-bold">{row?.productName}</b>
          </span>
        </div>
      ),
    },

    {
      Header: "Category",
      Cell: ({ row }) => (
        <span className="tableBoldFont">
          <p className="mb-0">{row?.categoryName}</p>
        </span>
      ),
    },

    {
      Header: "Rating",
      Cell: ({ row }) => (
        <span className="tableBoldFont">
          <i className="bi bi-star-fill"></i>
          <b className="fw-bold">{"(" + row?.rating + ")"}</b>
        </span>
      ),
    },
  ];

  return (
    <>
      <div className="mainDashboard">
        <div className="dashboard">
          <div className="row ">
            <div
              className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4"
              style={{ cursor: "pointer" }}
            >
              <div className="dashboardBox">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p
                          className="useTxt"
                          style={{
                            color: "#878AB3",
                            fontSize: "20px",
                            fontWeight: "600",
                            lineHeight: "normal",
                          }}
                        >
                          Total User
                        </p>
                        <h1
                          style={{
                            color: "#000",
                            fontSize: "30px",
                            fontWeight: "800",
                          }}
                          className=""
                        >
                          {userCount?.totalUsers}
                        </h1>
                      </div>
                      <div
                        className="right-icon"
                        style={{ background: "#DAF4F0" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="46"
                          height="46"
                          viewBox="0 0 46 46"
                          fill="none"
                        >
                          <path
                            d="M33.7237 20.953C34.4627 20.9667 35.197 20.833 35.8838 20.5597C36.5705 20.2864 37.1959 19.879 37.7233 19.3612C38.2508 18.8434 38.6698 18.2257 38.9558 17.5442C39.2418 16.8627 39.3891 16.1309 39.3891 15.3918C39.3891 14.6527 39.2418 13.921 38.9558 13.2394C38.6698 12.5579 38.2508 11.9402 37.7233 11.4224C37.1959 10.9047 36.5705 10.4972 35.8838 10.2239C35.197 9.95059 34.4627 9.81689 33.7237 9.83061M36.2806 26.9963C37.1986 27.0595 38.1091 27.1879 39.008 27.3911C40.2538 27.6345 41.7546 28.1463 42.2893 29.2656C42.6305 29.9824 42.6305 30.8181 42.2893 31.5349C41.7565 32.6543 40.2557 33.1641 39.008 33.4209M12.0558 20.953C11.3168 20.9667 10.5825 20.833 9.89577 20.5597C9.20904 20.2864 8.58366 19.879 8.0562 19.3612C7.52873 18.8434 7.10975 18.2257 6.82373 17.5442C6.53771 16.8627 6.3904 16.1309 6.3904 15.3918C6.3904 14.6527 6.53771 13.921 6.82373 13.2394C7.10975 12.5579 7.52873 11.9402 8.0562 11.4224C8.58366 10.9047 9.20904 10.4972 9.89577 10.2239C10.5825 9.95059 11.3168 9.81689 12.0558 9.83061M9.49898 26.9963C8.5809 27.0595 7.67048 27.1879 6.77156 27.3911C5.52573 27.6345 4.02307 28.1463 3.49215 29.2656C3.14715 29.9824 3.14715 30.8181 3.49215 31.5349C4.02307 32.6543 5.52381 33.1641 6.77156 33.4209"
                            stroke="#008772"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M22.8811 28.1942C29.1045 28.1942 34.4194 29.1334 34.4194 32.9034C34.4194 36.6697 29.139 37.6472 22.8811 37.6472C16.6557 37.6472 11.3408 36.7061 11.3408 32.9379C11.3408 29.1679 16.6251 28.1942 22.8811 28.1942ZM22.8811 22.8179C21.9086 22.8215 20.9451 22.6325 20.0459 22.262C19.1468 21.8914 18.33 21.3465 17.6424 20.6588C16.9549 19.9711 16.4102 19.1541 16.0399 18.2549C15.6696 17.3557 15.4809 16.3921 15.4847 15.4196C15.4816 14.4476 15.6709 13.4846 16.0416 12.5861C16.4122 11.6876 16.957 10.8712 17.6445 10.1841C18.3319 9.49701 19.1486 8.95267 20.0473 8.58246C20.946 8.21225 21.9091 8.02348 22.8811 8.02703C23.8531 8.02373 24.8161 8.21275 25.7147 8.58319C26.6133 8.95364 27.4298 9.49819 28.1171 10.1855C28.8044 10.8728 29.349 11.6893 29.7194 12.5879C30.0898 13.4865 30.2789 14.4495 30.2756 15.4215C30.2791 16.3937 30.0903 17.3569 29.72 18.2558C29.3496 19.1546 28.8051 19.9713 28.1178 20.6588C27.4305 21.3463 26.6139 21.891 25.7152 22.2616C24.8164 22.6322 23.8532 22.8212 22.8811 22.8179Z"
                            stroke="#008772"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>

                <div
                  className="mt-4 
                "
                  style={{ borderTop: "1px solid #DDDDDD" }}
                >
                  <div className="d-flex justify-content-between">
                    <div>
                      <a
                        href=""
                        className=""
                        onClick={() => navigate("/admin/user")}
                        style={{
                          color: "#4051A8",
                          textDecoration: "underline",
                        }}
                      >
                        <p className="mb-0 mt-3 viewtxt">View All Details</p>
                      </a>
                    </div>
                    <div
                      style={{ position: "relative" }}
                      ref={dateRangePickerRef}
                    >
                      <button
                        className="collapsed dateBtn btn bg-gradient-primary mt-2 p-0"
                        value="check"
                        style={{
                          width: "100px",
                          height: "38px",
                          overflow: "hidden",
                        }}
                        data-toggle="collapse"
                        onClick={() => collapsedDatePicker("dateRangeOne")}
                      >
                        <p
                          className="fw-bold m-0 p-2 dateTxt"
                          style={{
                            fontSize: "14px",
                            backgroundColor: "#f2f2f3",
                            borderRadius: "8px",
                          }}
                        >
                          {sDate3 === "All"
                            ? "Select Date"
                            : sDate3 + "- " + eDate3}
                        </p>
                      </button>
                      {dateRangerShowType.type === "dateRangeOne" &&
                        dateRangerShowType.toggle === true && (
                          <div
                            id="datePicker-1"
                            className="collapse-1 mt-3 pl-3"
                            aria-expanded="false"
                            style={{
                              zIndex: "11",
                              position: "absolute",
                              top: "40px",
                            }}
                          >
                            <div key={JSON.stringify(date)}>
                              <DateRangePicker
                                maxDate={maxDate}
                                closeOnClickOutside={handleCloseDateRange}
                                onChange={(item) => {
                                  console.log("ITEM", item.selection);
                                  setDate([item.selection]);
                                  const dayStart =
                                    dayjs(item.selection.startDate).format(
                                      "YYYY-MM-DD"
                                    ) || "All";
                                  const dayEnd =
                                    dayjs(item.selection.endDate).format(
                                      "YYYY-MM-DD"
                                    ) || "All";

                                  setSDate3(dayStart);
                                  setEDate3(dayEnd);
                                  props.getUser(dayStart, dayEnd);
                                }}
                                showSelectionPreview={true}
                                moveRangeOnFirstSelection={false}
                                ranges={date}
                                direction="horizontal"
                              />
                            </div>
                          </div>
                        )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4"
              style={{ cursor: "pointer" }}
            >
              <div className="dashboardBox">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p
                          className="useTxt"
                          style={{
                            color: "#878AB3",
                            fontSize: "20px",
                            fontWeight: "600",
                            lineHeight: "normal",
                          }}
                        >
                          Total Order
                        </p>
                        <h1
                          style={{
                            color: "#000",
                            fontSize: "30px",
                            fontWeight: "800",
                          }}
                        >
                          {orderData.totalOrders}
                        </h1>
                      </div>
                      <div
                        className="right-icon"
                        style={{ background: "#FEF4E4" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="46"
                          height="46"
                          viewBox="0 0 46 46"
                          fill="none"
                        >
                          <path
                            d="M36.207 11.1406H13.2358L12.8656 9.07853C12.5192 7.15012 10.8452 5.75 8.88591 5.75H7.09766C6.35303 5.75 5.75 6.35303 5.75 7.09766C5.75 7.84228 6.35303 8.44531 7.09766 8.44531H8.88591C9.53925 8.44531 10.097 8.91178 10.212 9.55506C10.2235 9.62119 10.7604 12.6076 13.3587 27.0854C11.8989 27.6956 10.8711 29.1381 10.8711 30.8164C10.8711 32.678 12.1368 34.2492 13.8525 34.7171C13.6692 35.1785 13.5664 35.6809 13.5664 36.207C13.5664 38.4366 15.3805 40.25 17.6094 40.25C19.8382 40.25 21.6523 38.4359 21.6523 36.207C21.6523 35.7348 21.5704 35.2813 21.4209 34.8594H29.9697C29.8202 35.2813 29.7383 35.7348 29.7383 36.207C29.7383 38.4359 31.5517 40.25 33.7812 40.25C36.0101 40.25 37.8242 38.4359 37.8242 36.207C37.8242 35.5839 37.6819 34.9931 37.4289 34.4648C37.6733 34.2211 37.8242 33.884 37.8242 33.5117C37.8242 32.7671 37.2212 32.1641 36.4766 32.1641H14.9141C14.1709 32.1641 13.5664 31.5596 13.5664 30.8164C13.5664 30.0747 14.1694 29.4702 14.9112 29.4688H14.9126C14.9141 29.4688 14.9162 29.4688 14.9177 29.4688H33.5117C35.3675 29.4688 36.9782 28.2145 37.4318 26.4169L40.1257 16.1819C40.1271 16.1762 40.1285 16.1712 40.13 16.1661C40.2098 15.8463 40.25 15.5157 40.25 15.1836C40.25 12.9548 38.4359 11.1406 36.207 11.1406ZM18.957 36.207C18.957 36.9502 18.3526 37.5547 17.6094 37.5547C16.8662 37.5547 16.2617 36.9502 16.2617 36.207C16.2617 35.4638 16.8662 34.8594 17.6094 34.8594C18.3526 34.8594 18.957 35.4638 18.957 36.207ZM33.7812 37.5547C33.0381 37.5547 32.4336 36.9502 32.4336 36.207C32.4336 35.4638 33.0381 34.8594 33.7812 34.8594C34.5244 34.8594 35.1289 35.4638 35.1289 36.207C35.1289 36.9502 34.5244 37.5547 33.7812 37.5547ZM37.5166 15.5056L34.8234 25.7384C34.822 25.7442 34.8206 25.7492 34.8198 25.7542C34.6696 26.3537 34.132 26.7734 33.5124 26.7734H16.0411L13.7195 13.8359H36.207C36.9502 13.8359 37.5547 14.4404 37.5547 15.1836C37.5547 15.2928 37.5417 15.4014 37.5166 15.5056Z"
                            fill="#764900"
                          />
                          <path
                            d="M28.3906 18.957H27.043V17.6094C27.043 16.8647 26.4399 16.2617 25.6953 16.2617C24.9507 16.2617 24.3477 16.8647 24.3477 17.6094V18.957H23C22.2554 18.957 21.6523 19.5601 21.6523 20.3047C21.6523 21.0493 22.2554 21.6523 23 21.6523H24.3477V23C24.3477 23.7446 24.9507 24.3477 25.6953 24.3477C26.4399 24.3477 27.043 23.7446 27.043 23V21.6523H28.3906C29.1353 21.6523 29.7383 21.0493 29.7383 20.3047C29.7383 19.5601 29.1353 18.957 28.3906 18.957Z"
                            fill="#764900"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-between mt-4
                "
                  style={{ borderTop: "1px solid #DDDDDD" }}
                >
                  <div>
                    <a
                      href=""
                      className=""
                      onClick={() => navigate("/admin/order")}
                      style={{ color: "#4051A8", textDecoration: "underline" }}
                    >
                      <p className="mb-0 mt-3 viewtxt">View All Details</p>
                    </a>
                  </div>
                  <div
                    style={{ position: "relative" }}
                    ref={dateRangePickerRef1}
                  >
                    <button
                      className="collapsed dateBtn btn bg-gradient-primary mt-2 p-0"
                      style={{
                        width: "100px",
                        height: "38px",
                        overflow: "hidden",
                      }}
                      value="check"
                      data-toggle="collapse-1"
                      // data-target="#datePicker"
                      onClick={() => collapsedDatePicker("dateRangeTwo")}
                    >
                      <p
                        className="fw-bold m-0 p-2 dateTxt"
                        style={{
                          fontSize: "14px",
                          backgroundColor: "#f2f2f3",
                          borderRadius: "8px",
                        }}
                      >
                        {sDate2 === "All"
                          ? "Select Date"
                          : sDate2 + " " + "To" + " " + eDate2}
                      </p>
                    </button>
                    {dateRangerShowType.type === "dateRangeTwo" &&
                      dateRangerShowType.toggle === true && (
                        <div
                          id="datePicker-1"
                          className="collapse-1 mt-3 pl-3"
                          aria-expanded="false"
                          style={{
                            zIndex: "11",
                            position: "absolute",
                            top: "40px",
                          }}
                        >
                          <div key={JSON.stringify(date)}>
                            <DateRangePicker
                              maxDate={maxDate}
                              closeOnClickOutside={handleCloseDateRange}
                              onChange={(item) => {
                                setDate2([item.selection]);
                                const dayStart = dayjs(
                                  item.selection.startDate
                                ).format("YYYY-MM-DD");
                                const dayEnd = dayjs(
                                  item.selection.endDate
                                ).format("YYYY-MM-DD");

                                setsDate2(dayStart);
                                seteDate2(dayEnd);
                                props.getOrder(dayStart, dayEnd);
                              }}
                              showSelectionPreview={true}
                              moveRangeOnFirstSelection={false}
                              ranges={date2}
                              direction="horizontal"
                            />
                          </div>
                        </div>
                      )}
                  </div>
                </div>
              </div>
            </div>
            <div
              className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4"
              style={{ cursor: "pointer" }}
            >
              <div className="dashboardBox">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p
                          className="useTxt"
                          style={{
                            color: "#878AB3",
                            fontSize: "20px",
                            fontWeight: "600",
                            lineHeight: "normal",
                          }}
                        >
                          Live Seller
                        </p>
                        <h1
                          style={{
                            color: "#000",
                            fontSize: "30px",
                            fontWeight: "800",
                          }}
                        >
                          {dashboard?.totalLiveSeller}
                        </h1>
                      </div>
                      <div
                        className="right-icon"
                        style={{ background: "#DFF0FA" }}
                      >
                        <svg
                          width="46"
                          height="46"
                          viewBox="0 0 46 46"
                          fill="none"
                          xmlns="http://www.w3.org/2000/svg"
                        >
                          <path
                            d="M12.5976 4.37167L12.5976 4.37172L12.6093 4.37189C12.6893 4.37299 12.7541 4.38843 12.8045 4.41015C12.8662 4.43676 12.9221 4.47528 12.9688 4.5235L12.9757 4.53057L12.9827 4.53755L15.7245 7.27934L18.1089 9.66381L18.1256 9.68049L18.1429 9.69655L21.4304 12.7537C22.3129 13.5744 23.6792 13.5747 24.5621 12.7545L27.8532 9.69698L27.8707 9.68071L27.8876 9.66381L30.2721 7.27934L33.0139 4.53755L33.0433 4.50813L33.0708 4.4769C33.1178 4.42343 33.1753 4.38016 33.2397 4.34977C33.3042 4.31939 33.3741 4.30254 33.4453 4.30027C33.5165 4.29799 33.5874 4.31033 33.6536 4.33653C33.7199 4.36273 33.78 4.40223 33.8304 4.4526C33.8807 4.50297 33.9202 4.56312 33.9464 4.62934C33.9726 4.69555 33.985 4.76644 33.9827 4.83765C33.9804 4.90884 33.9636 4.9788 33.9332 5.04322C33.9028 5.10764 33.8595 5.16515 33.8061 5.21218L33.7748 5.23966L33.7454 5.26907L31.0036 8.01086L28.6192 10.3953L29.4771 11.2533L28.6192 10.3953L27.2208 11.7937L25.0015 14.013H28.14H34.565C36.5887 14.013 38.4216 15.3842 39.6954 17.5416C40.9589 19.6815 41.7 22.5296 41.7 25.7347V30.5999C41.7 33.7977 40.9591 36.6463 39.695 38.7903C38.4175 40.9475 36.5884 42.3148 34.565 42.3148H11.4281C9.40478 42.3148 7.5787 40.9474 6.30462 38.7896C5.04072 36.6456 4.3 33.8006 4.3 30.5999V25.7347C4.3 22.5319 5.03821 19.6806 6.30119 17.5416C7.5759 15.3827 9.40224 14.013 11.4247 14.013H17.8566H20.995L18.7758 11.7937L17.3774 10.3953L14.9929 8.01086L12.2511 5.26907L12.2418 5.25973L12.2323 5.25059C12.1581 5.17933 12.1071 5.08733 12.0861 4.98663C12.0651 4.88592 12.0749 4.78121 12.1144 4.68621C12.1539 4.59121 12.2212 4.51036 12.3074 4.45423C12.3936 4.39811 12.4948 4.36933 12.5976 4.37167Z"
                            stroke="#003C60"
                            stroke-width="2.6"
                          />
                          <path
                            d="M25.9949 27.0083L21.8282 24.603C21.569 24.4502 21.2737 24.3697 20.9728 24.3697C20.672 24.3697 20.3767 24.4502 20.1175 24.603C19.5828 24.912 19.2642 25.4645 19.2642 26.0826V30.8947C19.2642 31.5114 19.5828 32.0666 20.1175 32.3743C20.377 32.5259 20.6722 32.6058 20.9728 32.6058C21.2734 32.6058 21.5686 32.5259 21.8282 32.3743L25.9949 29.9703C26.5295 29.6599 26.8495 29.106 26.8495 28.4893C26.8495 27.8712 26.5295 27.3174 25.9949 27.0083ZM28.6778 21.9624C28.4836 21.7762 28.2241 21.6738 27.9551 21.6772C27.6861 21.6806 27.4292 21.7896 27.2398 21.9806C27.0504 22.1716 26.9436 22.4294 26.9425 22.6984C26.9414 22.9674 27.046 23.2261 27.2338 23.4187C28.5903 24.763 29.337 26.5639 29.337 28.4893C29.337 30.4147 28.5903 32.2157 27.2338 33.5599C27.0575 33.7547 26.9627 34.0097 26.9687 34.2723C26.9747 34.535 27.0811 34.7853 27.2661 34.9719C27.4511 35.1585 27.7006 35.267 27.9632 35.2753C28.2257 35.2835 28.4815 35.1908 28.6778 35.0162C29.5411 34.1634 30.2256 33.1467 30.691 32.026C31.1563 30.9052 31.3934 29.7028 31.3882 28.4893C31.3934 27.2758 31.1563 26.0734 30.691 24.9526C30.2256 23.8319 29.5411 22.8153 28.6778 21.9624ZM17.0872 21.9692C16.9924 21.8735 16.8796 21.7973 16.7554 21.7452C16.6312 21.693 16.4979 21.6658 16.3632 21.6652C16.2284 21.6645 16.0949 21.6905 15.9702 21.7415C15.8454 21.7925 15.732 21.8675 15.6363 21.9624C14.7733 22.8154 14.0892 23.8321 13.624 24.9528C13.1589 26.0736 12.922 27.2759 12.9273 28.4893C12.9218 29.703 13.1586 30.9055 13.6238 32.0265C14.0889 33.1475 14.7731 34.1644 15.6363 35.0176C15.732 35.1125 15.8454 35.1875 15.9702 35.2385C16.0949 35.2895 16.2284 35.3154 16.3632 35.3148C16.4979 35.3142 16.6312 35.287 16.7554 35.2348C16.8796 35.1827 16.9924 35.1065 17.0872 35.0108C17.182 34.9151 17.2571 34.8016 17.3081 34.6769C17.3591 34.5522 17.385 34.4186 17.3844 34.2839C17.3838 34.1492 17.3566 34.0159 17.3044 33.8916C17.2522 33.7674 17.1761 33.6547 17.0803 33.5599C15.7238 32.2157 14.9785 30.4147 14.9785 28.4893C14.9785 26.5639 15.7238 24.763 17.0803 23.4201C17.1761 23.3253 17.2522 23.2126 17.3044 23.0883C17.3566 22.9641 17.3838 22.8308 17.3844 22.6961C17.385 22.5613 17.3591 22.4278 17.3081 22.3031C17.2571 22.1784 17.182 22.0649 17.0872 21.9692Z"
                            fill="#003C60"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-between mt-4
                "
                  style={{ borderTop: "1px solid #DDDDDD" }}
                >
                  <div>
                    <a
                      href=""
                      className=""
                      onClick={() => navigate("/admin/liveSeller")}
                      style={{ color: "#4051A8", textDecoration: "underline" }}
                    >
                      <p className="mb-0 mt-3 viewtxt">View All Details</p>
                    </a>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>

            <div
              className="col-xl-3 col-lg-4 col-md-6 col-12 mb-4"
              style={{ cursor: "pointer" }}
            >
              <div className="dashboardBox">
                <div className="row">
                  <div className="col-12">
                    <div className="d-flex justify-content-between">
                      <div>
                        <p
                          className="useTxt"
                          style={{
                            color: "#878AB3",
                            fontSize: "20px",
                            fontWeight: "600",
                            lineHeight: "normal",
                          }}
                        >
                          Total Product
                        </p>
                        <h1
                          style={{
                            color: "#000",
                            fontSize: "30px",
                            fontWeight: "800",
                          }}
                        >
                          {dashboard?.totalProducts}
                        </h1>
                      </div>
                      <div
                        className="right-icon"
                        style={{ background: "#E2E5ED" }}
                      >
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          width="46"
                          height="46"
                          viewBox="0 0 46 46"
                          fill="none"
                        >
                          <path
                            d="M31.9144 12.6469C31.9144 8.07363 28.207 4.36616 23.6337 4.36616C21.4315 4.3569 19.3162 5.22521 17.7557 6.77916C16.1952 8.3331 15.318 10.4447 15.318 12.6469M31.6513 41.2083H15.6513C9.7741 41.2083 5.26532 39.0855 6.54603 30.5417L8.03725 18.9627C8.82673 14.6996 11.546 13.068 13.932 13.068H33.4408C35.8618 13.068 38.4232 14.8224 39.3355 18.9627L40.8267 30.5417C41.9144 38.1206 37.5285 41.2083 31.6513 41.2083Z"
                            stroke="#00278E"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M29.3172 21.2789H29.231"
                            stroke="#00278E"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                          <path
                            d="M18.1433 21.2789H18.0552"
                            stroke="#00278E"
                            stroke-width="3"
                            stroke-linecap="round"
                            stroke-linejoin="round"
                          />
                        </svg>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="d-flex justify-content-between mt-4
                "
                  style={{ borderTop: "1px solid #DDDDDD" }}
                >
                  <div>
                    <a
                      href=""
                      className=""
                      onClick={() => navigate("/admin/product")}
                      style={{ color: "#4051A8", textDecoration: "underline" }}
                    >
                      <p className="mb-0 mt-3 viewtxt">View All Details</p>
                    </a>
                  </div>
                  <div></div>
                </div>
              </div>
            </div>
          </div>

          <div className="row">
            <div className="col-xl-6 col-12">
              <div
                className="card"
                style={{
                  borderRadius: "10px",
                  border: "none",
                  background: "#FFF",

                  minHeight: "670px",
                  maxHeight: "670px",
                }}
              >
                <div
                  className="heading"
                  style={{
                    borderRadius: "10px 10px 0px 0px",
                    borderBottom: "1px solid rgba(64, 81, 168, 0.20)",
                    background: " #FFF",
                    marginBottom: "0px",
                  }}
                >
                  <div className="sellerMenuHeader mt-2">
                    <ul
                      className="dashboardMenu d-flex"
                      style={{ overflowX: "scroll" }}
                    >
                      <li
                        className={`pb-0 ${
                          type === "Product" && "activeLineDash "
                        }`}
                      >
                        <a
                          className={`profileDash mb-0 ${
                            type === "Product" && "activeLineDashFont "
                          }`}
                          onClick={() => {
                            setType("Product");
                          }}
                        >
                          Top Selling Product
                        </a>
                      </li>

                      <li
                        className={`pb-0 ${
                          type === "Popular" && "activeLineDash "
                        }`}
                      >
                        <a
                          className={`profileDash mb-0 ${
                            type === "Popular" && "activeLineDashFont "
                          }`}
                          onClick={() => {
                            setType("Popular");
                          }}
                        >
                          Most Popular Product
                        </a>
                      </li>
                      <li
                        className={`pb-0 ${
                          type === "Seller" && "activeLineDash "
                        }`}
                      >
                        <a
                          className={`profileDash mb-0 ${
                            type === "Seller" && "activeLineDashFont "
                          }`}
                          onClick={() => {
                            setType("Seller");
                          }}
                        >
                          Top Seller
                        </a>
                      </li>

                      <li
                        className={`pb-0 ${
                          type === "Customer" && "activeLineDash "
                        }`}
                      >
                        <a
                          className={`profileDash mb-0 ${
                            type === "Customer" && "activeLineDashFont "
                          }`}
                          onClick={() => {
                            setType("Customer");
                          }}
                        >
                          Top Buyer
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="p-0 dashBoardTable ">
                    <div className="tableMain m-0">
                      {type === "Customer" && (
                        <>
                          <Table
                            data={user}
                            mapData={mapData1}
                            serverPerPage={rowsPerPage}
                            serverPage={page}
                            type={"server"}
                          />
                        </>
                      )}
                      {type === "Seller" && (
                        <>
                          <Table
                            data={seller}
                            mapData={mapData2}
                            serverPerPage={rowsPerPage}
                            serverPage={page}
                            type={"server"}
                          />
                        </>
                      )}
                      {type === "Product" && (
                        <>
                          <Table
                            data={product}
                            mapData={mapData3}
                            serverPerPage={rowsPerPage}
                            serverPage={page}
                            type={"server"}
                          />
                        </>
                      )}
                      {type === "Popular" && (
                        <>
                          <Table
                            data={popularProduct}
                            mapData={mapData4}
                            serverPerPage={rowsPerPage}
                            serverPage={page}
                            type={"server"}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-12 mt-xl-0 mt-md-3">
              <div
                className="card"
                style={{
                  borderRadius: "5px",
                  border: "none",
                  background: "#FFF",

                  minHeight: "670px",
                  maxHeight: "670px",
                }}
              >
                <div
                  className="heading"
                  style={{
                    borderRadius: "10px 10px 0px 0px",
                    borderBottom: "1px solid rgba(64, 81, 168, 0.20)",
                    background: " #FFF",
                    marginBottom: "0px",
                  }}
                >
                  <div className="sellerMenuHeader m-3" style={{}}>
                    <ul className="d-flex align-items-center">
                      <li className="d-flex align-items-center">
                        <a
                          className={` fw-bold mb-0 fs-5`}
                          style={{ color: "#b93160" }}
                        >
                          Recent Order
                        </a>
                      </li>
                    </ul>
                  </div>
                </div>
                <div className="card-body p-0">
                  <div className="p-0 dashBoardTable ">
                    <div className="tableMain m-0">
                      <Table
                        data={order}
                        mapData={mapData}
                        serverPerPage={rowsPerPage}
                        serverPage={page}
                        type={"server"}
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          <div className="row ">
            <div className="col-xl-6 col-12 mt-4">
              <div className="card">
                <div className="card-body py-0">
                  <div className="d-flex align-items-center justify-content-between my-2">
                    <div className="d-flex align-iems-center">
                      <i className="bi bi-circle-fill text-era"></i>
                      <h6 className="ms-2">User</h6>
                    </div>
                    <div>
                      <DateRangePicker1
                        initialSettings={{
                          applyButtonClasses: "btn-default",
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },

                          maxDate: new Date(),
                        }}
                        onApply={handleApply}
                        onCancel={handleCancel}
                      >
                        <input
                          type="text"
                          className="form-control text-center card my-1"
                          placeholder="Select Date"
                          readonly="readonly"
                          style={{
                            width: "14rem",
                            fontWeight: 500,
                            height: 40,
                            cursor: "pointer",
                            fontSize: "14px",
                          }}
                        />
                      </DateRangePicker1>
                    </div>
                  </div>
                  <div style={{ height: "518px" }}>
                    <Line
                      data={chartData}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>
            <div className="col-xl-6 col-12 mt-4">
              <div className="card">
                <div className="card-body py-0">
                  <div className="d-flex align-items-center justify-content-between my-2">
                    <div className="d-flex align-iems-center">
                      <i className="bi bi-circle-fill text-era"></i>
                      <h6 className="ms-2">Admin Revenue</h6>
                    </div>
                    <div>
                      <DateRangePicker2
                        initialSettings={{
                          applyButtonClasses: "btn-default",
                          autoUpdateInput: false,
                          locale: {
                            cancelLabel: "Clear",
                          },

                          maxDate: new Date(),
                        }}
                        onApply={handleApply1}
                        onCancel={handleCancel1}
                      >
                        <input
                          type="text"
                          className="form-control text-center card my-1"
                          placeholder="Select Date"
                          readonly="readonly"
                          style={{
                            width: "14rem",
                            fontWeight: 500,
                            fontSize: "14px",
                            height: 40,
                            cursor: "pointer",
                          }}
                        />
                      </DateRangePicker2>
                    </div>
                  </div>
                  <div style={{ height: "518px" }}>
                    <Line
                      data={chartData1}
                      options={{
                        responsive: true,
                        maintainAspectRatio: false,
                      }}
                    />
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
ChartJS.register(...registerables);

export default connect(null, {
  getDashboard,
  getTopSellingProduct,
  getTopSellingSeller,
  getTopUser,
  getUser,
  getOrder,
  getPopularProduct,
  getRecenetOrder,
  getUserChart,
  getRevenueChart,
})(Dashboard);
