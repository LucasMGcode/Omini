import { useState } from "react";
import { Link, useLocation } from "react-router-dom";
import { Search, User, Package, Home, FileText, PackageOpen, CircleUserIcon} from "lucide-react";

const Header = () => {
  const location = useLocation();
  const [searchQuery, setSearchQuery] = useState("");
  
  const isActive = (path: string) => {
    return location.pathname === path ? "text-purple-600 font-semibold bg-purple-100 rounded-lg px-3 py-2" : "text-gray-600 hover:text-purple-600 hover:bg-purple-50 rounded-lg px-3 py-2 transition-all duration-300";
  };

  return (
    <header className="bg-gradient-to-r from-white to-purple-50 shadow-lg border-b border-purple-100">
      <div className="container mx-auto px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <Link to="/dashboard" className="flex items-center space-x-3">
              <img 
                src="/logo_omini.png" 
                alt="Omini Solutions" 
                className="h-30 w-auto"
              />
            </Link>
          </div>
          
          {location.pathname !== "/" && (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="/dashboard" className={`flex items-center space-x-2 ${isActive("/dashboard")} font-montserrat`}>
                <Home className="h-4 w-4" />
                <span>Dashboard</span>
              </Link>
              <Link to="/product-registration" className={`flex items-center space-x-2 ${isActive("/product-registration")} font-montserrat`}>
                <Package className="h-4 w-4" />
                <span>Cadastro de Produto</span>
              </Link>
              <Link to="/withdraw-product" className={`flex items-center space-x-2 ${isActive("/withdraw-product")} font-montserrat`}>
                <PackageOpen className="h-4 w-4" />
                <span>Retirada de Produto</span>
              </Link>
              <Link to="/reports" className={`flex items-center space-x-2 ${isActive("/reports")} font-montserrat`}>
                <FileText className="h-4 w-4" />
                <span>Relatórios</span>
              </Link>
              <Link to="/users" className={`flex items-center space-x-2 ${isActive("/users")} font-montserrat`}>
                <User className="h-4 w-4" />
                <span>Usuários</span>
              </Link>
            </div>
          )}
          
          {location.pathname !== "/" && (
            <div className="hidden md:flex items-center space-x-2">
              <Link to="" className={`flex items-center space-x-2 ${isActive("")} font-montserrat`}>
                <CircleUserIcon className="h-7 w-7" />
                <span>Perfil</span>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
