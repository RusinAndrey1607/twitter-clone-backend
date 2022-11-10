import { Sequelize } from "sequelize";
import { config } from "dotenv";
config();

const connectionString =
  process.env.DATABASE_URL ||
  "postgresql://postgres:root@localhost:5432/node_postgress";

export const sequelize = new Sequelize(connectionString);

export const dbConnect = async () => {
  try {
    await sequelize.authenticate({ logging: false });
    await sequelize.sync({ alter: true });

    console.log("Connect to database");
  } catch (error: any) {
    await sequelize.close();
    console.log(error);
    throw new Error(error || "");
  }
};
