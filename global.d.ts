// global.d.ts
import { Db } from "mongodb";

declare global {
  var mongoCache: {
    conn: Db | null;
    promise: Promise<Db> | null;
  };

}

export {};