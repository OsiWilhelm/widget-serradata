import React, { useEffect, useState } from "react";
import { convertFromRaw } from "draft-js";
import { convertToHTML } from "draft-convert";

import HtmlReactParser from "html-react-parser";

import { Container } from "./styles";

export const Content = ({ element }) => {
  const [componente, setComponente] = useState();

  useEffect(() => {
    setComponente(element);
  }, []);

  return <Container>{HtmlReactParser(componente || "")}</Container>;
};

export default Content;
