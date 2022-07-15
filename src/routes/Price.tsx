import { useOutletContext } from "react-router";
import { fetchCoinHistory, fetchCoinTickers } from "../api";
import { useQuery } from "react-query";
import ApexChart from "react-apexcharts";
import { Helmet } from "react-helmet-async";
import { IPriceData } from "../defs/IPriceData";
import styled from "styled-components";

interface PriceProps {
    coinId: string;
}

const StyledPrice = styled.span`
    display: block;
    text-align: center;
    color: ${(props) => props.theme.accentColor};
    font-size: 50px;
`;

function Price() {
    const { coinId } = useOutletContext<PriceProps>();
    const { isLoading, data: priceData } = useQuery<IPriceData>(
        ["price", coinId],
        () => fetchCoinTickers(coinId)
    );
    const coinPrice = priceData?.quotes?.USD?.price;
    return <StyledPrice>${coinPrice?.toFixed(4)}</StyledPrice>;
}

export default Price;
