// categoryService.ts
import apiClient from "../api/apiClient";
import { CategoryReqDTO, CategoryResDTO } from "../models/types";

// Liste toutes les catégories
export const getCategories = async (): Promise<CategoryResDTO[]> => {
  const res = await apiClient.get<CategoryResDTO[]>("/categories");
  return res.data;
};

// Récupérer une catégorie par ID
export const getCategoryById = async (id: number): Promise<CategoryResDTO> => {
  const res = await apiClient.get<CategoryResDTO>(`/categories/${id}`);
  return res.data;
};

// Créer une nouvelle catégorie
export const createCategory = async (category: CategoryReqDTO): Promise<CategoryResDTO> => {
  const res = await apiClient.post<CategoryResDTO>("/categories", category);
  return res.data;
};

// Mettre à jour une catégorie existante
export const updateCategory = async (
  id: number,
  category: CategoryReqDTO
): Promise<CategoryResDTO> => {
  const res = await apiClient.put<CategoryResDTO>(`/categories/${id}`, category);
  return res.data;
};

// Supprimer une catégorie
export const deleteCategory = async (id: number): Promise<void> => {
  await apiClient.delete(`/categories/${id}`);
};
