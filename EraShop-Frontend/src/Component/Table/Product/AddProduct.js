import React, { useEffect, useState } from "react";
import Button from "../../extra/Button";
import { CLOSE_DIALOGUE } from "../../store/dialogue/dialogue.type";
import Input from "../../extra/Input";
import { connect, useDispatch, useSelector } from "react-redux";

import { sellerDropDown } from "../../store/seller/seller.action";
import { getCategory } from "../../store/category/category.action";
import { getCategoryWiseSubCategory } from "../../store/subCategory/subCategory.action";
import { getAttribute } from "../../store/attribute/attribute.action";
import { updateProduct } from "../../store/product/product.action";
import { createFakeProduct } from "../../store/fakeProduct/fakeProduct.action";
import Multiselect from "multiselect-react-dropdown";
import ReactDropzone from "react-dropzone";
import { useLocation, useNavigate } from "react-router-dom";
import { useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Chip from "@mui/material/Chip";
import { Autocomplete, TextField } from "@mui/material";
import { getFakeSellerDropDown } from "../../store/fake Seller/fakeSeller.action";
// import Select from "react-select"

const ITEM_HEIGHT = 48;
const ITEM_PADDING_TOP = 8;
const MenuProps = {
  PaperProps: {
    style: {
      maxHeight: ITEM_HEIGHT * 4.5 + ITEM_PADDING_TOP,
      width: 250,
    },
  },
};

function getStyles(name, personName, theme) {
  // return {
  //   fontWeight:
  //     personName(name) === -1
  //       ? theme.typography.fontWeightRegular
  //       : theme.typography.fontWeightMedium,
  // };
}

const AddProduct = (props) => {
  
  const { fakeSeller } = useSelector((state) => state.fakeSeller);
  const { category } = useSelector((state) => state.category);
  const { categoryWiseSubCategory } = useSelector((state) => state.subCategory);
  const { attribute } = useSelector((state) => state.attribute);

  const { state } = useLocation();

  const [mongoId, setMongoId] = useState("");
  const [productName, setProductName] = useState("");
  const [price, setPrice] = useState("");
  // mainImage
  const [image, setImage] = useState([]);
  const [imagePath, setImagePath] = useState("");

  // multiple image
  const [images, setImages] = useState([]);

  const [sellerType, setSellerType] = useState("");
  const [categoryType, setCategoryType] = useState("");
  const [subCategoryType, setSubCategoryType] = useState("");
  const [description, setDescription] = useState("");
  const [shippingCharge, setShippingCharge] = useState("");
  const [productCode, setProductCode] = useState("");
  const [attributeType, setAttributeType] = useState("");
  const [selectedValue, setSelectedValue] = useState([]);
  const theme = useTheme();
  const [personNames, setPersonNames] = useState([
    {
      name: "",
      value: [],
    },
  ]);

  const [selectErrors, setSelectErrors] = useState(
    Array(attribute.length).fill("")
  );

  const [error, setError] = useState({
    productName: "",
    image: "",
    sellerType: "",
    categoryType: "",
    subCategoryType: "",
    description: "",
    attributeType: "",
    shippingCharge: "",
    productCode: "",
    images: "",
    personNames: "",
  });

  useEffect(() => {
    setPersonNames(
      attribute?.map((res) => ({
        name: res?.name,
        value: [],
      })) || []
    );
    console.log("attribute", attribute);
  }, []);

  const dispatch = useDispatch();
  const navigate = useNavigate();
  useEffect(() => {
    dispatch(getFakeSellerDropDown());
    dispatch(getCategory());
    if (categoryType) {
      dispatch(getCategoryWiseSubCategory(categoryType));
    }
    dispatch(getAttribute());
  }, [categoryType, dispatch]);



  const handlePersonNameChange = (index, selectedValues, attributeName) => {
    const updatedPersonNames = [...personNames];
    updatedPersonNames[index] = {
      ...updatedPersonNames[index],
      value: selectedValues,
      name: attributeName,
    };
    setPersonNames(updatedPersonNames);
    const newErrors = [...selectErrors];

    setSelectErrors(newErrors);
    if (personNames[0]?.value?.length === 0 && index === 0) {
      return setError({
        ...error,
        personNames: "Attributes is Required !",
      });
    } else {
      setError({
        ...error,
        personNames: "",
      });
    }
  };

  useEffect(() => {
    if (state) {
      setMongoId(state?._id);
      setProductName(state?.productName);
      setPrice(state?.price);
      setImagePath(state?.mainImage);
      setSellerType(state?.seller?._id);
     
      setCategoryType(state?.category?._id);
      setSubCategoryType(state?.subCategory?._id);
      setDescription(state?.description);
      setImages(state?.images);
      setProductCode(state?.productCode);
      setShippingCharge(state?.shippingCharges);
      setPersonNames(
        state?.attributes?.map((res) => ({
          name: res.name,
          value: res.value,
        })) || []
      );
    }
    // console.log("--------------------------", state?.attributes);
  }, [state]);

  const handleImage = (e) => {
    setImage(e.target.files[0]);
    setImagePath(URL.createObjectURL(e.target.files[0]));
    setError((prevErrors) => ({
      ...prevErrors,
      image: "",
    }));
  };

  const onPreviewDrop = (files) => {
    setError({ ...error, images: "" });
    files.map((file) =>
      Object.assign(file, { preview: URL.createObjectURL(file) })
    );
    setImages(images?.concat(files));
  };

  const removeImage = (file) => {
    if (file.preview) {
      const updatedImages = images.filter(
        (ele) => ele.preview !== file.preview
      );
      setImages(updatedImages);
    } else {
      const updatedImages = images.filter((ele) => ele !== file);
      setImages(updatedImages);
    }
  };

  const createCode = () => {
    const randomChars = "0123456789";
    let code_ = "";
    for (let i = 0; i < 6; i++) {
      code_ += randomChars.charAt(
        Math.floor(Math.random() * randomChars.length)
      );
      setProductCode(code_);
    }
    if (!code_) {
      return setError({
        ...error,
        productCode: "Code can't be a blank!",
      });
    } else {
      return setError({
        ...error,
        productCode: "",
      });
    }
  };

  let sellerId = state?.seller?._id;

  const handleSubmit = (e) => {
    if (
      !productName ||
      !image ||
      !images ||
      !sellerType ||
      !price ||
      price <= 0 ||
      !categoryType ||
      !subCategoryType ||
      !description ||
      !shippingCharge ||
      shippingCharge <= 0 ||
      !productCode ||
      productCode?.length > 7 ||
      personNames[0]?.value?.length < 0 ||
      !personNames
    ) {
      let error = {};
      if (!productName) error.productName = "ProductName is Required !";
      if (!price) error.price = "Price is Required !";
      if (price <= 0) error.price = "Enter Correct Price";
      if (sellerType?.length < 0 || !sellerType)
        error.sellerType = "SellerType is Required !";
      if (!categoryType) error.categoryType = "CategoryType is Required !";
      if (
        !personNames ||
        personNames.length === 0 ||
        !personNames[0]?.value ||
        personNames[0].value.length === 0
      )
        error.personNames = "Attributes are required!";
      if (!shippingCharge)
        error.shippingCharge = "ShippingCharge is Required !";
      if (shippingCharge <= 0)
        error.shippingCharge = "Enter Correct ShippingCharge";
      if (!productCode) error.productCode = "ProductCode is Required !";
      if (productCode?.length < 0 || productCode?.length > 7)
        error.productCode = "Correct ProductCode !";
      if (!subCategoryType)
        error.subCategoryType = "SubCategoryType is Required !";
      if (!image?.length === 0 || !imagePath)
        error.image = "Image is required!";
      if (images?.length === 0) error.images = "Images is required !";
      if (!description) error.description = "Description is Required !";
      console.log("error.description", error.description);

      return setError({ ...error });
    } else {
      
      const formData = new FormData();
      formData.append("productName", productName);
      formData.append("price", price);
      formData.append("mainImage", image);
      formData.append("sellerId", sellerType);
      for (let i = 0; i < images?.length; i++) {
        formData.append("images", images[i]);
      }
      formData.append("category", categoryType);
      formData.append("subCategory", subCategoryType);
      formData.append("description", description);
      formData.append("shippingCharges", shippingCharge);
      formData.append("productCode", productCode);
      console.log("personNames", personNames);
      const filterData = personNames.filter((data) => data.value.length > 0);
      formData.append("attributes", JSON.stringify(filterData));
      console.log("filterData", filterData);
      if (mongoId) {
        props.updateProduct(formData, mongoId, sellerId, productCode);
      } else {
        props.createFakeProduct(formData);
      }
      navigate(-1);
    }
  };

  return (
    <>
      <div className="mainSellerDialog">
        <div className="sellerDialog">
          <div className="sellerHeader primeHeader">
            <div className="row">
              <div className="col-12">
                <div
                  className="d-flex justify-content-end"
                >
                  <Button
                    newClass={`themeFont boxCenter userBtn fs-5`}
                    
                    btnIcon={`fa-solid fa-angles-left text-white fs-6`}
                    style={{
                      borderRadius: "5px",
                      width: "60px",
                      backgroundColor: "#b93160",
                      color: "#fff",
                    }}
                    onClick={() => navigate("/admin/product")}
                  />
                </div>
              </div>
            </div>
          </div>
          <div className="sellerMain" style={{ margin: "10px 18px" }}>
            <div className="card">
              <div className="card-body">
                <div className="sellerDetail pt-3">
                  <div className="row">
                    <div className="col-lg-4 col-md-6">
                      <label className="styleForTitle mb-2 text-dark">
                        Seller
                      </label>
                      <select
                        productName="type"
                        className="form-control form-control-line"
                        id="type"
                        value={sellerType}
                        disabled={state ? true : false}
                        onChange={(e) => {
                          setSellerType(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              sellerType: "SellerType is Required !",
                            });
                          } else {
                            return setError({
                              ...error,
                              sellerType: "",
                            });
                          }
                        }}
                      >
                        <option value="" disabled selected>
                          --select seller--
                        </option>
                        {fakeSeller?.map((data) => {
                          return (
                            <option value={data._id}>
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
                    <div className="col-lg-4 col-md-6">
                      <Input
                        label={`Product Name`}
                        id={`productName`}
                        type={`text`}
                        value={productName}
                        errorMessage={error.productName && error.productName}
                        onChange={(e) => {
                          setProductName(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              productName: `Product Name Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              productName: "",
                            });
                          }
                        }}
                      />
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <label className="styleForTitle mb-1 text-dark">
                        Category Type
                      </label>
                      <select
                        name="type"
                        className="form-control form-control-line"
                        id="type"
                        value={categoryType}
                        onChange={(e) => {
                          setCategoryType(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              categoryType: "CategoryType is Required !",
                            });
                          } else {
                            setError({
                              ...error,
                              categoryType: "",
                            });
                            setSubCategoryType(""); // Reset the selected subcategory
                            props.getCategoryWiseSubCategory(e.target.value); // Fetch subcategories based on the selected category
                          }
                        }}
                      >
                        <option value="" disabled selected>
                          --select category--
                        </option>
                        {category.map((data) => {
                          return <option value={data._id}>{data.name}</option>;
                        })}
                      </select>
                      {error.categoryType && (
                        <div className="pl-1 text-left">
                          <p className="errorMessage">{error.categoryType}</p>
                        </div>
                      )}
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <label className="styleForTitle mb-1 text-dark">
                        Sub Category
                      </label>
                      <select
                        name="type"
                        className="form-control form-control-line"
                        id="type"
                        value={subCategoryType}
                        onChange={(e) => {
                          setSubCategoryType(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              subCategoryType: "SubCategoryType is Required !",
                            });
                          } else {
                            setError({
                              ...error,
                              subCategoryType: "",
                            });
                          }
                        }}
                      >
                        <option value="" disabled selected>
                          --select subCategory--
                        </option>
                        {categoryWiseSubCategory?.map((data) => {
                          return (
                            <option
                              key={data?.subCategoryId}
                              value={data?.subCategoryId}
                            >
                              {data?.name}
                            </option>
                          );
                        })}
                      </select>
                      {error.subCategoryType && (
                        <div className="pl-1 text-left">
                          <p className="errorMessage">
                            {error.subCategoryType}
                          </p>
                        </div>
                      )}
                    </div>

                    <div className="col-lg-4 col-md-6">
                      <Input
                        label={`Price ($)`}
                        id={`price`}
                        type={`number`}
                        value={price}
                        errorMessage={error.price && error.price}
                        onChange={(e) => {
                          setPrice(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              price: `Price Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              price: "",
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <Input
                        label={`Shipping Charge ($)`}
                        id={`shippingCharges`}
                        type={`number`}
                        value={shippingCharge}
                        errorMessage={
                          error.shippingCharge && error.shippingCharge
                        }
                        onChange={(e) => {
                          setShippingCharge(e.target.value);
                          if (!e.target.value) {
                            return setError({
                              ...error,
                              shippingCharge: `Shipping Charge Is Required`,
                            });
                          } else {
                            return setError({
                              ...error,
                              shippingCharge: "",
                            });
                          }
                        }}
                      />
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <Input
                        label={`Image`}
                        id={`image`}
                        type={`file`}
                        accept={`image/*`}
                        errorMessage={error.image && error.image}
                        onChange={(e) => handleImage(e)}
                      />
                      {imagePath && (
                        <div className="image-start">
                          <img
                            src={imagePath}
                            alt="banner"
                            draggable="false"
                            width={100}
                            className="m-0"
                          />
                        </div>
                      )}
                    </div>
                    <div className="col-lg-4 col-md-6">
                      <div class="row d-flex">
                        <div class={`${mongoId ? "col-12" : "col-md-10"}`}>
                          <Input
                            label={`Product Code (6 digit)`}
                            id={`productCode`}
                            type={`number`}
                            value={productCode}
                            readOnly
                            disabled={state ? true : false}
                            errorMessage={
                              error.productCode && error.productCode
                            }
                            onChange={(e) => {
                              setProductCode(e.target.value);
                              if (!e.target.value) {
                                return setError({
                                  ...error,
                                  productCode: `Product Code Is Required`,
                                });
                              } else {
                                return setError({
                                  ...error,
                                  productCode: "",
                                });
                              }
                            }}
                          />
                        </div>
                        {!mongoId && (
                          <div
                            className="col-md-2 pl-0 d-flex justify-content-end align-items-center"
                            style={{ marginTop: "11px" }}
                          >
                            <button
                              type="button"
                              className="btn text-white"
                              style={{
                                borderRadius: 5,
                                fontSize: "14px",
                                padding: "7px",
                                backgroundColor: "#b93160",
                              }}
                              onClick={createCode}
                            >
                              Generate
                            </button>
                          </div>
                        )}
                      </div>
                    </div>
                  </div>
                  <div className="row my-4">
                    <h3 className="mb-3">Attribute</h3>
                    {attribute.map((data, index) => {
                      return (
                        <>
                          <div className="col-xl-3 col-md-6 col-12">
                            <FormControl sx={{ m: 1, width: 300 }}>
                              <InputLabel
                                id="demo-multiple-chip-label"
                                style={{ width: "auto" }}
                              >
                                {data.name}
                              </InputLabel>

                              <Select
                                labelId={`demo-multiple-chip-label`}
                                id={`demo-multiple-chip-${index}`}
                                multiple
                                value={personNames[index]?.value || []} // Use personNames[index]?.value as the value prop
                                onChange={(event) =>
                                  handlePersonNameChange(
                                    index,
                                    event.target.value,
                                    data?.name
                                  )
                                }
                                input={
                                  <OutlinedInput
                                    id={`select-multiple-chip-${index}`}
                                    label="Chip"
                                    required={true}
                                  />
                                }
                                renderValue={(selected) => (
                                  <Box
                                    sx={{
                                      display: "flex",
                                      flexWrap: "wrap",
                                      gap: 0.5,
                                    }}
                                  >
                                    {Array.isArray(selected) ? (
                                      selected.map((value) => (
                                        <Chip key={value} label={value} />
                                      ))
                                    ) : (
                                      <Chip key={selected} label={selected} />
                                    )}
                                  </Box>
                                )}
                                MenuProps={MenuProps}
                              >
                                {data?.value?.map((name) => (
                                  <MenuItem
                                    key={name}
                                    value={name}
                                    style={getStyles(
                                      name,
                                      personNames &&
                                        personNames[0] &&
                                        Array.isArray(personNames[0].value)
                                        ? personNames[0].value[index] || []
                                        : [],
                                      theme
                                    )}
                                  >
                                    {name}
                                  </MenuItem>
                                ))}
                              </Select>
                            </FormControl>
                            {error.personNames &&
                              error.personNames.length > 0 && (
                                <div className="ml-2 mt-1">
                                  <div className="pl-1 text__left">
                                    <span className="errorMessage">
                                      {error.personNames}
                                    </span>
                                  </div>
                                </div>
                              )}
                            {selectErrors[index] && (
                              <div className="ml-2 mt-1">
                                <div className="pl-1 text__left">
                                  <span className="errorMessage">
                                    {selectErrors[index]}
                                  </span>
                                </div>
                              </div>
                            )}
                          </div>
                        </>
                      );
                    })}
                  </div>
                  <div className="row">
                    <div className="col-12">
                      <label className="float-left styleForTitle text-dark">
                        Description
                      </label>
                      <textarea
                        class="form-control"
                        placeholder="description..."
                        id="exampleFormControlTextarea1"
                        rows="5"
                        value={description}
                        onChange={(e) => {
                          setDescription(e.target.value);

                          if (!e.target.value) {
                            return setError({
                              ...error,
                              description: "Description is Required!",
                            });
                          } else {
                            return setError({
                              ...error,
                              description: "",
                            });
                          }
                        }}
                      ></textarea>

                      {error.description && (
                        <div className="ml-2 mt-1">
                          {error.description && (
                            <div className="pl-1 text__left">
                              <span className="errorMessage">
                                {error.description}
                              </span>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                  <div className="row">
                    <div className="col-xl-2 col-md-4 col-12 mt-2">
                      <label class="float-left dialog__input__title">
                        Select (Multiple) Image
                      </label>

                      <>
                        <ReactDropzone
                          onDrop={(acceptedFiles) =>
                            onPreviewDrop(acceptedFiles)
                          }
                          accept="image/*"
                        >
                          {({ getRootProps, getInputProps }) => (
                            <section className="mt-4">
                              <div {...getRootProps()}>
                                <input {...getInputProps()} />
                                <div
                                  style={{
                                    height: "130px",
                                    width: "130px",
                                    border: "2px dashed gray",
                                    textAlign: "center",
                                    marginTop: "10px",
                                  }}
                                >
                                  <i
                                    className="fas fa-plus"
                                    style={{
                                      paddingTop: "30px",
                                      fontSize: "70px",
                                    }}
                                  ></i>
                                </div>
                              </div>
                            </section>
                          )}
                        </ReactDropzone>
                      </>
                    </div>
                    <div className="col-xl-10 col-md-8 col-12 mt-5">
                      {images?.map((file, index) => {
                        return file?.type?.split("image")[0] === "" ? (
                          <>  <img
                              height="100px"
                              width="100px"
                              alt="app"
                              src={file.preview}
                              style={{
                                boxShadow:
                                  "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                border: "2px solid #fff",
                                borderRadius: "10px",
                                marginTop: "10px",
                                float: "left",
                                objectFit: "contain",
                                marginRight: "15px",
                              }}
                              draggable="false"
                            />
                            <div
                              class="img-container"
                              style={{
                                display: "inline",
                                position: "relative",
                                float: "left",
                              }}
                            >
                              <i
                                class="fas fa-times-circle text-danger"
                                style={{
                                  position: "absolute",
                                  right: "10px",
                                  top: "4px",
                                  cursor: "pointer",
                                }}
                                onClick={() => removeImage(file)}
                              ></i>
                            </div>
                        
                          </>
                        ) : (
                          <>
                            <div className="col-12 col-sm-12 col-md-6 my-2">
                              <img
                                height="100px"
                                width="100px"
                                alt="app"
                                src={file}
                                style={{
                                  boxShadow:
                                    "0 5px 15px 0 rgb(105 103 103 / 00%)",
                                  border: "2px solid #fff",
                                  borderRadius: "10px",
                                  marginTop: "10px",
                                  float: "left",
                                  objectFit: "contain",
                                  marginRight: "15px",
                                }}
                                draggable="false"
                              />
                              <div
                                class="img-container"
                                style={{
                                  display: "inline",
                                  position: "relative",
                                  float: "left",
                                }}
                              >
                                <i
                                  class="fas fa-times-circle text-danger"
                                  style={{
                                    position: "absolute",
                                    right: "10px",
                                    top: "4px",
                                    cursor: "pointer",
                                  }}
                                  onClick={() => removeImage(file)}
                                ></i>
                              </div>
                            </div>
                          </>
                        );
                      })}
                    </div>
                  </div>
                  {error.images && (
                    <div className="ml-2 mt-1">
                      {error.images && (
                        <div className="pl-1 text__left">
                          <span className="errorMessage">{error.images}</span>
                        </div>
                      )}
                    </div>
                  )}
                  <div className="row">
                    <div className="col-12 d-flex justify-content-end">
                      <Button
                        btnName={`Close`}
                        btnColor={`bg-danger text-white `}
                        style={{ borderRadius: "5px", width: "80px" }}
                        onClick={() => {
                          navigate(-1);
                        }}
                      />
                      {!mongoId ? (
                        <>
                          <Button
                            btnName={`Submit`}
                            btnColor={`btnBlackPrime text-white ms-2`}
                            style={{ borderRadius: "5px", width: "80px" }}
                            onClick={(e) => handleSubmit(e)}
                          />
                        </>
                      ) : (
                        <>
                          <Button
                            btnName={`Update`}
                            btnColor={`btnBlackPrime text-white ms-2`}
                            style={{ borderRadius: "5px", width: "80px" }}
                            onClick={(e) => handleSubmit(e)}
                          />
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <div className="sellerFooter primeFooter"></div>
        </div>
      </div>
    </>
  );
};

export default connect(null, {
  createFakeProduct,
  updateProduct,
  sellerDropDown,
  getCategory,
  getCategoryWiseSubCategory,
  getAttribute,
})(AddProduct);
