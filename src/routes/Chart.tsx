import { useOutletContext } from "react-router";

interface ChartProps {
    coinId: string;
}

function Chart() {
    const { coinId } = useOutletContext<ChartProps>();
    console.log(coinId);
    return <h1>Chart</h1>;
}

export default Chart;
