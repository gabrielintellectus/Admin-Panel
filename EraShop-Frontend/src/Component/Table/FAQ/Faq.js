import React from "react";
import Button from "../../extra/Button";
import FaqDialog from "./FaqDialog";
import { OPEN_DIALOGUE } from "../../store/dialogue/dialogue.type";
import { connect, useDispatch, useSelector } from "react-redux";
import { useEffect } from "react";
import { useState } from "react";
import { getFaQ, deleteFaQ } from "../../store/FAQ/faq.action";
import {  warning } from "../../util/Alert";
import Skeleton from "react-loading-skeleton";
import { colors } from "../../util/SkeletonColor";
import "react-loading-skeleton/dist/skeleton.css";

const FaQ = (props) => {
  const { FaQ } = useSelector((state) => state.FaQ);
  const { dialogue, dialogueType, dialogueData } = useSelector(
    (state) => state.dialogue
  );
  

  const dispatch = useDispatch();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    dispatch(getFaQ());
  }, [dispatch]);

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false);
    }, 1500); // Adjust the delay time as needed

    return () => clearTimeout(timer);
  }, []);

  useEffect(() => {
    setData(FaQ);
  }, [FaQ]);

  // Delete PromoCode
  const handleDelete = (id) => {
    

    const data = warning();
    data
      .then((isDeleted) => {
        if (isDeleted) {
          props.deleteFaQ(id);
        }
      })
      .catch((err) => console.log(err));
  };

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
                      payload: { type: "faq" },
                    });
                  }}
                  style={{ borderRadius: "10px" }}
                />
                {dialogue && dialogueType === "faq" && <FaqDialog />}
              </div>
              <div className="col-2 text-end">
          
              </div>
            
            </div>
          </div>
          <div className="sellerMain">
            <div className="tableMain mt-2">
              <div className="" style={{ margin: "10px 18px" }}>
                <div className="">
                  {FaQ.map((item, index) => {
                    const collapseId = `flush-collapse-${index}`;
                    const buttonId = `flush-heading-${index}`;
                    const isExpanded = index === 0; // Set the first item as expanded initially

                    return (
                      <>
                        {loading ? (
                          <>
                            <div
                              className="accordion accordion-flush"
                              id="accordionFlushExample"
                              key={index}
                            >
                              <div className="accordion-item my-4">
                                <h2 className="accordion-header" id={buttonId}>
                                  <Skeleton
                                    height={60}
                                    className="StripeElement "
                                    baseColor={colors?.baseColor}
                                    highlightColor={colors?.highlightColor}
                                  />
                                </h2>
                              </div>
                            </div>
                          </>
                        ) : (
                          <>
                            <div
                              className="accordion accordion-flush"
                              id="accordionFlushExample"
                              key={index}
                            >
                              <div className="accordion-item my-4">
                                <h2 className="accordion-header" id={buttonId}>
                                  <button
                                    className={`accordion-button collapsed fw-bold fs-5 ${
                                      isExpanded ? "" : "collapsed"
                                    }`}
                                    type="button"
                                    data-bs-toggle="collapse"
                                    data-bs-target={`#${collapseId}`}
                                    aria-expanded={
                                      isExpanded ? "true" : "false"
                                    }
                                    aria-controls={collapseId}
                                  >
                                    {index + 1 + "." + item.question}
                                  </button>
                                </h2>
                                <div
                                  id={collapseId}
                                  className={`accordion-collapse collapse ${
                                    isExpanded ? "show" : ""
                                  }`}
                                  aria-labelledby={buttonId}
                                  data-bs-parent="#accordionFlushExample"
                                >
                                  <div className="accordion-body">
                                    <div className="mb-3">{item.answer}</div>
                                    <div className="d-flex justify-content-end">
                                      <Button
                                        newClass={`fs-6`}
                                        
                                        btnIcon={`far fa-edit`}
                                        style={{
                                          borderRadius: "5px",
                                          padding: "5px 15px",
                                          backgroundColor: "#160d98",
                                          color: "#fff",
                                        }}
                                        onClick={() =>
                                          dispatch({
                                            type: OPEN_DIALOGUE,
                                            payload: {
                                              data: item,
                                              type: "FaQ",
                                            },
                                          })
                                        }
                                      />
                                      {dialogue && dialogueType === "FaQ" && (
                                        <FaqDialog />
                                      )}

                                      <Button
                                        newClass={`fs-6 ms-2`}
                                        style={{
                                          borderRadius: "5px",
                                          padding: "5px 15px",
                                          backgroundColor: "#cd2c2c",
                                          color: "#fff",
                                        }}
                                        btnIcon={`bi bi-trash3`}
                                        onClick={() => handleDelete(item._id)}
                                      />
                                    </div>
                                  </div>
                                </div>
                              </div>
                            </div>
                          </>
                        )}
                      </>
                    );
                  })}
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

export default connect(null, { getFaQ, deleteFaQ })(FaQ);
