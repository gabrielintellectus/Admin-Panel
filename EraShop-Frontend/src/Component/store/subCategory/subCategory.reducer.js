import { key } from "../../util/config";
import { SetDevKey, setToken } from "../../util/setAuth";
import * as ActionType from "./subCategory.type";
import jwt_decode from "jwt-decode";

const initialState = {
  subCategory: [],
  categoryWiseSubCategory: [],
};

export const subCategoryReducer = (state = initialState, action) => {
  switch (action.type) {
    case ActionType.GET_SUB_CATEGORY:
      return {
        ...state,
        subCategory: action.payload,
      };
    case ActionType.GET_CATEGORY_WISE_SUBCATEGORY:
      return {
        ...state,
        categoryWiseSubCategory: action.payload,
      };
    case ActionType.CREATE_SUB_CATEGORY:
      const transformedData = {
        subCategoryId: action.payload._id,
        name: action.payload.name,
        image: action.payload.image,
        category: action.payload.category.name,
        categoryId: action.payload.category._id,
        sameSubcategoryProductCount: 0,
      };

      return {
        ...state,
        categoryWiseSubCategory: [
          ...state.categoryWiseSubCategory,
          transformedData,
        ],
      };
    case ActionType.UPDATE_SUB_CATEGORY:
      const transformedData2 = {
        subCategoryId: action.payload.data._id,
        name: action.payload.data.name,
        image: action.payload.data.image,
        category: action.payload.data.category.name,
        categoryId: action.payload.data.category._id,
        sameSubcategoryProductCount: 0,
      };

      return {
        ...state,
        categoryWiseSubCategory: state.categoryWiseSubCategory.map((data) =>
          data.subCategoryId === action.payload.id ? transformedData2 : data
        ),
      };
    case ActionType.DELETE_SUB_CATEGORY:
      return {
        ...state,
        categoryWiseSubCategory: state.categoryWiseSubCategory.filter(
          (data) => data.subCategoryId !== action.payload && data
        ),
      };
    default:
      return state;
  }
};
