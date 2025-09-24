// src/services/authService.ts
import axios from "axios";
import { AuthenticationRequest, AuthenticationResponse, RegistrationRequest } from "@/models/types";

const API_BASE_URL = "http://localhost:8082/api/webStore/auth";
                      

export const authService = {
  // Login / Authenticate
  login: async (data: AuthenticationRequest): Promise<AuthenticationResponse> => {
    try {
      const response = await axios.post<AuthenticationResponse>(
        `${API_BASE_URL}/authenticate`,
        data,
        { headers: { "Content-Type": "application/json" } }
      );

      if (response.data?.token) {
        // Sauvegarder le token JWT dans le localStorage
        localStorage.setItem("token", response.data.token);
      }

      return response.data;
    } catch (error) {
      // Vous pouvez gérer les erreurs ici
      if (error.response?.status === 403 || error.response?.status === 401) {
        throw new Error("Email ou mot de passe incorrect");
      }
      throw error;
    }
  },

  // Register
  register: async (data: RegistrationRequest) => {
    return axios.post(`${API_BASE_URL}/register`, data, {
      headers: { "Content-Type": "application/json" },
    });
  },

  // Logout
  logout: () => {
    localStorage.removeItem("token");
  },

  // Récupérer le token
  getToken: (): string | null => {
    return localStorage.getItem("token");
  },
};
