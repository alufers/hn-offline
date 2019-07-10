import AppSyncManager from "./AppSyncManager";
import "./cachingUtils";
import { registerFrontendRequestHandler } from "./communicationApi";
import makeRequestHandler from "./makeRequestHandler";

const asm = new AppSyncManager();

asm.init();

registerFrontendRequestHandler(makeRequestHandler(asm));
