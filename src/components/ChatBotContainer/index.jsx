import React, { useEffect, useState } from "react";
import { OpenInNew } from "@mui/icons-material";
import { Link } from "@mui/material";
import ChatBoot from "../ChatBoot";
import axios from "axios";

const baseURL = "http://serradata.herokuapp.com/intencoes/";

export default function ChatBotContainer() {
  const [intencoes, setIntencoes] = useState([]);
  let steps = [];

  useEffect(() => {
    axios.get(baseURL).then((res) => {
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
        message: () => {
          let opcoesMsg = "";

          intencao[0].opcoes.map(
            (opcao, i) => (opcoesMsg += `\n${i + 1}) ${opcao.descricao}\n`)
          );
          return `${opcoesMsg}`;
        },
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
                <div>
                  {" "}
                  Clique aqui:{" "}
                  <Link href={opcao.solucao.href}>
                    <OpenInNew />
                  </Link>
                </div>
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
    criarFluxo();

    return (
      <ChatBoot
        headerTitle="SerraData"
        floating
        placeholder="Digite aqui..."
        botAvatar="https://preview.redd.it/788khtqa7c551.png?width=960&crop=smart&auto=webp&s=a1f107f8f7af82ff61c2b9db3a511f7f81d3715c"
        steps={steps}
      />
    );
  };

  return <>{intencoes.length > 0 ? criarChatBot() : null}</>;
}
