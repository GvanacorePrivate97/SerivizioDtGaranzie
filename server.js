"use strict";
const http = require("node:http");
const fs = require("node:fs");
const path = require("node:path");

const PORT = Number(process.env.PORT || 10000);
const BASE_PATH = "/Garanzie-Anag-MS/desktop";
const API_PATH = `${BASE_PATH}/garanzia`;
const RIEPILOGO_PATH = `${BASE_PATH}/riepilogo`;
const API_KEY = process.env.MOCK_API_KEY || "";
const json = fs.readFileSync(path.join(__dirname, "garanzie.json"));
const riepilogoJson = fs.readFileSync(path.join(__dirname, "riepilogo.json"));

const server = http.createServer((req, res) => {
  const pathname = new URL(req.url, "http://localhost").pathname;
  const respond = (status, body, contentType = "application/json; charset=utf-8") => {
    res.writeHead(status, {
      "Content-Type": contentType,
      "Cache-Control": "no-store",
      "X-Mock-Service": "garanzie",
    });
    res.end(req.method === "HEAD" ? undefined : body);
  };

  if (pathname === "/health" && (req.method === "GET" || req.method === "HEAD")) {
    return respond(200, '{"status":"UP","service":"garanzie-mock"}');
  }
  if (pathname !== API_PATH && pathname !== RIEPILOGO_PATH) return respond(404, '{"error":"Not Found"}');
  if (req.method !== "GET" && req.method !== "HEAD") {
    res.setHeader("Allow", "GET, HEAD");
    return respond(405, '{"error":"Method Not Allowed"}');
  }
  // Optional protection: when set, Liferay must send X-Mock-Api-Key.
  if (API_KEY && req.headers["x-mock-api-key"] !== API_KEY) {
    return respond(401, '{"error":"Unauthorized"}');
  }
  const responseJson = pathname === RIEPILOGO_PATH ? riepilogoJson : json;
  res.writeHead(200, {
    "Content-Type": "application/json; charset=utf-8",
    "Cache-Control": "no-store",
    "X-Mock-Service": "garanzie",
    "Content-Length": responseJson.length,
  });
  res.end(req.method === "HEAD" ? undefined : responseJson);
});

server.listen(PORT, "0.0.0.0", () => console.log(`Garanzie mock listening on port ${PORT}`));
