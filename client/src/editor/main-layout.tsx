import styled from "styled-components";

const headerSize = "45px";

export const HeaderContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: 0;
  height: ${headerSize};
  padding-bottom: 5px;
  box-sizing: border-box;
`

export const BodyContainer = styled.div`
  position: fixed;
  left: 0;
  right: 0;
  top: ${headerSize};
  bottom: 0;
`