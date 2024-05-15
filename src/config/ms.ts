import { MicroserviceOptions, Transport } from "@nestjs/microservices";
import { envs } from "./envs";

export const msConfig: MicroserviceOptions = {
    transport: Transport.TCP,
    options: {
      port: envs.port,
    }
}