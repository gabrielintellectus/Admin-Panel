import React, { useEffect } from "react";
import { connect, useDispatch, useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import { Rating } from "react-simple-star-rating";
import { getLiveSellerProduct } from "../../store/seller/seller.action";

const LiveSellerProduct = (props) => {
  const { state } = useLocation();
  const { liveProduct } = useSelector((state) => state.seller);
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(getLiveSellerProduct(state));
  }, [dispatch, state]);

  return (
    <>
      <div className="row m-3 mt-5">
        {liveProduct?.map((product) => {
          return (
            <>
              <div className="col-xl-3 col-lg-3 col-sm-6">
                <div className="card" style={{ borderRadius: "8px" }}>
                  <div className="card-body p-0">
                    <div className="pro-img">
                      <img
                        src={product?.mainImage}
                        width="100%"
                        height={350}
                        style={{
                          objectFit: "cover",
                          borderRadius: "8px 8px 0px 0px",
                          position: "relative",
                        }}
                        alt=""
                      />
                      <div
                        className="ping"
                        style={{
                          position: "absolute",
                          top: "5px",
                          left: "7px",
                        }}
                      ></div>
                    </div>
                    <div className="pro-content p-2">
                      <p className="mb-1">
                        Total Sold : {product.sold ? product.sold : 0}
                      </p>
                      <b className="fs-6">{product?.productName}</b> <br />
                      <Rating
                        className="my-2 fs-6"
                        initialValue={product?.rating}
                        readonly={true}
                        allowFraction
                      />
                      <h6 className="fw-bolder" style={{ color: "#B93160" }}>
                        $ {product?.price}
                      </h6>
                    </div>
                  </div>
                </div>
              </div>
            </>
          );
        })}
      </div>
    </>
  );
};

export default connect(null, { getLiveSellerProduct })(LiveSellerProduct);
