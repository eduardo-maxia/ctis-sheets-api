import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Security
} from "tsoa";
import { gerarPagamentos, updatePayments, updatePaymentsV2 } from "../utils/googleSheets";

export type ProcessarPagamentosInput = {
  apiKey: string
}
@Route("processar_pagamentos")
export class ProcessarPagamentosController extends Controller {
  /**
   * ## Description:
   * * Endpoint to process all payments from BancoInter's extrato.
   * * The only input needed will be the apiKey for authentication.
   * 
   * Serão processados todos os pagamentos após o último processamento (gerenciado pela last_transaction_id diretamente na planilha).
   * Só serão correspondidos pagamentos realizados no mesmo mês de referência. Pagamentos fora de época 
   * serão registrados na planilha de Não Identificados e devem ser tratados manualmente.
   * A função aceita pagamentos relacionados a uma lista de CPF's. Caso o CPF não seja encontrado, o pagamento será registrado
   * na planilha de Não Identificados.
   *    
   * @param requestBody 
   * @returns 
   * @example
   */
  @SuccessResponse("200", "Created") // Custom success response
  @Security("api_key")
  @Post()
  public async processarExtrato(
    @Body() requestBody: ProcessarPagamentosInput
  ): Promise<void> {
    this.setStatus(200); // set return status 200
    console.log("Start processing...")
    await updatePaymentsV2()
  }
}


export type GerarPagamentosInput = {
  apiKey: string
}
@Route("gerar_pagamentos")
export class GerarPagamentosController extends Controller {
  /**
   * ## Description:
   * * Endpoint to process all payments from CORA's extrato.
   * * The only input needed will be the apiKey for authentication.
   *   
   * @param requestBody 
   * @returns 
   * @example
   */
  @SuccessResponse("200", "Created") // Custom success response
  @Security("api_key")
  @Post()
  public async gerarPagamentos(
    @Body() requestBody: GerarPagamentosInput
  ): Promise<void> {
    this.setStatus(200); // set return status 200
    console.log("Start processing...")
    await gerarPagamentos()
  }
}
