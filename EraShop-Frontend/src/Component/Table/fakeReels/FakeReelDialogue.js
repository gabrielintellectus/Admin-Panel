import React, { useRef } from "react";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Input from "../../extra/Input";
import Button from "../../extra/Button";
import { connect, useDispatch, useSelector } from "react-redux";
import { useState } from "react";
import { useEffect } from "react";
import { getFakeSellerDropDown } from "../../store/fake Seller/fakeSeller.action";
import { useLocation } from "react-router-dom";

import {
  updateFakeReel,
  createFakeReel,
} from "../../store/fakeReels/fakeReels.action";
import { getSellerProduct } from "../../store/seller/seller.action";
import VideoThumbnail from "react-video-thumbnail";

const FakeReelDialogue = (props) => {
  const dispatch = useDispatch();

  const { fakeSeller } = useSelector((state) => state.fakeSeller);
  

  const { dialogueData } = useSelector((state) => state.dialogue);

  const { product } = useSelector((state) => state.seller);

  const [mongoId, setMongoId] = useState("");
  const [sellerType, setSellerType] = useState("");
  const [videoType, setVideoType] = useState(2);
  const [videoPath, setVideoPath] = useState(null);
  const [thumbnailType, setThumbnailType] = useState(2);
  const [thumbnail, setThumbnail] = useState([]);
  const [thumbnailPath, setThumbnailPath] = useState("");
  const [duration, setDuration] = useState(0);
  const [productType, setProductType] = useState("");
  const [thumbnailUrl, setThumbnailUrl] = useState(null);
  const [thumbnailKey, setThumbnailKey] = useState(0);
  const [video, setVideo] = useState({
    file: "",
    thumbnailBlob: "",
  });
  const videoRef = useRef(null);
  let thumbnailFile = {};

  const [error, setError] = useState({
    video: "",
    videoPath: "",
    sellerType: "",
    productType: "",
    thumbnail: "",
    thumbnailPath: "",
  });

  console.log("videoType ", videoType);

  useEffect(() => {
    if (dialogueData) {
      setMongoId(dialogueData?._id);
      setSellerType(dialogueData?.sellerId?._id);
      setVideoType(dialogueData?.videoType);
      setProductType(dialogueData?.productId?._id);
      setVideoPath(dialogueData?.video);
      setVideo(dialogueData?.video);
      setThumbnail(dialogueData?.thumbnail);
      setThumbnailPath(dialogueData?.thumbnail);
    }
  }, [dialogueData]);

  useEffect(() => {
    dispatch(getFakeSellerDropDown());
    if (sellerType) {
      dispatch(getSellerProduct(sellerType));
    }
  }, [dispatch,sellerType]);

  const handleVideo = async (e) => {
    const file = e.target.files[0];
    setVideoPath(URL.createObjectURL(e.target.files[0]));

    if (file) {
      const thumbnailBlob = await generateThumbnailBlob(file);

      if (thumbnailBlob) {
        const videoFileName = file ? file?.name : "video";
        const thumbnailFileName = `${videoFileName.replace(
          /\.[^/.]+$/,
          ""
        )}.jpeg`;

        const thumbnailFile = new File([thumbnailBlob], thumbnailFileName, {
          type: "image/jpeg",
        });
        setThumbnail(thumbnailFile);
        console.log("thumbnailFilethumbnailFilethumbnailFile", thumbnailFile);
        setVideo({
          file: file,
          thumbnailBlob: thumbnailFile,
        });
      }
      setThumbnailKey((prevKey) => prevKey + 1);
    } else {
      setError((prevErrors) => ({
        ...prevErrors,
        video: "Please select a video!",
      }));
    }
  };

  const generateThumbnailBlob = async (file) => {
    return new Promise((resolve) => {
      const video = document.createElement("video");
      video.preload = "metadata";

      video.onloadedmetadata = () => {
        video.currentTime = 1; // Set to capture the frame at 1 second
      };

      video.onseeked = async () => {
        const canvas = document.createElement("canvas");
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        const ctx = canvas.getContext("2d");
        ctx.drawImage(video, 0, 0, canvas.width, canvas.height);

        // Convert the canvas to blob
        canvas.toBlob((blob) => {
          resolve(blob);
        }, "image/jpeg");
      };

      const objectURL = URL.createObjectURL(file);
      video.src = objectURL;

      return () => {
        URL.revokeObjectURL(objectURL);
      };
    });
  };

  const handleImage = (e) => {
    setError((prevErrors) => ({
      ...prevErrors,
      thumbnail: "",
    }));
    setThumbnail(e.target.files[0]);
    setThumbnailPath(URL.createObjectURL(e.target.files[0]));
  };

  const handleSubmit = () => {
    if (!sellerType || !video || !videoPath || !productType || !thumbnail) {
      let error = {};
      if (sellerType?.length < 0 || !sellerType)
        error.sellerType = "Seller is Required !";
      if (productType?.length < 0 || !productType)
        error.productType = "Product is Required !";

      if (video.length === 0 || !videoPath)
        error.video = "Please select a video!";
      if (thumbnail.length === 0)
        error.thumbnail = "Please select a Thumbnail !";
      return setError({ ...error });
    } else {
      const urlRegex = /^(ftp|http[s]?)?:\/\/[^ "]+$/;
      if (videoType == 2 && urlRegex.test(videoPath && dialogueData?.video)) {
        const errors = { video: "Invalid URL!" };
        return setError({ ...errors });
      }
      
      const formData = new FormData();

      formData.append("sellerId", sellerType);
      formData.append("productId", productType);

      if (mongoId && video.length === 0) {
        formData.append("videoType", 2);
        formData.append("video", videoPath);
      } else {
        formData.append("videoType", videoType);
        if (videoType == 2) {
          formData.append("video", videoPath);
        } else {
          formData.append("video", video?.file ? video?.file : video);
        }
      }

      formData.append("thumbnail", thumbnail);
      formData.append("duration", duration);
      if (mongoId) {
        props.updateFakeReel(formData, sellerType, mongoId);
      } else {
        props.createFakeReel(formData);
      }
      dispatch({ type: CLOSE_DIALOGUE });
    }
  };

  return (
    <>
      <div className="mainDialogue fade-in">
        <div className="Dialogue">
          <div className="dialogueHeader">
            <div className="headerTitle fw-bold">Fake Reel</div>
            <div
              className="closeBtn "
              onClick={() => {
                dispatch({ type: CLOSE_DIALOGUE });
              }}
            >
              <i class="fa-solid fa-xmark"></i>
            </div>
          </div>
          <div className="dialogueMain">
            <div className="row">
              <div className="col-md-6 col-12">
                <label className="styleForTitle mb-2 text-dark">Seller</label>
                <select
                  productName="type"
                  className="form-control form-control-line"
                  id="type"
                  value={sellerType}
                  onChange={(e) => {
                    setSellerType(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        sellerType: "Seller is Required !",
                      });
                    } else {
                      return setError({
                        ...error,
                        sellerType: "",
                      });
                      setProductType("");
                      props.getSellerProduct(e.target.value);
                    }
                  }}
                >
                  <option value="" disabled selected>
                    --select seller--
                  </option>
                  {fakeSeller?.map((data) => {
                    return (
                      <option value={data?._id}>
                        {data.firstName + " " + data.lastName}
                      </option>
                    );
                  })}
                </select>
                {error.sellerType && (
                  <div className="pl-1 text-left">
                    <p className="errorMessage">{error.sellerType}</p>
                  </div>
                )}
              </div>
              <div className="col-md-6 col-12">
                <label className="styleForTitle mb-2 text-dark">Product</label>
                <select
                  productName="type"
                  className="form-control form-control-line"
                  id="type"
                  value={productType}
                  onChange={(e) => {
                    setProductType(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        productType: "Product is Required !",
                      });
                    } else {
                      return setError({
                        ...error,
                        productType: "",
                      });
                    }
                  }}
                >
                  <option value="" disabled selected>
                    --select product--
                  </option>
                  {product?.map((data) => {
                    return (
                      <option value={data?._id}>{data?.productName}</option>
                    );
                  })}
                </select>
               
                {error.productType && (
                  <div className="pl-1 text-left">
                    <p className="errorMessage">{error.productType}</p>
                  </div>
                )}
              </div>

              <div className="col-12">
                <div className="d-flex align-items-center mt-3">
                  <label className="mb-3"> Video Type :- </label>
                  <Input
                    label={`File`}
                    name={`file`}
                    id={`file`}
                    type={`radio`}
                    value={"1"}
                    checked={videoType == 1 ? true : false}
                    newClass={`me-3 ms-2 mb-2`}
                    onClick={(e) => {
                      setVideoType(e.target.value);
                    }}
                  />
                  <Input
                    label={`Link`}
                    name={`file`}
                    id={`link`}
                    type={`radio`}
                    value={"2"}
                    newClass={`mb-2`}
                    checked={videoType == 2 ? true : false}
                    onClick={(e) => {
                      setVideoType(e.target.value);
                    }}
                  />
                </div>
              </div>
              <div className={videoType == 1 ? "col-12" : "d-none"}>
                <Input
                  label={`Video`}
                  id={`video`}
                  type={`file`}
                  accept={`video/*`}
                  errorMessage={error.video && error.video}
                  onChange={handleVideo}
                />
                {video.file ? (
                  <div className="">
                    <video
                      controls
                      style={{ width: "200px", height: "200px" }}
                      src={video?.file ? URL?.createObjectURL(video?.file) : ""}
                    />
                    <img
                      src={
                        video?.thumbnailBlob
                          ? URL?.createObjectURL(video?.thumbnailBlob)
                          : ""
                      }
                      style={{
                        width: "200px",
                        height: "200px",
                        position: "absolute",
                        marginLeft: "36px",
                      }}
                    />
                  </div>
                ) : (
                  <>
                    <div className="">
                      <video
                        controls
                        style={{ width: "200px", height: "200px" }}
                        src={videoPath}
                      />
                      <img
                        src={thumbnail}
                        style={{
                          width: "200px",
                          height: "200px",
                          position: "absolute",
                          marginLeft: "36px",
                        }}
                      />
                    </div>
                  </>
                )}
              
              
              </div>
              <div className={videoType == 2 ? "col-12" : "d-none"}>
                <Input
                  label={`Link`}
                  placeholder={`link`}
                  id={`link`}
                  type={`text`}
                  value={videoPath}
                  errorMessage={error.video && error.video}
                  onChange={(e) => {
                    setVideoPath(e.target.value);
                    if (!e.target.value) {
                      return setError({
                        ...error,
                        video: `Video Link Is Required`,
                      });
                    } else {
                      return setError({
                        ...error,
                        video: "",
                      });
                    }
                  }}
                />
                {videoPath && (
                  <div className="image-start">
                    <video
                      src={videoPath}
                      alt="banner"
                      controls
                      draggable="false"
                      width={100}
                      height={100}
                      className="m-0"
                    />
                  </div>
                )}
                <div className={"col-12"}>
                  <Input
                    label={`Thumbnail`}
                    id={`image`}
                    type={`file`}
                    accept={`image/*`}
                    errorMessage={error.thumbnail && error.thumbnail}
                    onChange={(e) => handleImage(e)}
                  />
                  {thumbnailPath && (
                    <div className="image-start">
                      <img
                        src={thumbnailPath}
                        draggable="false"
                        width={100}
                        height={100}
                        className="m-0"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
          <div className="dialogueFooter">
            <div className="dialogueBtn">
              {!mongoId ? (
                <>
                  <Button
                    btnName={`Submit`}
                    btnColor={`btnBlackPrime text-white`}
                    style={{ borderRadius: "5px", width: "80px" }}
                    newClass={`me-2`}
                    onClick={handleSubmit}
                  />
                </>
              ) : (
                <>
                  <Button
                    btnName={`Update`}
                    btnColor={`btnBlackPrime text-white`}
                    style={{ borderRadius: "5px", width: "80px" }}
                    newClass={`me-2`}
                    onClick={handleSubmit}
                  />
                </>
              )}
              <Button
                btnName={`Close`}
                btnColor={`bg-danger text-white`}
                style={{ borderRadius: "5px", width: "80px" }}
                onClick={() => {
                  dispatch({ type: CLOSE_DIALOGUE });
                }}
              />
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  getFakeSellerDropDown,
  createFakeReel,
  updateFakeReel,
  getSellerProduct,
})(FakeReelDialogue);

