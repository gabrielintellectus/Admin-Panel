import { useState } from "react";
import Button from "./Button";

const Searching = (props) => {
  const [search, setSearch] = useState("");

  const {
    data,
    setData,
    type,
    serverSearching,
    button,
    setSearchValue,
    searchValue,
  } = props;

  const handleSearch = (event) => {
    event.preventDefault();

    let searchValue = search ? search : event?.target?.value?.toLowerCase();
    const getLowerCaseSearch = searchValue?.toLowerCase();
    if (getLowerCaseSearch !== undefined) {
      if (type === "client") {
        if (getLowerCaseSearch) {
          const filteredData = data.filter((item) => {
            return Object.keys(item).some((key) => {
              if (key === "_id" || key === "updatedAt" || key === "createdAt") {
                return false;
              }
              const itemValue = item[key];
              if (typeof itemValue === "string") {
                return itemValue.toLowerCase().indexOf(getLowerCaseSearch) > -1;
              } else if (typeof itemValue === "number") {
                return itemValue.toString().indexOf(getLowerCaseSearch) > -1;
              }
              return false;
            });
          });
          setData(filteredData);
        } else {
          setData(data);
        }
      } else {
        serverSearching(searchValue);
      }
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      handleSearch(e);
    }
  };

  return (
    <>
      <div className="col-6 mx-2 " style={{ float: "right" }}>
        <div className="input-group  ">
          <input
            type="name"
            autoComplete="false"
            defaultValue={searchValue}
            placeholder="Searching for..."
            aria-describedby="button-addon4"
            className="form-control bg-none border  searchBar py-2"
            style={{ borderRadius: "30px 0px 0px 30px" }}
            onChange={(e) => {
              const inputValue = e.target.value;
              if (!inputValue) {
                handleSearch(e);
                setSearchValue("");
              }
              setSearch(inputValue);
            }}
            onKeyPress={handleKeyPress}
          />

          <Button
            type="button"
            btnIcon={`fa fa-search`}
            newClass={`my-auto  text-white text-center cursor-pointer float-right z-1 `}
            style={{
              height: "45px",
              width: "60px",
              borderRadius: "0px 30px 30px 0px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              backgroundColor: "#b93160",
            }}
            onClick={(e) => handleSearch(e)}
          />
        </div>
      </div>
    </>
  );
};

export default Searching;
