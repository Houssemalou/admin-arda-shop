// orderService.ts
import apiClient from "../api/apiClient";
import { OrderDTO, StatusRequest} from "../models/types";

interface PageableResponse<T> {
  content: T[];
  totalPages: number;
  totalElements: number;
  size: number;
  number: number;
}

// Récupérer la liste des commandes avec pagination
export const getOrders = async (
  page = 0,
  size = 10,
  sort = "id,desc" // tri décroissant => dernier order en premier
): Promise<PageableResponse<OrderDTO>> => {
  const response = await apiClient.get<PageableResponse<OrderDTO>>(
    `/orders?page=${page}&size=${size}&sort=${sort}`
  );
  return response.data;
};


// Récupérer une commande par ID
export const getOrder = async (id: string): Promise<OrderDTO> => {
  const response = await apiClient.get<OrderDTO>(`/orders/${id}`);
  return response.data;
};

// Créer une commande
export const createOrder = async (order: OrderDTO): Promise<OrderDTO> => {
  const response = await apiClient.post<OrderDTO>("/orders", order);
  return response.data;
};

// Mettre à jour le status d'une commande
export const updateStatus = async (
  id: string,
  statusReq: StatusRequest
): Promise<OrderDTO> => {
  const response = await apiClient.patch<OrderDTO>(`/orders/${id}/status`, statusReq);
  return response.data;
};

// Supprimer une commande
export const deleteOrder = async (id: string): Promise<void> => {
  await apiClient.delete(`/orders/${id}`);
};
