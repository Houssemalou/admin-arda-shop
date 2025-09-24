// productService.ts
import apiClient from "../api/apiClient";
import { ProductDTO, DiscountRequest, StatusRequest, CategoryDiscountRequest } from "../models/types";

// Liste de tous les produits
export const getProducts = async (): Promise<ProductDTO[]> => {
  const res = await apiClient.get<ProductDTO[]>("/products");
  return res.data;
};

// Récupérer un produit par ID
export const getProductById = async (id: number): Promise<ProductDTO> => {
  const res = await apiClient.get<ProductDTO>(`/products/${id}`);
  return res.data;
};

// Créer un produit avec éventuellement une photo
export const createProduct = async (
  product: ProductDTO,
  photo?: File
): Promise<ProductDTO> => {
  console.log(product)
  const formData = new FormData();
  formData.append(
    "product",
    new Blob([JSON.stringify(product)], { type: "application/json" })
  );
  if (photo) formData.append("photo", photo);

  const res = await apiClient.post<ProductDTO>("/products", formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data;
};

// Mettre à jour un produit
export const updateProduct = async (
  id: number,
  product: ProductDTO
): Promise<ProductDTO> => {
  const res = await apiClient.put<ProductDTO>(`/products/${id}`, product);
  return res.data;
};

// Supprimer un produit
export const deleteProduct = async (id: number): Promise<void> => {
  await apiClient.delete(`/products/${id}`);
};



// Mettre à jour le status d'un produit
export const updateStatus = async (
  id: number,
  status: string
): Promise<ProductDTO> => {
  const body: StatusRequest = { status };
  const res = await apiClient.patch<ProductDTO>(`/products/${id}/status`, body);
  return res.data;
};

// Appliquer un discount à toute une catégorie


// URL pour récupérer l'image d'un produit
export const getProductImageUrl = (filename: string): string => {
  return `${process.env.REACT_APP_API_BASE_URL}/products/images/${filename}`;
};
export const applyDiscount = async (
  productId: number,
  discount: number
): Promise<ProductDTO> => {
  const body: DiscountRequest = { discount };
  const res = await apiClient.put<ProductDTO>(`/products/${productId}/discount`, body);
  return res.data;
};

// Appliquer un discount à toute une catégorie
export const applyDiscountToCategory = async (
  categoryName: string,
  discount: number
): Promise<ProductDTO[]> => {
  const body: CategoryDiscountRequest = { categoryName, discount };
  const res = await apiClient.put<ProductDTO[]>(`/categories/discount`, body);
  return res.data;
};

