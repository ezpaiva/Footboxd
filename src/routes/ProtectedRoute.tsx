import { Navigate, useLocation } from "react-router-dom";
import { getUsuarioLogado } from "../services/authService";
import type { JSX } from "react";

export default function ProtectedRoute({ children }: { children: JSX.Element }) {
  const usuario = getUsuarioLogado();
  const location = useLocation();

  if (!usuario) {
    return (
      <Navigate
        to="/login"
        replace
        state={{ from: location.pathname }}
      />
    );
  }

  return children;
}
