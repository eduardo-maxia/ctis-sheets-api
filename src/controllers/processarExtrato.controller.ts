import {
  Body,
  Controller,
  Post,
  Route,
  SuccessResponse,
  Security
} from "tsoa";
import { basicUpdates } from "../utils/googleSheets";

export type ProcessarExtratoInput = {
  apiKey: string
}
@Route("processar_extrato")
export class ProcessarExtratoController extends Controller {
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
  public async processarExtrato(
    @Body() requestBody: ProcessarExtratoInput
  ): Promise<void> {
    this.setStatus(200); // set return status 200
    console.log("Start processing...")
    await basicUpdates()
  }
}
