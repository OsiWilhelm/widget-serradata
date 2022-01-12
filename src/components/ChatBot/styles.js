import styled from "styled-components";
import ChatBot from "react-simple-chatbot";

export const Container = styled(ChatBot)`
  .rsc-header {
    background: linear-gradient(45deg, #03a7f8, #87ceeb);
  }

  .rsc-header-title {
    font-size: 20px;
  }

  .rsc-ts-bot .rsc-ts-bubble  {
    background: #3198CC;
    color: #fff;
    font-weight: bold;
  }

  .rsc-ts-user .rsc-ts-bubble {
    background: gray;
    color: #fff;
    font-weight: bold;
  }
`;
