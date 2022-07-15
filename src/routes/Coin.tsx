import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useEffect, useState } from "react";
import { IInfoData } from "../defs/IInfoData";
import { IPriceData } from "../defs/IPriceData";

interface RouteParams {
    coinId: string;
}

const Container = styled.div`
    padding: 0px 20px;
    max-width: 480px;
    margin: 0 auto;
`;

const Header = styled.header`
    height: 10vh;
    display: flex;
    justify-content: center;
    align-items: center;
`;

const Title = styled.h1`
    font-size: 48px;
    color: ${(props) => props.theme.accentColor};
`;

const Loader = styled.span`
    text-align: center;
    display: block;
`;

interface RouteState {
    state: {
        name: string;
    };
}

interface PriceData {}

function Coin() {
    const [loading, setLoading] = useState(true);
    const { coinId } = useParams();
    const { state } = useLocation() as RouteState;
    const [info, setInfo] = useState<IInfoData>({});
    const [priceInfo, setPriceInfo] = useState<IPriceData>({});
    useEffect(() => {
        (async () => {
            const infoData = await (
                await fetch(`https://api.coinpaprika.com/v1/coins/${coinId}`)
            ).json();
            const priceData = await (
                await fetch(`https://api.coinpaprika.com/v1/tickers/${coinId}`)
            ).json();
            console.log(infoData);
            console.log(priceData);
            setInfo(infoData);
            setPriceInfo(priceData);
        })();
    }, []);
    return (
        <Container>
            <Header>
                <Title>{state?.name || "Loading"}</Title>
            </Header>
            {loading ? <Loader>Loading...</Loader> : null}
        </Container>
    );
}

export default Coin;
