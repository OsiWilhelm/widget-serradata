import React from "react";

export default function ChatBotContainer({ opcoes }) {
  return (
    <div>
      {opcoes.map((opcao, i) => (
        <div>{`${i + 1}) ${opcao.descricao}`}</div>
      ))}
    </div>
  );
}
