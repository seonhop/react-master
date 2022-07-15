import { useParams, useLocation } from "react-router-dom";
import styled from "styled-components";
import { useState } from "react";

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

function Coin() {
    const [loading, setLoading] = useState(true);
    const { coinId } = useParams();
    const { state } = useLocation() as RouteState;
    console.log(state?.name);
    return (
        <Container>
            <Header>
                <Title>{state?.name || "Loading"}</Title>
            </Header>
            {loading ? <Loader>Loading...</Loader> : <h1>Coin: {coinId}</h1>}
        </Container>
    );
}

export default Coin;
