import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Security
} from "tsoa";
import { gerarPagamentos, updatePayments } from "../utils/googleSheets";

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
    await updatePayments()
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
