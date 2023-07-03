import axios, {AxiosInstance, AxiosRequestConfig} from "axios";
import {Container, Inject, Service} from "typedi";
import {deserialize, serialize} from "typescript-json-serializer";
import {Logger} from "../../logging/Logger";
import {Result} from "../Result";

export const AXIOS_DI = "Axios";
export type Axios = AxiosInstance;
Container.set(AXIOS_DI, axios.create());

@Service()
export class ApiService {
    private logger: Logger;
    public constructor(@Inject(AXIOS_DI) private axiosInstance: Axios) {
        this.logger = new Logger(ApiService);
    }

    public async get<Output>(url: string, type?: new () => Output): Promise<Result<Output>> {
        return this.getWithConfig<Output>(url, {}, type);
    }

    public async getWithConfig<Output>(
        url: string,
        config: AxiosRequestConfig,
        type?: new () => Output,
    ): Promise<Result<Output>> {
        try {
            this.logRequest("GET", url, {});
            const response = await this.axiosInstance.get(url, config);
            this.logResponse("GET", url, response.data);
            const data: Output = type ? deserialize(response.data, type) : response.data;
            return Result.Success(data);
        } catch (error) {
            if (error instanceof Error) {
                this.logError("GET", url, error);
                return Result.Exception(error);
            }
            throw error;
        }
    }

    public async post<Input, Output>(url: string, data: Input, output?: new () => Output): Promise<Result<Output>> {
        return this.postWithApiKey<Input, Output>(url, data, {}, output);
    }

    public async postWithApiKey<Input, Output>(
        url: string,
        data: Input,
        config: AxiosRequestConfig,
        output?: new () => Output,
    ): Promise<Result<Output>> {
        try {
            const jsonData = serialize(data);
            this.logRequest("POST", url, jsonData);
            const response = await this.axiosInstance.post(url, jsonData, config);
            this.logResponse("POST", url, response.data);
            const responseData = output ? deserialize(response.data, output) : response.data;
            return Result.Success(responseData);
        } catch (error) {
            if (error instanceof Error) {
                this.logError("POST", url, error);
                return Result.Exception(error);
            }
            throw error;
        }
    }

    public async postRawArray<Input, Output>(
        url: string,
        data: Input,
        config: AxiosRequestConfig = {},
    ): Promise<Result<Output[]>> {
        try {
            const jsonData = serialize(data);
            this.logRequest("POST", url, jsonData);
            const response = await this.axiosInstance.post(url, jsonData, config);
            this.logResponse("POST", url, response.data);
            const responseData: Output[] = response.data as unknown[] as Output[];
            return Result.Success(responseData);
        } catch (error) {
            if (error instanceof Error) {
                this.logError("POST", url, error);
                return Result.Exception(error);
            }
            throw error;
        }
    }

    public async postNoResponse<Input>(url: string, data: Input): Promise<Result<string>> {
        return this.postNoResponseWithApiKey<Input>(url, data, {});
    }
    public async postNoResponseWithApiKey<Input>(
        url: string,
        data: Input,
        config: AxiosRequestConfig,
    ): Promise<Result<string>> {
        try {
            const jsonData = serialize(data);
            this.logRequest("POST", url, jsonData);
            const response = await this.axiosInstance.post(url, jsonData, config);
            this.logResponse("POST", url, response.data);
            return Result.Success("success");
        } catch (error) {
            if (error instanceof Error) {
                this.logError("POST", url, error);
                return Result.Exception(error);
            }
            throw error;
        }
    }

    private logRequest<Data>(method: string, url: string, data: Data): void {
        this.logger.info(url, `${method} request  with data`, {data: JSON.stringify(data)});
    }

    private logResponse<Data>(method: string, url: string, data: Data): void {
        this.logger.info(url, `${method} response with data`, {data: JSON.stringify(data)});
    }

    private logError(method: string, url: string, error: Error): void {
        this.logger.error(url, `${method} error `, error);
    }
}
