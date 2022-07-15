import { useOutletContext } from "react-router";
import { fetchCoinHistory } from "../api";
import { useQuery } from "react-query";

interface ChartProps {
    coinId: string;
}

function Chart() {
    const { coinId } = useOutletContext<ChartProps>();
    const { isLoading, data } = useQuery(["ohlcv", coinId], () =>
        fetchCoinHistory(coinId)
    );
    console.log(data);
    return <h1>Chart</h1>;
}

export default Chart;
