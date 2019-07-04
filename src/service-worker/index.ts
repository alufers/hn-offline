import "./cachingUtils";
import { registerFrontendRequestHandler } from "./communicationApi";

registerFrontendRequestHandler(async () => {
  console.log("RECIEVED MESSAGE");
  return "HELLO";
});
