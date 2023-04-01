import {PrismaClient} from '@prisma/client';

export const db = new PrismaClient();

export const dbInit = async () => {
    await db.$connect();
}

