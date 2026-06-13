import express, { type Express, Request, Response, NextFunction } from "express";
import cors from "cors";
import pinoHttp from "pino-http";
import router from "./routes";
import { logger } from "./lib/logger";

const app: Express = express();

// pinoHttp কল করার সময় req এবং res-এর টাইপ ফিক্স করা হলো
app.use(
  pinoHttp({
    logger,
    serializers: {
      req(req: any) {
        return {
          id: req.id,
          method: req.method,
          url: req.url?.split("?")[0],
        };
      },
      res(res: any) {
        return {
          statusCode: res.statusCode,
        };
      },
    },
  })
);

app.use(cors());
app.use(express.json());

// মূল রাউটার যুক্ত করা
app.use(router);

// গ্লোবাল এরর হ্যান্ডলার (এখানেও টাইপ ডিফাইন করা হলো)
app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  const statusCode = err.statusCode || 500;
  const message = err.message || "Internal Server Error";
  
  logger.error({ err, reqId: (req as any).id }, message);
  
  res.status(statusCode).json({
    error: message,
  });
});

export default app;
