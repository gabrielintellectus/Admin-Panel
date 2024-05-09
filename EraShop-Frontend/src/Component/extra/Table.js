import React, { useState } from "react";

function Table(props) {
  const { data, mapData, Page, PerPage, type, handleShorting } = props;

  const [sortColumn, setSortColumn] = useState("");
  const [sortOrder, setSortOrder] = useState("asc");

  const handleColumnClick = (column) => {
    if (sortColumn === column) {
      setSortOrder(sortOrder === "asc" ? "desc" : "asc");
    } else {
      setSortColumn(column);
      setSortOrder("asc");
    }
  };

  const sortedData =
    data?.length > 0 &&
    data?.sort((a, b) => {
      const valueA = a[sortColumn];
      const valueB = b[sortColumn];

      if (valueA < valueB) {
        return sortOrder === "asc" ? -1 : 1;
      }
      if (valueA > valueB) {
        return sortOrder === "asc" ? 1 : -1;
      }
      return 0;
    });

  return (
    <>
      <div className="primeMain">
        <table
          width="100%"
          border
          className="primeTable text-center"
          style={{ maxHeight: "600px" }}
        >
          <thead className="sticky-top" style={{ top: "-1px", zIndex: "1" }}>
            <tr>
              {mapData.map((res) => {
                return (
                  <th className="fw-bold py-3">
                    {`${" "}${res.Header}`}
                    {res?.sorting && (
                      <i
                        class="fa-solid fa-sort deg90 ms-1"
                        onClick={() => handleColumnClick(res.body)}
                        style={{ cursor: "pointer" }}
                      ></i>
                    )}
                  </th>
                );
              })}
            </tr>
          </thead>

          {/* server side pagination with table */}
          {type == "server" && (
            <>
              <tbody>
                {sortedData.length > 0 ? (
                  <>
                    {(PerPage > 0
                      ? sortedData.slice(
                          Page * PerPage,
                          Page * PerPage + PerPage
                        )
                      : sortedData
                    ).map((i, k) => {
                      return (
                        <>
                          <tr>
                            {mapData?.map((res) => {
                              const splits = res.body?.split(".");

                              return (
                                <td>
                                  {res?.Cell ? (
                                    <res.Cell row={i} index={k} />
                                  ) : (
                                    <span className={res.className}>
                                      {splits?.length > 1
                                        ? i[splits[0]][splits[1]] ||
                                          i[splits[0]][splits[1]] >= 0
                                          ? i[splits[0]][splits[1]]
                                          : "-"
                                        : i[res.body] || i[res?.body] >= 0
                                        ? i[res?.body]
                                        : "-"}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <tr>
                    <td colSpan="25" className="text-center">
                      No Data Found !
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}

          {/* client side pagination with table */}

          {type == "client" && (
            <>
              <tbody>
                {sortedData.length > 0 ? (
                  <>
                    {(PerPage > 0
                      ? sortedData.slice(
                          Page * PerPage,
                          Page * PerPage + PerPage
                        )
                      : sortedData
                    ).map((i, k) => {
                      return (
                        <>
                          <tr>
                            {mapData?.map((res) => {
                              const splits = res.body?.split(".");
                              return (
                                <td>
                                  {res.Cell ? (
                                    <res.Cell row={i} index={k} />
                                  ) : (
                                    <span>
                                      {splits.length > 1
                                        ? i[splits[0]][splits[1]] ||
                                          i[splits[0]][splits[1]] >= 0
                                          ? i[splits[0]][splits[1]]
                                          : "-"
                                        : i[res.body] || i[res.body] >= 0
                                        ? i[res.body]
                                        : "-"}
                                    </span>
                                  )}
                                </td>
                              );
                            })}
                          </tr>
                        </>
                      );
                    })}
                  </>
                ) : (
                  <tr>
                    <td colSpan="25" className="text-center">
                      No Data Found !
                    </td>
                  </tr>
                )}
              </tbody>
            </>
          )}
        </table>
      </div>
    </>
  );
}

export default Table;
