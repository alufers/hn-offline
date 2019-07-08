import "./cachingUtils";
import { registerFrontendRequestHandler } from "./communicationApi";
import makeRequestHandler from "./makeRequestHandler";
import AppSyncManager from "./AppSyncManager";

const asm = new AppSyncManager();

asm.init();

registerFrontendRequestHandler(makeRequestHandler(asm));
