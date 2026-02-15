import { api } from "@/lib/api";
import {
  Category,
  CreateCategoryPayload,
  GetCategoriesParams,
  PaginatedResponse,
} from "@/types/category";
import { ApiResponse } from "@/types/users";

// Category API Functions

export const createCategory = async (payload: CreateCategoryPayload) => {
  const { data } = await api.post<ApiResponse<Category>>(
    "/categories",
    payload, // this payload will be converted to json and sent to the server req.body
  );
  return data;
};

export const getAllCategories = async (
  params?: GetCategoriesParams,
): Promise<ApiResponse<PaginatedResponse<Category>>> => {
  const { data } = await api.get<ApiResponse<PaginatedResponse<Category>>>(
    "/categories",
    { params }, // when we put curl barces in the params it will convert it to query params ?page=1&limit=10&search=work
  );
  return data;
};

export const getCategoryById = async (
  id: string,
): Promise<ApiResponse<Category>> => {
  const { data } = await api.get<ApiResponse<Category>>(`/categories/${id}`);
  return data;
};

export const updateCategory = async (
  id: string,
  payload: CreateCategoryPayload,
): Promise<ApiResponse<Category>> => {
  const { data } = await api.put<ApiResponse<Category>>(
    `/categories/${id}`,
    payload,
  );
  return data;
};


export const deleteCategory = async (
  id: string
): Promise<ApiResponse<Category>> => {
  const { data } = await api.delete<ApiResponse<Category>>(`/categories/${id}`);
  return data;
};