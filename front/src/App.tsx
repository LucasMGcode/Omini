import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
// Make sure the file exists as './pages/Index.tsx' or update the import to the correct file name.
// For example, if the file is named 'Home.tsx', use:
import Index from "./pages/Index";
import Dashboard from "./pages/Dashboard.tsx";
import Users from "./pages/Users.tsx";
import UserRegistration from "./pages/UserRegistration.tsx";
import ProductRegistration from "./pages/ProductRegistration";
import WithdrawProduct from "./pages/WithdrawProduct.tsx";
import Supplier from "./pages/Supplier.tsx";
import Supplier_registration from "./pages/Supplier_registration.tsx";
import Reports from "./pages/Reports.tsx";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/users" element={<Users />} />
          <Route path="/user-registration" element={<UserRegistration />} />
          <Route path="/product-registration" element={<ProductRegistration />} />
          <Route path="/withdraw-product" element={<WithdrawProduct />} />
          <Route path="/supplier" element={<Supplier />} />
          <Route path="/supplier-registration" element={<Supplier_registration />} />
          <Route path="/reports" element={<Reports />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;