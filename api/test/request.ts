import * as request from "request";

interface Response {
    res: request.RequestResponse,
    body: any,
    json: any,
};

const url = (path: string) => `http://localhost:8080${path}`;
const makeRequest = (method: string, path: string, options?: request.CoreOptions): Promise<Response> => (
    new Promise((resolve, reject) => {
        request[method](url(path), options, (err, res, body) => {
            if (err) {
                return reject(err);
            }

            let json;
            try {
                json = JSON.parse(body);
            } catch (e) {
                json = {};
            }

            resolve({ res, body, json });
        });
    })
);

export const GET = (path: string, options?: request.CoreOptions) => makeRequest("get", path, options);
export const PUT = (path: string, options?: request.CoreOptions) => makeRequest("put", path, options);
export const POST = (path: string, options?: request.CoreOptions) => makeRequest("post", path, options);
export const DELETE = (path: string, options?: request.CoreOptions) => makeRequest("delete", path, options);