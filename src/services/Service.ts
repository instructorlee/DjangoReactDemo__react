import { config } from '../config';

export default class Service {
    protected appName: string = "";


    protected _get<T>(path: string): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            fetch(`${config.API_URL}/${this.appName}/${path}`)
                .then((response: Response) => {
                    resolve(response.json());
                })
                .catch( err => reject(err))
        })
    }

    protected _post<T>(path: string, content: any, headers: {} = {} ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            fetch(`${this.appName}/${path}`, {
                method: 'POST',
                headers: {
                    ...headers,
                    ... {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }
                },
                body: JSON.stringify(content)
            })
                .then((response: Response) => resolve(response.json()))
                .catch( err => reject(err))
        })
    }

    protected _patch<T>(path: string, content: any, headers: {} = {} ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            fetch(`${this.appName}/${path}`, {
                method: 'PATCH',
                headers: {
                    ...headers,
                    ... {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }
                },
                body: JSON.stringify(content)
            })
                .then((response: Response) => resolve(response.json()))
                .catch( err => reject(err))
        })
    }

    protected _delete<T>(path: string, headers: {} = {} ): Promise<T> {
        return new Promise<T>((resolve, reject) => {
            fetch(`${this.appName}/${path}`, {
                method: 'DELETE',
                headers: {
                    ...headers,
                    ... {
                      'Accept': 'application/json',
                      'Content-Type': 'application/json'
                    }
                }
            })
                .then((response: Response) => resolve(response.json()))
                .catch( err => reject(err))
        })
    }

    public create<T>(model: T): Promise<T> {
        return this._post<T>('/', model);
    }

    public read<T>(modelId?: number): Promise<T> {
        if (modelId) { // request specific entity
            return this._get<T>(`${modelId}`);
        } else { // request all entities
            return this._get<T>(``);
        }
    }

    public update<T>(data: any, modelId: number): Promise<T> {
        return this._patch<T>(`/${modelId}`, data);
    }

    public delete<T>(modelId: number): Promise<T> {
        return this._delete<T>(`/${modelId}`);
    }
}