import React, { useEffect, useState } from 'react';
import { convertFromRaw } from 'draft-js';
import { convertToHTML } from 'draft-convert';

import HtmlReactParser from 'html-react-parser';

import { Container } from './styles';

export const Content = ({ element }) => {
    const [componente, setComponente] = useState();


    useEffect(() => {
        const elementHTML = HtmlReactParser(convertToHTML(convertFromRaw(JSON.parse(element))));

        setComponente(elementHTML);
    }, []);

    return <Container>{componente}</Container>
} 

export default Content;