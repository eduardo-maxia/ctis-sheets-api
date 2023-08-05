const exampleData = {
  "totalPaginas": 1,
  "totalElementos": 0,
  "ultimaPagina": true,
  "primeiraPagina": true,
  "tamanhoPagina": 20,
  "numeroDeElementos": 1,
  "transacoes": [
    {
      "idTransacao": "qwdiojhasidasidjaisbdhasvdghvasdvsad",
      "dataInclusao": "2023-08-05",
      "dataTransacao": "2023-08-05",
      "tipoTransacao": "string",
      "tipoOperacao": "string",
      "valor": "130",
      "titulo": "string",
      "descricao": "string",
      "detalhes": {
        "pix": {
          "txId": "Rv1pt4pjd2jtjdzx5nafhtjks7",
          "nomePagador": "Eduardo dos Anjos Rodrigues",
          "descricaoPix": "Pagamento do aluguel",
          "cpfCnpjPagador": "**2822014**",
          "contaBancariaRecebedor": "17687786",
          "nomeEmpresaPagador": "Banco Inter",
          "tipoDetalhe": "COMPLETE",
          "endToEndId": "E00416968202206201436ghzKRVgnb7A",
          "chavePixRecebedor": "+5531985443142",
          "nomeEmpresaRecebedor": "CAIXA ECONOMICA FEDEREAL",
          "nomeRecebedor": "Nome Recebedor",
          "agenciaRecebedor": "0089",
          "cpfCnpjRecebedor": "04993960654",
          "origemMovimentacao": "CHAVE",
          "devolucoes": [
            {
              "data": "string",
              "horario": "string",
              "id": "string",
              "valorRetornado": "string",
              "descricao": "string"
            }
          ]
        }
      }
    },
    {
      "idTransacao": "iurtisasd",
      "dataInclusao": "2023-08-05",
      "dataTransacao": "2023-08-05",
      "tipoTransacao": "string",
      "tipoOperacao": "string",
      "valor": "260",
      "titulo": "string",
      "descricao": "string",
      "detalhes": {
        "pix": {
          "txId": "Rv1pt4pjd2jtjdzx5nafhtjks7",
          "nomePagador": "Eduardo dos Anjos Rodrigues",
          "descricaoPix": "Pagamento do aluguel",
          "cpfCnpjPagador": "**2822014**",
          "contaBancariaRecebedor": "17687786",
          "nomeEmpresaPagador": "Banco Inter",
          "tipoDetalhe": "COMPLETE",
          "endToEndId": "E00416968202206201436ghzKRVgnb7A",
          "chavePixRecebedor": "+5531985443142",
          "nomeEmpresaRecebedor": "CAIXA ECONOMICA FEDEREAL",
          "nomeRecebedor": "Nome Recebedor",
          "agenciaRecebedor": "0089",
          "cpfCnpjRecebedor": "04993960654",
          "origemMovimentacao": "CHAVE",
          "devolucoes": [
            {
              "data": "string",
              "horario": "string",
              "id": "string",
              "valorRetornado": "string",
              "descricao": "string"
            }
          ]
        }
      }
    },
    {
      "idTransacao": "asdsdasdaseewqewq",
      "dataInclusao": "2023-08-05",
      "dataTransacao": "2023-08-05",
      "tipoTransacao": "string",
      "tipoOperacao": "string",
      "valor": "130",
      "titulo": "string",
      "descricao": "string",
      "detalhes": {
        "pix": {
          "txId": "Rv1pt4pjd2jtjdzx5nafhtjks7",
          "nomePagador": "Thiago Luiz",
          "descricaoPix": "Pagamento do aluguel",
          "cpfCnpjPagador": "**.4654.454-**",
          "contaBancariaRecebedor": "17687786",
          "nomeEmpresaPagador": "Banco Inter",
          "tipoDetalhe": "COMPLETE",
          "endToEndId": "E00416968202206201436ghzKRVgnb7A",
          "chavePixRecebedor": "+5531985443142",
          "nomeEmpresaRecebedor": "CAIXA ECONOMICA FEDEREAL",
          "nomeRecebedor": "Nome Recebedor",
          "agenciaRecebedor": "0089",
          "cpfCnpjRecebedor": "04993960654",
          "origemMovimentacao": "CHAVE",
          "devolucoes": [
            {
              "data": "string",
              "horario": "string",
              "id": "string",
              "valorRetornado": "string",
              "descricao": "string"
            }
          ]
        }
      }
    }
  ]
}

export async function processPayments(last_processed_tx: string | null) {
  const payments = exampleData
  let last_processed_updated = false
  let paymentsToUpdate: { transaction_id: string, nome: string, cpf: string, valor: number, dataPagamento: string }[] = []

  // Iterate over each payment
  for (const payment of payments.transacoes) {
    const { cpfCnpjPagador, nomePagador } = payment.detalhes.pix
    const valor = Number(payment.valor)

    if (last_processed_tx === payment.idTransacao) {
      break
    }

    if (!last_processed_updated) {
      last_processed_tx = payment.idTransacao
      last_processed_updated = true
    }

    // Dispensa o pagamento se não for múltiplo do valor da mensalidade
    if (valor % 130 !== 0) {
      continue
    }

    paymentsToUpdate.push({ transaction_id: payment.idTransacao, nome: nomePagador, cpf: cpfCnpjPagador, valor, dataPagamento: payment.dataTransacao })
  }

  return { paymentsToUpdate, last_processed_tx }
}