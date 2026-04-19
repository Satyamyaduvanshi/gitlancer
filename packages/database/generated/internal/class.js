"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPrismaClientClass = getPrismaClientClass;
const runtime = require("@prisma/client/runtime/client");
const config = {
    "previewFeatures": [],
    "clientVersion": "7.7.0",
    "engineVersion": "75cbdc1eb7150937890ad5465d861175c6624711",
    "activeProvider": "postgresql",
    "inlineSchema": "generator client {\n  provider     = \"prisma-client\"\n  // Change output to just ../generated to simplify imports\n  output       = \"../generated\"\n  // IMPORTANT: Set this for NestJS compatibility\n  moduleFormat = \"cjs\"\n}\n\ndatasource db {\n  provider = \"postgresql\"\n}\n\nmodel User {\n  id            String         @id @default(uuid())\n  githubHandle  String         @unique\n  solanaWallet  String         @unique\n  contributions Contribution[]\n}\n\nmodel Contribution {\n  id     String @id @default(uuid())\n  prId   String @unique\n  amount Float\n  status String @default(\"PENDING\")\n  userId String\n  user   User   @relation(fields: [userId], references: [id])\n}\n",
    "runtimeDataModel": {
        "models": {},
        "enums": {},
        "types": {}
    },
    "parameterizationSchema": {
        "strings": [],
        "graph": ""
    }
};
config.runtimeDataModel = JSON.parse("{\"models\":{\"User\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"githubHandle\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"solanaWallet\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"contributions\",\"kind\":\"object\",\"type\":\"Contribution\",\"relationName\":\"ContributionToUser\"}],\"dbName\":null},\"Contribution\":{\"fields\":[{\"name\":\"id\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"prId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"amount\",\"kind\":\"scalar\",\"type\":\"Float\"},{\"name\":\"status\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"userId\",\"kind\":\"scalar\",\"type\":\"String\"},{\"name\":\"user\",\"kind\":\"object\",\"type\":\"User\",\"relationName\":\"ContributionToUser\"}],\"dbName\":null}},\"enums\":{},\"types\":{}}");
config.parameterizationSchema = {
    strings: JSON.parse("[\"where\",\"orderBy\",\"cursor\",\"user\",\"contributions\",\"_count\",\"User.findUnique\",\"User.findUniqueOrThrow\",\"User.findFirst\",\"User.findFirstOrThrow\",\"User.findMany\",\"data\",\"User.createOne\",\"User.createMany\",\"User.createManyAndReturn\",\"User.updateOne\",\"User.updateMany\",\"User.updateManyAndReturn\",\"create\",\"update\",\"User.upsertOne\",\"User.deleteOne\",\"User.deleteMany\",\"having\",\"_min\",\"_max\",\"User.groupBy\",\"User.aggregate\",\"Contribution.findUnique\",\"Contribution.findUniqueOrThrow\",\"Contribution.findFirst\",\"Contribution.findFirstOrThrow\",\"Contribution.findMany\",\"Contribution.createOne\",\"Contribution.createMany\",\"Contribution.createManyAndReturn\",\"Contribution.updateOne\",\"Contribution.updateMany\",\"Contribution.updateManyAndReturn\",\"Contribution.upsertOne\",\"Contribution.deleteOne\",\"Contribution.deleteMany\",\"_avg\",\"_sum\",\"Contribution.groupBy\",\"Contribution.aggregate\",\"AND\",\"OR\",\"NOT\",\"id\",\"prId\",\"amount\",\"status\",\"userId\",\"equals\",\"in\",\"notIn\",\"lt\",\"lte\",\"gt\",\"gte\",\"not\",\"contains\",\"startsWith\",\"endsWith\",\"githubHandle\",\"solanaWallet\",\"every\",\"some\",\"none\",\"is\",\"isNot\",\"connectOrCreate\",\"upsert\",\"createMany\",\"set\",\"disconnect\",\"delete\",\"connect\",\"updateMany\",\"deleteMany\",\"increment\",\"decrement\",\"multiply\",\"divide\"]"),
    graph: "ZRQgBwQAAEAAIC4AAD4AMC8AAAkAEDAAAD4AMDEBAAAAAUEBAAAAAUIBAAAAAQEAAAABACAJAwAAQwAgLgAAQQAwLwAAAwAQMAAAQQAwMQEAPwAhMgEAPwAhMwgAQgAhNAEAPwAhNQEAPwAhAQMAAF8AIAkDAABDACAuAABBADAvAAADABAwAABBADAxAQAAAAEyAQAAAAEzCABCACE0AQA_ACE1AQA_ACEDAAAAAwAgAQAABAAwAgAABQAgAQAAAAMAIAEAAAABACAHBAAAQAAgLgAAPgAwLwAACQAQMAAAPgAwMQEAPwAhQQEAPwAhQgEAPwAhAQQAAF4AIAMAAAAJACABAAAKADACAAABACADAAAACQAgAQAACgAwAgAAAQAgAwAAAAkAIAEAAAoAMAIAAAEAIAQEAABdACAxAQAAAAFBAQAAAAFCAQAAAAEBCwAADgAgAzEBAAAAAUEBAAAAAUIBAAAAAQELAAAQADABCwAAEAAwBAQAAFAAIDEBAEkAIUEBAEkAIUIBAEkAIQIAAAABACALAAATACADMQEASQAhQQEASQAhQgEASQAhAgAAAAkAIAsAABUAIAIAAAAJACALAAAVACADAAAAAQAgEgAADgAgEwAAEwAgAQAAAAEAIAEAAAAJACADBQAATQAgGAAATwAgGQAATgAgBi4AAD0AMC8AABwAEDAAAD0AMDEBADYAIUEBADYAIUIBADYAIQMAAAAJACABAAAbADAXAAAcACADAAAACQAgAQAACgAwAgAAAQAgAQAAAAUAIAEAAAAFACADAAAAAwAgAQAABAAwAgAABQAgAwAAAAMAIAEAAAQAMAIAAAUAIAMAAAADACABAAAEADACAAAFACAGAwAATAAgMQEAAAABMgEAAAABMwgAAAABNAEAAAABNQEAAAABAQsAACQAIAUxAQAAAAEyAQAAAAEzCAAAAAE0AQAAAAE1AQAAAAEBCwAAJgAwAQsAACYAMAYDAABLACAxAQBJACEyAQBJACEzCABKACE0AQBJACE1AQBJACECAAAABQAgCwAAKQAgBTEBAEkAITIBAEkAITMIAEoAITQBAEkAITUBAEkAIQIAAAADACALAAArACACAAAAAwAgCwAAKwAgAwAAAAUAIBIAACQAIBMAACkAIAEAAAAFACABAAAAAwAgBQUAAEQAIBgAAEcAIBkAAEYAICoAAEUAICsAAEgAIAguAAA1ADAvAAAyABAwAAA1ADAxAQA2ACEyAQA2ACEzCAA3ACE0AQA2ACE1AQA2ACEDAAAAAwAgAQAAMQAwFwAAMgAgAwAAAAMAIAEAAAQAMAIAAAUAIAguAAA1ADAvAAAyABAwAAA1ADAxAQA2ACEyAQA2ACEzCAA3ACE0AQA2ACE1AQA2ACEOBQAAOQAgGAAAPAAgGQAAPAAgNgEAAAABNwEAAAAEOAEAAAAEOQEAAAABOgEAAAABOwEAAAABPAEAAAABPQEAOwAhPgEAAAABPwEAAAABQAEAAAABDQUAADkAIBgAADoAIBkAADoAICoAADoAICsAADoAIDYIAAAAATcIAAAABDgIAAAABDkIAAAAAToIAAAAATsIAAAAATwIAAAAAT0IADgAIQ0FAAA5ACAYAAA6ACAZAAA6ACAqAAA6ACArAAA6ACA2CAAAAAE3CAAAAAQ4CAAAAAQ5CAAAAAE6CAAAAAE7CAAAAAE8CAAAAAE9CAA4ACEINgIAAAABNwIAAAAEOAIAAAAEOQIAAAABOgIAAAABOwIAAAABPAIAAAABPQIAOQAhCDYIAAAAATcIAAAABDgIAAAABDkIAAAAAToIAAAAATsIAAAAATwIAAAAAT0IADoAIQ4FAAA5ACAYAAA8ACAZAAA8ACA2AQAAAAE3AQAAAAQ4AQAAAAQ5AQAAAAE6AQAAAAE7AQAAAAE8AQAAAAE9AQA7ACE-AQAAAAE_AQAAAAFAAQAAAAELNgEAAAABNwEAAAAEOAEAAAAEOQEAAAABOgEAAAABOwEAAAABPAEAAAABPQEAPAAhPgEAAAABPwEAAAABQAEAAAABBi4AAD0AMC8AABwAEDAAAD0AMDEBADYAIUEBADYAIUIBADYAIQcEAABAACAuAAA-ADAvAAAJABAwAAA-ADAxAQA_ACFBAQA_ACFCAQA_ACELNgEAAAABNwEAAAAEOAEAAAAEOQEAAAABOgEAAAABOwEAAAABPAEAAAABPQEAPAAhPgEAAAABPwEAAAABQAEAAAABA0MAAAMAIEQAAAMAIEUAAAMAIAkDAABDACAuAABBADAvAAADABAwAABBADAxAQA_ACEyAQA_ACEzCABCACE0AQA_ACE1AQA_ACEINggAAAABNwgAAAAEOAgAAAAEOQgAAAABOggAAAABOwgAAAABPAgAAAABPQgAOgAhCQQAAEAAIC4AAD4AMC8AAAkAEDAAAD4AMDEBAD8AIUEBAD8AIUIBAD8AIUYAAAkAIEcAAAkAIAAAAAAAAUsBAAAAAQVLCAAAAAFRCAAAAAFSCAAAAAFTCAAAAAFUCAAAAAEFEgAAYQAgEwAAZAAgSAAAYgAgSQAAYwAgTgAAAQAgAxIAAGEAIEgAAGIAIE4AAAEAIAAAAAsSAABRADATAABWADBIAABSADBJAABTADBKAABUACBLAABVADBMAABVADBNAABVADBOAABVADBPAABXADBQAABYADAEMQEAAAABMgEAAAABMwgAAAABNAEAAAABAgAAAAUAIBIAAFwAIAMAAAAFACASAABcACATAABbACABCwAAYAAwCQMAAEMAIC4AAEEAMC8AAAMAEDAAAEEAMDEBAAAAATIBAAAAATMIAEIAITQBAD8AITUBAD8AIQIAAAAFACALAABbACACAAAAWQAgCwAAWgAgCC4AAFgAMC8AAFkAEDAAAFgAMDEBAD8AITIBAD8AITMIAEIAITQBAD8AITUBAD8AIQguAABYADAvAABZABAwAABYADAxAQA_ACEyAQA_ACEzCABCACE0AQA_ACE1AQA_ACEEMQEASQAhMgEASQAhMwgASgAhNAEASQAhBDEBAEkAITIBAEkAITMIAEoAITQBAEkAIQQxAQAAAAEyAQAAAAEzCAAAAAE0AQAAAAEEEgAAUQAwSAAAUgAwSgAAVAAgTgAAVQAwAAEEAABeACAEMQEAAAABMgEAAAABMwgAAAABNAEAAAABAzEBAAAAAUEBAAAAAUIBAAAAAQIAAAABACASAABhACADAAAACQAgEgAAYQAgEwAAZQAgBQAAAAkAIAsAAGUAIDEBAEkAIUEBAEkAIUIBAEkAIQMxAQBJACFBAQBJACFCAQBJACECBAYCBQADAQMAAQEEBwAAAAADBQAIGAAJGQAKAAAAAwUACBgACRkACgEDAAEBAwABBQUADxgAEhkAEyoAECsAEQAAAAAABQUADxgAEhkAEyoAECsAEQYCAQcIAQgLAQkMAQoNAQwPAQ0RBA4SBQ8UARAWBBEXBhQYARUZARYaBBodBxseCxwfAh0gAh4hAh8iAiAjAiElAiInBCMoDCQqAiUsBCYtDScuAigvAikwBCwzDi00FA"
};
async function decodeBase64AsWasm(wasmBase64) {
    const { Buffer } = await Promise.resolve().then(() => require('node:buffer'));
    const wasmArray = Buffer.from(wasmBase64, 'base64');
    return new WebAssembly.Module(wasmArray);
}
config.compilerWasm = {
    getRuntime: async () => await Promise.resolve().then(() => require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.js")),
    getQueryCompilerWasmModule: async () => {
        const { wasm } = await Promise.resolve().then(() => require("@prisma/client/runtime/query_compiler_fast_bg.postgresql.wasm-base64.js"));
        return await decodeBase64AsWasm(wasm);
    },
    importName: "./query_compiler_fast_bg.js"
};
function getPrismaClientClass() {
    return runtime.getPrismaClient(config);
}
//# sourceMappingURL=class.js.map