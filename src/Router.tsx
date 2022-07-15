import { BrowserRouter, Routes, Route, Outlet } from "react-router-dom";
import Coins from "./routes/Coins";
import Coin from "./routes/Coin";
import Chart from "./routes/Chart";
import Price from "./routes/Price";

function Router() {
    return (
        <BrowserRouter>
            <Routes>
                <Route path="/:coinId" element={<Coin />}>
                    <Route path="chart" element={<Chart />} />
                    <Route path="price" element={<Price />} />
                </Route>

                <Route path="/" element={<Coins />} />
            </Routes>
        </BrowserRouter>
    );
}

export default Router;
