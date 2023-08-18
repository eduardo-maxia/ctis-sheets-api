import { json } from 'express';
import axios, { AxiosInstance } from "axios";
import https from 'https';
import { obterTokenOAuth } from "./obterTokenOAuth";
import { stringify } from 'querystring';

async function getOAuthToken() {
  const certificate = Buffer.from(process.env.INTER_CERTIFICATE!, 'base64').toString('ascii');
  const key = Buffer.from(process.env.INTER_KEY!, 'base64').toString('ascii');

  if (!certificate || !key) throw new Error('Unable to set certificate and key.');

  const clientId = process.env.INTER_CLIENT_ID;
  const clientSecret = process.env.INTER_CLIENT_SECRET;

  var data = stringify({
    'client_id': clientId,
    'client_secret': clientSecret,
    'grant_type': 'client_credentials',
    'scope': 'extrato.read'
  });
  var config = {
    method: 'post',
    url: 'https://cdpj.partners.bancointer.com.br/oauth/v2/token',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    data: data,
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      cert: certificate,
      key: key
    })
  };

  return axios(config).then(r => r.data.access_token)
};

async function getExtrato() {
  const certificate = Buffer.from(process.env.INTER_CERTIFICATE!, 'base64').toString('ascii');
  const key = Buffer.from(process.env.INTER_KEY!, 'base64').toString('ascii');
  const token = await getOAuthToken()
  return axios.get<any>('https://cdpj.partners.bancointer.com.br/banking/v2/extrato/completo', {
    headers: {
      Authorization: `Bearer ${token}`
    },
    params: {
      dataFim: new Date().toISOString().split('T')[0],
      // Data início será hoje menos 30 dias
      dataInicio: new Date(new Date().setDate(new Date().getDate() - 30)).toISOString().split('T')[0],
      tipoTransacao: 'PIX',
      tipoOperacao: 'C',
      tamanhoPagina: 10000
    },
    httpsAgent: new https.Agent({
      rejectUnauthorized: false,
      cert: certificate,
      key: key
    })
  }).then(r => r.data)
}

export async function processPayments(last_processed_tx: string | null) {
  // const payments = exampleData
  const payments = await getExtrato()

  let last_processed_updated = false
  let paymentsToUpdate: { TxId: string, Nome: string, CPF: string, Valor: number, DataPagamento: string }[] = []

  // Iterate over each payment
  for (const payment of payments.transacoes) {
    const { cpfCnpjPagador, nomePagador } = payment.detalhes
    const valor = Number(payment.valor)

    if (last_processed_tx === payment.idTransacao) {
      break
    }

    if (!last_processed_updated) {
      last_processed_tx = payment.idTransacao
      last_processed_updated = true
    }

    // Dispensa o pagamento se não for maior que 90 reais
    if (valor < 90) {
      continue
    }

    paymentsToUpdate.push({ TxId: payment.idTransacao, Nome: nomePagador, CPF: cpfCnpjPagador, Valor: valor, DataPagamento: payment.dataTransacao })
  }

  return { paymentsToUpdate, last_processed_tx }
}