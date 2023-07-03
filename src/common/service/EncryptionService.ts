import Cryptr from "cryptr";
import {Container, Inject, Service} from "typedi";
import {Config} from "../../config/Config";

export const ENCRYPTION_CLIENT = "ENCRYPTION_CLIENT";
export type EncryptionClient = Cryptr;
Container.set(ENCRYPTION_CLIENT, new Cryptr(Config.encryptionSecretKey));

@Service()
export class EncryptionService {
    constructor(@Inject(ENCRYPTION_CLIENT) private encryptionClient: EncryptionClient) {}

    encrypt(value: string): string {
        return this.encryptionClient.encrypt(value);
    }

    decrypt(value: string): string {
        return this.encryptionClient.decrypt(value);
    }
}
