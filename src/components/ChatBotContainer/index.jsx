import React, { useEffect, useState } from "react";
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Link } from "@mui/material";
import ChatBot from "../ChatBot";
import ListaOpcoes from "../ListaOpcoes";
import axios from "axios";
import Content from "../Content";

export default function ChatBotContainer({ domElement }) {
  const [intencoes, setIntencoes] = useState([]);
  const [idIntencaoInicial, setIdIntencaoinicial] = useState(1);
  let steps = [];

  useEffect(() => {
    const baseURL = domElement.dataset.apiUrl;

    axios.get(baseURL + "/config").then((res) => {
      const config = JSON.parse(res.data.config);
      setIdIntencaoinicial(config.idPerguntaInicialChatbot);
    });
    
    axios.get(baseURL+ "/intencoes").then((res) => {
      setIntencoes(res.data);
    });
  }, []);

  const criarFluxo = (intencaoId = 1) => {
    let intencao = [];
    let opcoes = { Null: { options: [] } };

    if (intencoes.length > 0) {
      intencao = intencoes.filter((i) => i.id === intencaoId);

      steps.push({
        id: intencaoId,
        message: intencao[0].titulo,
        trigger: `${intencaoId}-opcoesMsg`,
      });

      steps.push({
        id: `${intencaoId}-opcoesMsg`,
        component: <ListaOpcoes opcoes={intencao[0].opcoes} />,
        trigger: `${intencaoId}-opcoes`,
      });

      if (intencao[0].opcoes) {
        intencao[0].opcoes.forEach((opcao, i) => {
          if (opcao.proximaIntencao != null) {
            opcoes.hasOwnProperty(opcao.proximaIntencao.id)
              ? opcoes[opcao.proximaIntencao.id].options.push(opcao.descricao)
              : (opcoes[opcao.proximaIntencao.id] = {
                  options: [opcao.descricao],
                });

            if (
              steps.filter((i) => i.id === opcao.proximaIntencao.id).length ===
              0
            ) {
              criarFluxo(opcao.proximaIntencao.id);
            }
          } else {
            steps.push({
              id: `solucao${intencaoId}-${i + 1}`,
              component: (
                <Content element={opcao?.solucao?.conteudo}/>
              ),
              end: true,
            });
          }
        });
      }

      steps.push({
        id: `${intencaoId}-opcoes`,
        user: true,
        validator: (value) => {
          const options = [...intencao[0].opcoes];

          return (!isNaN(value) &&
            parseInt(value) > 0 &&
            parseInt(value) <= options.length) ||
            (isNaN(value) &&
              options.some(
                (opcao) => opcao.descricao.toLowerCase() === value.toLowerCase()
              ))
            ? true
            : "Resposta inválida!";
        },
        trigger: ({ value }) => {
          const options = [...intencao[0].opcoes];
          let op;

          isNaN(value)
            ? (op = options.find(
                (opcao) => opcao.descricao.toLowerCase() === value.toLowerCase()
              ))
            : (op = options[value - 1]);

          return op.proximaIntencao
            ? op.proximaIntencao.id
            : `solucao${intencaoId}-${options.indexOf(op) + 1}`;
        },
      });
    }
  };

  const criarChatBot = () => {
    criarFluxo(idIntencaoInicial);

    return (
      <ChatBot
        headerTitle="SerraData"
        floating
        placeholder="Digite aqui..."
        botAvatar="https://raw.githubusercontent.com/juniorcost4/widget-serradata/main/src/img/bot-avatar.png"
        steps={steps}
        floatingStyle={{
          background: "linear-gradient(45deg,  #03a7f8, #87CEEB)",
        }}
        submitButtonStyle={{ color: "#000000" }}
      />
    );
  };

  return <>{intencoes.length > 0 ? criarChatBot() : null}</>;
}
