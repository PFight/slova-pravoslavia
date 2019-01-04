import styled from 'styled-components';

export const Panel = styled.div`
    height: 100%;
    overflow-y: auto;
  `;

export const WorshipNodeStyle = styled.div`
    border-radius: 6px;
    background-color: rgb(247, 239, 205);
    &:hover {
      background-color: rgb(249, 235, 177);
    }
    &:focus {
      border: 1px dashed blue;
    }
    border: 1px solid transparent;
    margin: 2px 3px;
    padding: 5px;
    cursor: pointer;
    ${(props: {selected:boolean}) => props.selected ? "background-color: rgb(248, 236, 187)" : ""}
  `;

export const Speaker = styled.span`
    font-weight: bold;
    color: red;
    display: inline-block;
    padding-right: 4px;
  `;

export const  NodeComment = styled.span`
    font-style: italic;
  `;
