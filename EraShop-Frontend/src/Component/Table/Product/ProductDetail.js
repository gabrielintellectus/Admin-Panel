import React, { useState, useEffect } from "react";
import Title from "../../extra/Title";
import { Rating } from "react-simple-star-rating";
import ToggleSwitch from "../../extra/ToggleSwitch";
import { connect, useDispatch, useSelector } from "react-redux";
import {
  getProductDetail,
  outOfStock,
  getProductReview,
} from "../../store/product/product.action";
import { useLocation, useNavigate } from "react-router-dom";
import ReactImageMagnify from "react-image-magnify";
import { Skeleton } from "@mui/material";
import Button from "../../extra/Button";
import { Navigation, Scrollbar, A11y } from "swiper/modules";
import Pagination from "../../extra/Pagination";

import { Swiper, SwiperSlide } from "swiper/react";

// Import Swiper styles
import "swiper/css";
import "swiper/css/navigation";
import "swiper/css/pagination";
import "swiper/css/scrollbar";

const ProductDetail = (props) => {
  const { productDetail, review } = useSelector((state) => state.product);
  const dispatch = useDispatch();

  const { state } = useLocation();

  console.log(
    "productDetailproductDetailproductDetailproductDetailproductDetail",
    productDetail
  );

  const [animation, setAnimation] = useState(false);
  const [size, setSize] = useState(10);
  const [page, setPage] = useState(1);
  const [data, setData] = useState([]);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [rowsPerPage, setRowsPerPage] = useState(10);

  const [currentImage, setCureentImage] = useState([]);
  console.log("currentImage", currentImage);
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(getProductDetail(state));
  }, [state, dispatch]);

  useEffect(() => {
    dispatch(getProductReview(state, currentPage, size));
  }, [state, currentPage, size, dispatch]);

  useEffect(() => {
    setTimeout(() => {
      setAnimation(true);
    }, 2000);
  }, []);

  // // pagination
  const handleChangePage = (event, newPage) => {
    setCurrentPage(newPage);
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(parseInt(event), 10);
    setSize(parseInt(event), 10);
    setCurrentPage(1);
  };

  const CustomPagination = ({ swiper }) => {
    return (
      <div
        className="custom-pagination d-flex align-items-center mt-3"
        style={{ overflowX: "scroll" }}
      >
        {productDetail[0]?.images.map((img, index) => (
          <span
            key={index}
            className={`custom-pagination-bullet ${
              index === swiper?.activeIndex
                ? "custom-pagination-bullet-active"
                : ""
            }`}
            onClick={() => swiper.slideTo(index)}
          >
            <img
              src={img}
              style={{ width: "95px", height: "95px" }}
              className="me-2"
              alt={`Slide ${index}`}
            />
          </span>
        ))}
      </div>
    );
  };

  const swiperRef = React.useRef(null);

  return (
    <>
      <div className="mainProductDetail mt-2">
        <div className="ProductDetail">
          <div className="productDetailMain">
            <div className="card" style={{ margin: "0px 18px" }}>
              <div className="card-body">
                <div className="row">
                  <div className="col-xl-4 col-md-4 col-12">
                    <div className=" ">
                      <Swiper
                        modules={[Navigation]}
                        spaceBetween={0}
                        slidesPerView={1}
                        navigation
                        onSwiper={(swiper) => (swiperRef.current = swiper)}
                        onSlideChange={() => console.log("slide change")}
                      >
                        {productDetail[0]?.images.map((img, index) => (
                          <SwiperSlide key={index}>
                            <img
                              src={img}
                              style={{
                                width: "100%",
                                height: "550px",
                                objectFit: "cover",
                                boxSizing: "border-box",
                                borderRadius: "0.25rem",
                              }}
                              alt={`Slide ${index}`}
                            />
                          </SwiperSlide>
                        ))}
                      </Swiper>
                      <CustomPagination swiper={swiperRef.current} />

                      <div className="subImage d-flex m-2 boxCenter"></div>
                    </div>
                  </div>
                  <div className="col-xl-8 col-md-8 col-12">
                    <div className="details">
                      <h4 className="">{productDetail[0]?.productName}</h4>
                      <div className="hstack gap-3 flex-wrap">
                        <div>
                          <p className="text-era d-block mb-0">
                            {productDetail[0]?.category?.name}
                          </p>
                        </div>
                        <div className="vr" />
                        <div className="text-muted">
                          Seller :{" "}
                          <span className="text-body fw-medium">
                            {productDetail[0]?.seller?.firstName
                              ? productDetail[0]?.seller?.firstName
                              : ""}
                            {productDetail[0]?.seller?.lastName
                              ? productDetail[0]?.seller?.lastName
                              : ""}
                          </span>
                        </div>
                        <div className="vr" />
                        <div className="text-muted">
                      
                          <span className="text-body fw-medium">
                            {productDetail[0]?.isOutOfStock === false ? (
                              <>
                                <span className="badge badge-success p-2">
                                  In Stock
                                </span>
                              </>
                            ) : (
                              <>
                                <span className="badge badge-danger p-2">
                                  Out Of Stock
                                </span>
                              </>
                            )}
                          </span>
                        </div>
                        <div className="vr" />
                        <div className="text-muted">
                          Product Code :{" "}
                          <span className="text-body fw-medium">
                            {productDetail[0]?.productCode}
                          </span>
                        </div>
                      </div>
                      <div class="d-flex flex-wrap gap-2 align-items-center mt-3">
                        <div class="text-muted fs-16">
                          <Rating
                            initialValue={
                              productDetail[0]?.rating[0]?.avgRating
                            }
                            readonly={true}
                            allowFraction
                          />
                        </div>
                        <div class="text-muted">
                          {"(" +
                            productDetail[0]?.review +
                            " Customer Review )"}
                        </div>
                      </div>

                      <div className="row mt-4">
                        <div className="col-lg-3 col-sm-6 mt-2">
                          <div className="p-2 border border-dashed rounded">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-era mx-2 fs-24">
                                  <i className="fa fa-dollar fs-5" />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <p
                                  className="text-muted mb-1"
                                  style={{ fontSize: "13px" }}
                                >
                                  Price :
                                </p>
                                <h5 className="mb-0 fw-bold text-muted fs-6">
                                  $
                                  {productDetail[0]?.price
                                    ? " " + productDetail[0]?.price
                                    : ""}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                   
                        <div className="col-lg-3 col-sm-6 mt-2">
                          <div className="p-2 border border-dashed rounded">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-era mx-2 fs-24">
                                  <i className="bi bi-cart4 fs-5" />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <p
                                  className="text-muted mb-1"
                                  style={{ fontSize: "13px" }}
                                >
                                  Shipping Charge :
                                </p>
                                <h5 className="mb-0 fw-bold text-muted fs-6">
                                  $
                                  {productDetail[0]?.shippingCharges
                                    ? " " + productDetail[0]?.shippingCharges
                                    : ""}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                   
                        <div className="col-lg-3 col-sm-6 mt-2">
                          <div className="p-2 border border-dashed rounded">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-era mx-2 fs-24">
                                  <i className="bi bi-bag-check fs-5" />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <p
                                  className="text-muted mb-1"
                                  style={{ fontSize: "13px" }}
                                >
                                  Sold :
                                </p>
                                <h5 className="mb-0 fw-bold text-muted fs-6">
                                  {productDetail[0]?.sold}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                   
                        <div className="col-lg-3 col-sm-6 mt-2">
                          <div className="p-2 border border-dashed rounded">
                            <div className="d-flex align-items-center">
                              <div className="avatar-sm me-2">
                                <div className="avatar-title rounded bg-transparent text-era mx-2 fs-24">
                                  <i className="bi bi-bookmark-check fs-5" />
                                </div>
                              </div>
                              <div className="flex-grow-1">
                                <p
                                  className="text-muted mb-1"
                                  style={{ fontSize: "13px" }}
                                >
                                  Tag :
                                </p>
                                <h5 className="mb-0 fw-bold text-muted fs-6">
                                  {productDetail[0]?.seller?.businessTag}
                                </h5>
                              </div>
                            </div>
                          </div>
                        </div>
                   
                      </div>
                      <div className="row mt-2">
                        {productDetail[0]?.attributes?.map((s) => {
                          return (
                            <>
                              <div className="col-6">
                                <div className="sizes my-3 me-2">
                                  <span className="fw-bold">{s?.name} : </span>{" "}
                                  <br />
                                  <div className="row">
                                    {s.value.length > 0 ? (
                                      <>
                                        {s.value.map((d) => {
                                          return (
                                            <>
                                              <div
                                                className="col-xl-3 col-md-4 col-6 mt-2"
                                                style={{ marginRight: "10px" }}
                                              >
                                                <span
                                                  className="badge text-light  py-2"
                                                  style={{
                                                    backgroundColor: "#b93160",
                                                    fontSize: "13px",
                                                    width: "95px",
                                                  }}
                                                >
                                                  {d}
                                                </span>
                                              </div>
                                            </>
                                          );
                                        })}
                                      </>
                                    ) : (
                                      <>
                                        <span>-</span>
                                      </>
                                    )}
                                  </div>
                                </div>
                              </div>
                            </>
                          );
                        })}
                      </div>
                      <div className="mt-4 ">
                        <h5
                          className="fs-14 fw-bold"
                          style={{ fontSize: "16px" }}
                        >
                          Description :
                        </h5>
                        <p style={{ fontSize: "14px" }} className="text-muted">
                          {productDetail[0]?.description}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
                <div className="row">
                  <div className="col-md-12 col-12">
                    <div className="userReview mt-4 ">
                      <h5 className="p-title pb-2">Product Review</h5>
                      <ul className="mb-4">
                        {review?.length > 0 ? (
                          <>
                            {review?.map((data) => {
                              return (
                                <>
                                  <li className="card mb-2">
                                    <div className="card-body p-lg-4 p-3">
                                      <div className="d-flex mb-3 pb-3 border-bottom flex-wrap">
                                        <img
                                          className="avatar rounded"
                                          src={data?.userImage}
                                          alt
                                          style={{
                                            width: "60px",
                                            height: "60px",
                                          }}
                                        />
                                        <div className="flex-fill ms-3 text-truncate">
                                          <h6 className="mb-0">
                                            <span>
                                              {data.firstName +
                                                " " +
                                                data.lastName}
                                            </span>
                                          </h6>
                                          <span className="text-muted">
                                            {data.time}
                                          </span>
                                        </div>
                                        <div className="d-flex">
                                          <Rating
                                            initialValue={data?.rating}
                                            readonly={true}
                                            allowFraction
                                            className="mt-2"
                                          />
                                        </div>
                                      </div>
                                      <div className="timeline-item-post">
                                      
                                        <p className="fs-6">{data.review}</p>
                                      </div>
                                    </div>
                                  </li>
                                </>
                              );
                            })}
                          </>
                        ) : (
                          <>
                            <li className="text-center my-4">
                              <span
                                className="text-center fw-bolder"
                                style={{ fontSize: "18px" }}
                              >
                                No Data Found
                              </span>
                            </li>
                          </>
                        )}
                      </ul>
                    </div>
                    <Pagination
                      component="div"
                      count={review?.length}
                      type={"server"}
                      onPageChange={handleChangePage}
                      serverPerPage={rowsPerPage}
                      totalData={review?.length}
                      serverPage={currentPage}
                      setCurrentPage={setCurrentPage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
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

export default connect(null, {
  getProductDetail,
  outOfStock,
  getProductReview,
})(ProductDetail);
