import "./cachingUtils";
import { registerFrontendRequestHandler } from "./communicationApi";
import makeRequestHandler from "./makeRequestHandler";

registerFrontendRequestHandler(makeRequestHandler());
