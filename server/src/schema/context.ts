import { PrismaClient } from "@prisma/client";
import { db } from "../db/index.js";

export interface IContext extends Record<PropertyKey, any> {
    prisma: PrismaClient
};
// 굳이 이렇게 안해도 될 것 같은데, Context의 상위 타입이 Record<PropertyKey, ~>
// 형식을 원해서 굳이 Record을 상속하도록 구성함

export const context: IContext = {
    prisma: db
};