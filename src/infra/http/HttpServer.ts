//framework and driver

import express from "express";

export default interface HttpServer {
    register(method: string, route: string, handler: Function): void;
    listen(port: number): void;
}

export class ExpressAdapter implements HttpServer {
    private app: any;

    constructor() {
        this.app = express();
        this.app.use(express.json());
    }

    register(method: string, route: string, handler: Function): void {
        this.app[method](route, async (req: any, res: any) => {
            try {
                const output = await handler(req);
                res.json(output);
            } catch (error: any) {
                res.status(422).json({ message: error.message });
            }
        });
    }

    listen(port: number): void {
        this.app.listen(port);
        console.log(`Server is running at http://localhost:${port} `);
    }
}