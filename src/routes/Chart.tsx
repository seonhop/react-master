import { useOutletContext } from "react-router";
import { fetchCoinHistory } from "../api";
import { useQuery } from "react-query";
import ApexChart from "react-apexcharts";

interface ChartProps {
    coinId: string;
}

interface IHistoricalData {
    time_open: number;
    time_close: number;
    open: string;
    high: string;
    low: string;
    close: string;
    volume: string;
    market_cap: number;
}

function Chart() {
    const { coinId } = useOutletContext<ChartProps>();
    const { isLoading, data: historicalData } = useQuery<IHistoricalData[]>(
        ["ohlcv", coinId],
        () => fetchCoinHistory(coinId)
    );
    return (
        <div>
            {isLoading ? (
                "Loading chart..."
            ) : (
                <ApexChart
                    type="line"
                    series={[
                        {
                            name: "Price",
                            data: historicalData?.map((price) =>
                                Number(price.close)
                            ) as number[],
                        },
                    ]}
                    options={{
                        chart: {
                            height: 300,
                            width: 500,
                            toolbar: {
                                show: false,
                            },
                            background: "transparent",
                        },
                        grid: {
                            show: false,
                        },
                        yaxis: {
                            show: false,
                        },
                        xaxis: {
                            axisBorder: { show: false },
                            axisTicks: { show: false },
                            labels: { show: false },
                        },
                        stroke: { curve: "smooth", width: 3 },
                    }}
                />
            )}{" "}
        </div>
    );
}

export default Chart;
