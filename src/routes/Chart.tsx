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
                        theme: { mode: "dark" },
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
                            labels: {
                                show: false,
                                datetimeFormatter: { month: "mmm 'yy" },
                            },
                            categories: historicalData?.map(
                                (price) => price.time_close
                            ),
                        },
                        stroke: { curve: "smooth", width: 3 },
                        fill: {
                            type: "gradient",
                            gradient: {
                                gradientToColors: ["#0be881"],
                                stops: [0, 100],
                            },
                        },
                        colors: ["#0fbcf9"],
                        tooltip: {
                            y: {
                                formatter: (value) => `$${value.toFixed(2)}`,
                            },
                        },
                    }}
                />
            )}{" "}
        </div>
    );
}

export default Chart;
