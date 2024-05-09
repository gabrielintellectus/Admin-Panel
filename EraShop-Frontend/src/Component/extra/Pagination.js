import React, { useEffect, useState } from "react";
//material-ui
import IconButton from "@material-ui/core/IconButton";
import FirstPageIcon from "@material-ui/icons/FirstPage";
import { makeStyles, useTheme } from "@material-ui/core";
import KeyboardArrowLeft from "@material-ui/icons/KeyboardArrowLeft";
import KeyboardArrowRight from "@material-ui/icons/KeyboardArrowRight";
import LastPageIcon from "@material-ui/icons/LastPage";

//useStyle
const useStyles = makeStyles((theme) => ({
  root: {
    flexShrink: 0,
    marginLeft: theme.spacing(2.5),
  },
  pageNumber: {
    display: "flex",
    alignItems: "center",
    marginLeft: theme.spacing(2),
  },
  pageNumberButton: {
    padding: "10px 15px",
    border: "none",
    margin: theme.spacing(0, 0.5),
    borderRadius: "10px",
    cursor: "pointer",
    color: "#000",
    backgroundColor: "#fff",
  },
  activePageNumberButton: {
    backgroundColor: theme.palette.primary.main,
    color: "#fff",
    "&:hover": {
      backgroundColor: theme.palette.primary.dark,
    },
  },
}));

const Pagination = (props) => {
  const [pages, setPages] = useState([]);
  const {
    type,
    // server props
    serverPage,
    serverPerPage,
    count,
    onPageChange,
    onRowsPerPageChange,
    // client props
    clientPage,
    totalPages,
    currentPage,
    setCurrentPage,
    totalData,
  } = props;

  // ============================================client pagination==============================================================

  const onPageChangeClient = (serverPage) => {
    setCurrentPage(serverPage);
  };

  // Update the pages array when totalPages or clientPage changes
  React.useEffect(() => {
    const range = Math.min(3, totalPages); // Show up to 5 pages
    const start = Math.max(1, clientPage - Math.floor(range / 2));
    const end = Math.min(start + range - 1, totalPages);

    const pageNumbers = Array.from(
      { length: end - start + 1 },
      (_, i) => start + i
    );
    setPages(pageNumbers);
  }, [clientPage, totalPages]);
  const endCount = Math.min((serverPage + 1) * serverPerPage, totalData);

  // ============================================server pagination==============================================================

  const classes = useStyles();
  const theme = useTheme();

  // count of pagination
  const totalCount = Math.min((serverPage + 1) * serverPerPage, totalData);
  const totalCounts = serverPerPage * serverPage;
  const rangeStart = totalCounts - serverPerPage + 1;
  const rangeEnd = Math.min(totalCounts, totalData);

  //firstPage button
  const handleFirstPageButtonClick = (event) => {
    onPageChange(event, 0);
  };
  // back button
  const handleBackButtonClick = (event) => {
    onPageChange(event, serverPage - 1);
  };

  //next page button
  const handleNextButtonClick = (event) => {
    onPageChange(event, serverPage + 1);
  };

  //last page button
  const handleLastPageButtonClick = (event) => {
    onPageChange(event, Math.max(0, Math.ceil(count / serverPerPage) - 1));
  };

  const renderPageNumbers = () => {
    const totalPages = Math.ceil(totalData / serverPerPage);
    const pageNumbers = [];
    for (let i = 0; i < totalPages; i++) {
      pageNumbers.push(
        <button
          key={i}
          className={`${classes.pageNumberButton} ${
            i === serverPage ? classes.activePageNumberButton : ""
          }`}
          onClick={(event) => onPageChange(event, i)}
        >
          {i + 1}
        </button>
      );
    }
    return pageNumbers;
  };

  return (
    <div className="pagination">
      <>
        {type === "server" && totalData > 0 && (
          <>
            <span className="text-dark fw-semibold fs-6">Row Per Page :-</span>
            <select
              name=""
              id=""
              className="mx-2 pageOption"
              onChange={(e) => onRowsPerPageChange(e.target.value)}
            >
              <option className="fs-6 fw-semibold " value="5">
                5
              </option>
              <option className="fs-6 fw-semibold " value="10" selected>
                10
              </option>
              <option className="fs-6 fw-semibold " value="25">
                25
              </option>
              <option className="fs-6 fw-semibold  " value="50">
                50
              </option>
              <option className="fs-6 fw-semibold " value="100">
                100
              </option>
              <option className="fs-6 fw-semibold  " value={totalData}>
                All
              </option>
            </select>
            <p className="count text-dark fw-semibold fs-6">
              {rangeStart}-{rangeEnd} of {totalData}
            </p>
            <button
              className={serverPage === 1 ? "page-btn" : "active"}
              disabled={serverPage === 1}
              onClick={() => onPageChangeClient(1)}
            >
              <FirstPageIcon />
            </button>
            <button
              className={serverPage === 1 ? "page-btn" : "active"}
              disabled={serverPage === 1}
              onClick={() => onPageChangeClient(serverPage - 1)}
            >
              <i className="fa-solid fa-angle-left"></i>
            </button>
            {pages.map((serverPage) => (
              <button
                key={serverPage}
                onClick={() => onPageChangeClient(serverPage - 1)}
                className={
                  serverPage + 1 === serverPage ? "active" : "active-btn"
                }
              >
                {serverPage}
              </button>
            ))}
            <button
              className={
                serverPage === Math.ceil(totalData / serverPerPage)
                  ? "page-btn"
                  : "active"
              }
              disabled={serverPage === Math.ceil(totalData / serverPerPage)}
              onClick={() => onPageChangeClient(serverPage + 1)}
            >
              <i className="fa-solid fa-angle-right"></i>
            </button>

            <button
              className={
                serverPage === Math.ceil(totalData / serverPerPage)
                  ? "page-btn"
                  : "active"
              }
              disabled={serverPage === Math.ceil(totalData / serverPerPage)}
              onClick={() =>
                onPageChangeClient(Math.ceil(totalData / serverPerPage))
              }
            >
              <LastPageIcon />
            </button>
          </>
        )}
      </>
      {/* client side pagination  */}

      {type === "client" && (
        <>
          <span className="mt-2">Row Per Page :-</span>
          <select
            name=""
            id=""
            className="mx-2 pageOption"
            onChange={(e) => onRowsPerPageChange(e.target.value)}
          >
            <option value="5">5</option>
            <option value="10" selected>
              10
            </option>
            <option value="15">15</option>
            <option value="20">20</option>
            <option value={totalData}>All</option>
          </select>
          <p className="count">
            {parseInt(serverPage * serverPerPage + 1) +
              "-" +
              totalCount +
              "of" +
              totalData}
          </p>
          <div className={classes.root} style={{ display: "flex" }}>
            <IconButton
              onClick={handleFirstPageButtonClick}
              disabled={serverPage === 0}
              aria-label="first page"
            >
              {theme.direction === "rtl" ? <LastPageIcon /> : <FirstPageIcon />}
            </IconButton>
            <IconButton
              onClick={handleBackButtonClick}
              disabled={serverPage === 0}
              aria-label="previous page"
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowRight />
              ) : (
                <KeyboardArrowLeft />
              )}
            </IconButton>

          
            <IconButton
              onClick={handleNextButtonClick}
              disabled={serverPage >= Math.ceil(count / serverPerPage) - 1}
              aria-label="next page"
            >
              {theme.direction === "rtl" ? (
                <KeyboardArrowLeft />
              ) : (
                <KeyboardArrowRight />
              )}
            </IconButton>
            <IconButton
              onClick={handleLastPageButtonClick}
              disabled={serverPage >= Math.ceil(count / serverPerPage) - 1}
              aria-label="last page"
            >
              {theme.direction === "rtl" ? <FirstPageIcon /> : <LastPageIcon />}
            </IconButton>
          </div>
        </>
      )}
    </div>
  );
};

export default Pagination;

