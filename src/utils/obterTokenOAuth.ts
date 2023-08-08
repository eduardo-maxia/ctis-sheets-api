import { AxiosInstance } from 'axios';

const GET_ACCESS_TOKEN_PATH = 'oauth/v2/token';

type TInterScopeTypes =
  | 'boleto-cobranca.read'
  | 'boleto-cobranca.write'
  | 'extrato.read'
  | 'pagamento-boleto.read'
  | 'pagamento-boleto.write'
  | 'pagamento-darf.write';

type TInterGrantTypes = 'client_credentials';

export type TClientConfigProps = {
  clientId: string;
  clientSecret: string;
};

export type TObterTokenOAuthSpecificProps = {
  grantType?: TInterGrantTypes;
  scope: TInterScopeTypes | TInterScopeTypes[];
};

type TObterTokenOAuthProps = TClientConfigProps &
  TObterTokenOAuthSpecificProps & {
    axios: AxiosInstance;
  };

export type TObterTokenOAuthResponse = {
  access_token: string;
  token_type: string;
  expires_in: number;
  scope: string;
};

export const obterTokenOAuth = async (props: TObterTokenOAuthProps) => {
  const { axios, clientId, clientSecret, grantType = 'client_credentials', scope } = props;

  if (!clientId || !clientSecret) throw new Error('"clientId" and "clientSecret" as required.');

  const { data } = await axios.postForm<TObterTokenOAuthResponse>(GET_ACCESS_TOKEN_PATH, {
    client_id: props.clientId,
    client_secret: props.clientSecret,
    grant_type: grantType,
    scope: Array.isArray(scope) ? scope.join(' ') : scope,
  });

  return data;
};