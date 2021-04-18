import styled from 'styled-components';
import { darken, lighten } from 'polished';

export const Container = styled.div`
  padding: 30px;
  background: #fff;
  border-radius: 4px;

  footer {
    margin-top: 30px;
    display: flex;
    justify-content: space-between;
    align-items: center;

    button {
      background: #7159c1;
      color: #fff;
      border: 0;
      border-radius: 4px;
      padding: 12px 20px;
      font-weight: bold;
      text-transform: uppercase;
      transition: background 0.2s;

      &:hover {
        background: ${darken(0.06, '#7159c1')};
      }
    }
  }

  @media (max-width: 650px) {
    max-width: 430px;
    margin: 0 auto;

    footer {
      flex-direction: column-reverse;

      button {
        width: 100%;
        margin-top: 1rem;
      }
    }
  }
`;

export const ProductTable = styled.table`
  width: 100%;

  thead th {
    color: #999;
    text-align: left;
    padding: 12px;
  }

  tbody td {
    padding: 12px;
    border-bottom: 1px solid #eee;
  }

  img {
    height: 100px;
  }

  strong {
    color: #333;
    display: block;
  }

  span {
    display: block;
    margin-top: 5px;
    font-size: 18px;
    font-weight: bold;
  }

  div {
    display: flex;
    align-items: center;

    input {
      border: 1px solid #ddd;
      border-radius: 4px;
      color: #666;
      padding: 6px;
      width: 50px;
    }
  }

  button {
    background: none;
    border: 0;
    padding: 6px;

    svg {
      color: #7159c1;
      transition: color 0.2s;
    }

    &:hover {
      svg {
        color: ${darken(0.06, '#7159c1')};
      }
    }

    &:disabled {
      svg {
        color: ${lighten(0.25, '#7159c1')};
        cursor: not-allowed;
      }
    }
  }

  @media (max-width: 650px) {
    thead th {
      display: none;
    }

    tbody tr {
      display: grid;
      grid-template-columns: 1fr 1fr;
      grid-template-rows: 1fr 4rem 4rem;
      gap: 0px 0px;
      grid-template-areas:
        "image description"
        "add subtotal"
        "delete delete";

      & + tr {
        margin-top: 2rem;
      }

      td {
        border: none;

        display: flex;
        align-items: center;
        justify-content: center;
      }

      td:nth-child(1) {
        grid-area: image;
      }

      td:nth-child(2) {
        grid-area: description;
        flex-direction: column;
        align-items: flex-start;
      }

      td:nth-child(3) {
        grid-area: add;
      }

      td:nth-child(4) {
        grid-area: subtotal;
        
        
      }

      td:nth-child(5) {
        grid-area: delete;
        width: 100%;

        border-bottom: 1px solid #eee;
      }
    }
  }
`;

export const Total = styled.div`
  display: flex;
  align-items: baseline;

  span {
    color: #999;
    font-weight: bold;
  }

  strong {
    font-size: 28px;
    margin-left: 5px;
  }

  @media (max-width: 650px) {
    flex-direction: column;
    margin-left: auto;
  }
`;
