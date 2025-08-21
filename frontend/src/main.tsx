import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import { BrowserRouter, Route, Routes } from "react-router";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

import { Layout } from "./components/layout/Layout";

import {
    Analytics,
    BrandAdd,
    Dashboard,
    ModelAdd,
    VehicleAdd,
    Vehicles,
} from "./pages";

const queryClient = new QueryClient();

createRoot(document.getElementById("root")!).render(
    <StrictMode>
        <QueryClientProvider client={queryClient}>
            <BrowserRouter>
                <Routes>
                    <Route element={<Layout />}>
                        <Route path="/" element={<App />} />
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/vehicles" element={<Vehicles />} />
                        <Route path="/vehicles/add" element={<VehicleAdd />} />
                        <Route path="/brand/add" element={<BrandAdd />} />
                        <Route path="/model/add" element={<ModelAdd />} />
                        <Route path="/analytics" element={<Analytics />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </QueryClientProvider>
    </StrictMode>
);
