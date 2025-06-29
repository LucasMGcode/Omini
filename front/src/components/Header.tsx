import { Link, useLocation } from "react-router-dom";
import {
  User,
  Package,
  Home,
  FileText,
  PackageOpen,
  CircleUserIcon,
  Truck,
} from "lucide-react";

const Header = () => {
  const location = useLocation();

  const isActive = (path: string) => {
    return location.pathname === path
      ? "bg-purple-100 text-purple-700 font-semibold shadow-sm"
      : "text-gray-600 hover:text-purple-600 hover:bg-purple-50";
  };

  return (
    <header className="bg-white/80 backdrop-blur-md border-b border-purple-100 shadow-md">
      <div className="container mx-auto px-6 py-3">
        <div className="flex items-center justify-between">
          {/* LOGO */}
          <div className="flex items-center space-x-4">
            <Link to="/dashboard" className="flex items-center">
              <img
                src="/logo_omini.png"
                alt="Omini Solutions"
                className="h-16 w-auto drop-shadow-sm"
              />
            </Link>
          </div>

          {location.pathname !== "/" && (
            <nav className="hidden md:flex items-center space-x-3 font-montserrat">
              <Link
                to="/dashboard"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${isActive(
                  "/dashboard"
                )}`}
              >
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link
                to="/product-registration"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${isActive(
                  "/product-registration"
                )}`}
              >
                <Package className="h-4 w-4" />
                <span>Cadastro de Produto</span>
              </Link>
              <Link
                to="/withdraw-product"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${isActive(
                  "/withdraw-product"
                )}`}
              >
                <PackageOpen className="h-4 w-4" />
                <span>Retirada de Produto</span>
              </Link>
              <Link
                to="/supplier"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${isActive(
                  "/supplier"
                )}`}
              >
                <Truck className="h-4 w-4" />
                <span>Fornecedores</span>
              </Link>
              <Link
                to="/reports"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${isActive(
                  "/reports"
                )}`}
              >
                <FileText className="h-4 w-4" />
                <span>Relatórios</span>
              </Link>
              <Link
                to="/users"
                className={`flex items-center space-x-2 px-4 py-2 rounded-full transition-all duration-200 ${isActive(
                  "/users"
                )}`}
              >
                <User className="h-4 w-4" />
                <span>Usuários</span>
              </Link>
            </nav>
          )}

          {location.pathname !== "/" && (
            <div className="hidden md:flex items-center space-x-2">
              <Link
                to=""
                className="flex items-center space-x-2 px-4 py-2 rounded-full hover:bg-purple-50 transition-all duration-200 text-gray-700 hover:text-purple-600"
              >
                <CircleUserIcon className="h-6 w-6" />
                <span className="text-sm font-medium font-montserrat">Perfil</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
