import React, { useEffect, useState } from "react";
import { connect, useSelector } from "react-redux";
import { useLocation, useNavigate } from "react-router-dom";
import { reelInfo, reelLike } from "../../store/reels/reels.action";
import dayjs from "dayjs";
import Tick from "../../../assets/images/verified.png";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import { colors } from "../../util/SkeletonColor";

const ReelsInfo = (props) => {
  const { state } = useLocation();
  const navigate = useNavigate();

  const { reelInfo, reelLike } = useSelector((state) => state.reels);

  const [type, setType] = useState("Like");
  const [reelData, setReelData] = useState([]);

  let now = dayjs();

  useEffect(() => {
    props.reelInfo(state);
    props.reelLike(state);
  }, [state]);

  useEffect(() => {
    setReelData(reelLike);
  }, [reelLike]);

  const handleProductInfo = (id) => {
    navigate("/admin/productDetail", {
      state: id,
    });
  };
  const handleUserInfo = (id) => {
    navigate("/admin/UserProfile", {
      state: id,
    });
  };
  const handleSellerInfo = (id) => {
    navigate("/admin/sellerProfile", {
      state: id,
    });
  };

  return (
    <>
      <div className="mainUserTable positon-relative">
        <div className="userTable">
          <div className="userMain">
            <div style={{ margin: "30px 18px" }}>
              <div className="card">
                <div className="card-body">
                  <div className="row">
                    <div className="col-xl-4 col-md-6">
                      <div className="post-body">
                        <div className="d-flex">
                          <div
                            style={{ cursor: "pointer" }}
                            onClick={() =>
                              handleSellerInfo(reelInfo?.productId?.seller)
                            }
                          >
                            {reelInfo ? (
                              <>
                                <img
                                  className=""
                                  src={reelInfo?.sellerId?.image}
                                  height={50}
                                  width={50}
                                  style={{
                                    border: "1px solid #b93160",
                                    borderRadius: "50%",
                                  }}
                                  alt=""
                                />
                              </>
                            ) : (
                              <>
                                <Skeleton
                                  height={50}
                                  width={50}
                                  style={{
                                    border: "1px solid #b93160",
                                    borderRadius: "50%",
                                  }}
                                  alt=""
                                  highlightColor={colors?.highlightColor}
                                  baseColor={colors?.baseColor}
                                />
                              </>
                            )}
                          </div>
                          <div className="ms-3">
                            <h4 className="mb-1" style={{ fontSize: "15px" }}>
                              {reelInfo?.sellerId?.businessName}{" "}
                              <img
                                className=""
                                src={Tick}
                                height={18}
                                width={18}
                                alt=""
                              />
                            </h4>
                            <span className="" style={{ fontSize: "13px" }}>
                              {" "}
                              {now.diff(reelInfo?.createdAt, "minute") <= 60 &&
                              now.diff(reelInfo?.createdAt, "minute") >= 0
                                ? now.diff(reelInfo?.createdAt, "minute") +
                                  " minutes ago"
                                : now.diff(reelInfo?.createdAt, "hour") >= 24
                                ? dayjs(reelInfo?.createdAt).format(
                                    "DD MMM, YYYY"
                                  )
                                : now.diff(reelInfo?.createdAt, "hour") +
                                  " hour ago"}
                            </span>
                          </div>
                        </div>
                      </div>
                      <div className="post-body">
                        <video
                          className="post-image"
                          src={reelInfo?.video}
                          autoPlay
                          controls
                        />
                      </div>
                    </div>
                    <div
                      className="col-xl-8 col-md-6"
                      style={{ borderLeft: "0.5px solid #f2f2f2" }}
                    >
                      <div className="mt-4 mt-xl-0">
                        <div className="row">
                          <div className="col-md-6 col-12">
                            <h3
                              className={`mb-3 fw-bold mb-0 fs-5`}
                              style={{ color: "#b93160" }}
                            >
                              Product Detail
                            </h3>
                            <div className="d-flex">
                              <div className="product-image boxCenter ">
                                {reelInfo ? (
                                  <>
                                    <img
                                      src={reelInfo?.productId?.mainImage}
                                      height={150}
                                      width={150}
                                      style={{
                                        borderRadius: "22px",
                                        cursor: "pointer",
                                      }}
                                      alt=""
                                      onClick={() =>
                                        handleProductInfo(
                                          reelInfo?.productId?._id
                                        )
                                      }
                                    />
                                  </>
                                ) : (
                                  <>
                                    <Skeleton
                                      height={150}
                                      width={150}
                                      style={{
                                        borderRadius: "22px",
                                        cursor: "pointer",
                                      }}
                                      alt=""
                                      highlightColor={colors?.highlightColor}
                                      baseColor={colors?.baseColor}
                                    />
                                  </>
                                )}
                              </div>
                              <div className="product-content boxCenter ms-4 mt-2">
                                <ul>
                                  <li
                                    className=""
                                    style={{ paddingBottom: "10px" }}
                                  >
                                    <span className="mb-0">Name</span>
                                    <span className="mx-2">:</span>
                                    <span className=" text-h6 font-weight-regular">
                                      {reelInfo?.productId?.productName}
                                    </span>
                                  </li>
                                  <li
                                    className=""
                                    style={{ paddingBottom: "10px" }}
                                  >
                                    <span className="mb-0">Price</span>
                                    <span className="mx-2">:</span>
                                    <span className=" text-h6 font-weight-regular">
                                      {reelInfo?.productId?.price
                                        ? reelInfo?.productId?.price
                                        : "-"}
                                    </span>
                                  </li>
                                  <li
                                    className=""
                                    style={{ paddingBottom: "10px" }}
                                  >
                                    <span className="mb-0 ">
                                      ShippingCharge
                                    </span>
                                    <span className="mx-2">:</span>
                                    <span className="text-h6 font-weight-regular">
                                      {reelInfo?.productId?.shippingCharges}
                                    </span>
                                  </li>
                                  <li
                                    className=""
                                    style={{ paddingBottom: "10px" }}
                                  >
                                    <span className="mb-0 ">Product Code</span>
                                    <span className="mx-2">:</span>
                                    <span className="text-h6 font-weight-regular">
                                      {reelInfo?.productId?.productCode}
                                    </span>
                                  </li>
                                </ul>
                              </div>
                            </div>
                          </div>
                          <div className="col-md-6 col-12">
                            <h3
                              className={`mb-3 fw-bold mb-0 fs-5`}
                              style={{ color: "#b93160" }}
                            >
                              Thumbnail
                            </h3>
                            <div className="product-image">
                              {reelInfo ? (
                                <>
                                  <img
                                    src={reelInfo?.thumbnail}
                                    height={150}
                                    width={150}
                                    style={{
                                      borderRadius: "22px",
                                      cursor: "pointer",
                                    }}
                                    alt=""
                                  />
                                </>
                              ) : (
                                <>
                                  <Skeleton
                                    height={150}
                                    width={150}
                                    style={{
                                      borderRadius: "22px",
                                      cursor: "pointer",
                                    }}
                                    alt=""
                                    highlightColor={colors?.highlightColor}
                                    baseColor={colors?.baseColor}
                                  />
                                </>
                              )}
                            </div>
                          </div>
                        </div>

                        <div className=" sellerMenuHeader mt-4">
                          <div
                            className="row dashboardMenu d-flex"
                            style={{ borderBottom: "1px solid #F2F2F2" }}
                          >
                            <div
                              className={`col-6 pb-0 ${
                                type === "Like" && "activeLineDash "
                              }`}
                              style={{ cursor: "pointer" }}
                            >
                              <a
                                className={`profileDash boxCenter mb-2 ${
                                  type === "Like" && "activeLineDashFont "
                                }`}
                                style={{ fontSize: "18px" }}
                                onClick={() => {
                                  setType("Like");
                                }}
                              >
                                Like{" "}
                                <span className="ms-2">
                                  {reelInfo?.like
                                    ? "(" + reelInfo?.like + ")"
                                    : "(0)"}
                                </span>
                              </a>
                            </div>
                            <div
                              className={`col-6 pb-0 ${
                                type === "Comment" && "activeLineDash "
                              }`}
                              style={{ cursor: "pointer" }}
                            >
                              <a
                                className={`profileDash boxCenter mb-2 ${
                                  type === "Comment" && "activeLineDashFont "
                                }`}
                                style={{ fontSize: "18px" }}
                                onClick={() => {
                                  setType("Comment");
                                }}
                              >
                                Comment{" "}
                                <span className="ms-2">
                                  {reelInfo?.comment
                                    ? "(" + reelInfo?.comment + ")"
                                    : "(0)"}
                                </span>
                              </a>
                            </div>
                          </div>
                        </div>
                        {type === "Like" && (
                          <div className="likeContent">
                            {reelData?.length > 0 ? (
                              reelData?.map((data) => {
                                return (
                                  <>
                                    <div
                                      className="d-flex align-items-center justify-content-between p-3"
                                      style={{
                                        borderBottom: "0.5px solid #f2f2f2",
                                      }}
                                    >
                                      <div className="d-flex ">
                                        <div
                                          style={{ cursor: "pointer" }}
                                          onClick={() =>
                                            handleUserInfo(data?.userId?._id)
                                          }
                                        >
                                          {data ? (
                                            <>
                                              <img
                                                className=""
                                                src={data?.userId?.image}
                                                height={50}
                                                width={50}
                                                style={{
                                                  border: "1px solid #b93160",
                                                  borderRadius: "50%",
                                                }}
                                                alt=""
                                              />
                                            </>
                                          ) : (
                                            <>
                                              <Skeleton
                                                className=""
                                                height={50}
                                                width={50}
                                                style={{
                                                  border: "1px solid #b93160",
                                                  borderRadius: "50%",
                                                }}
                                                alt=""
                                                highlightColor={colors?.highlightColor}
                                                baseColor={colors?.baseColor}
                                              />
                                            </>
                                          )}
                                        </div>
                                        <div className="ms-3">
                                          <h4
                                            className="fw-bold mb-1"
                                            style={{ fontSize: "17px" }}
                                          >
                                            {data?.userId?.firstName +
                                              data?.userId?.lastName}
                                          </h4>
                                          <span
                                            className=""
                                            style={{ fontSize: "13px" }}
                                          >
                                            {" "}
                                            {now.diff(
                                              data?.createdAt,
                                              "minute"
                                            ) <= 60 &&
                                            now.diff(
                                              data?.createdAt,
                                              "minute"
                                            ) >= 0
                                              ? now.diff(
                                                  data?.createdAt,
                                                  "minute"
                                                ) + " minutes ago"
                                              : now.diff(
                                                  data?.createdAt,
                                                  "hour"
                                                ) >= 24
                                              ? dayjs(data?.createdAt).format(
                                                  "DD MMM, YYYY"
                                                )
                                              : now.diff(
                                                  data?.createdAt,
                                                  "hour"
                                                ) + " hour ago"}
                                          </span>
                                        </div>
                                      </div>
                                      <div
                                        className="p-1 boxCenter"
                                        style={{
                                          border: "1px solid #f2f2f2",
                                          borderRadius: "50%",
                                        }}
                                      >
                                        <svg
                                          width="34"
                                          height="34"
                                          viewBox="0 0 34 34"
                                          fill="#b93160"
                                          xmlns="http://www.w3.org/2000/svg"
                                        >
                                          <g clip-path="url(#clip0_33622_2928)">
                                            <path
                                              d="M34 0H0V34H34V0Z"
                                              fill="#b93160"
                                              fill-opacity="0.01"
                                            />
                                            <path
                                              d="M10.6247 5.66663C6.32146 5.66663 2.83301 9.1551 2.83301 13.4583C2.83301 21.25 12.0413 28.3333 16.9997 29.981C21.958 28.3333 31.1663 21.25 31.1663 13.4583C31.1663 9.1551 27.6779 5.66663 23.3747 5.66663C20.7395 5.66663 18.4098 6.97485 16.9997 8.97723C15.5896 6.97485 13.2599 5.66663 10.6247 5.66663Z"
                                              fill="#b93160"
                                              stroke="#b93160"
                                              stroke-width="2.2"
                                              stroke-linecap="round"
                                              stroke-linejoin="round"
                                            />
                                          </g>
                                          <defs>
                                            <clipPath id="clip0_33622_2928">
                                              <rect
                                                width="34"
                                                height="34"
                                                fill="#b93160"
                                              />
                                            </clipPath>
                                          </defs>
                                        </svg>
                                      </div>
                                    </div>
                                  </>
                                );
                              })
                            ) : (
                              <p className="text-center p-3">No data found</p>
                            )}
                          </div>
                        )}
                        {type === "Comment" && (
                          <div className="likeContent">
                            <p className="text-center p-5 mb-0">
                              No data found
                            </p>
                          </div>
                        )}
                      </div>
                    </div>
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

export default connect(null, { reelInfo, reelLike })(ReelsInfo);
