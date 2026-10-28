# Garanzie mock — Render + GitHub

Temporary mock of the existing `GET /Garanzie-Anag-MS/desktop/garanzia` integration.

## Data

`garanzie.json` contains **124 records** copied from the supplied HTTP 200 response on 2026-10-28. An interleaved `curl` diagnostic line was removed to restore valid JSON; the response objects themselves were not modified. This is a static snapshot, **not live data**.

**Security warning:** do not publish actual integration data to a public GitHub repository or publicly accessible Render endpoint without authorization. A *private* GitHub repository only protects source code, **not** the Render URL. If the response is restricted, use `MOCK_API_KEY` and configure the Liferay client to send `X-Mock-Api-Key`. If the client cannot send headers, use a non-sensitive synthetic fixture instead or host the mock within a private network. Never enable this mock for production traffic.

## Local verification

```bash
npm start
curl -i http://localhost:10000/health
curl -i http://localhost:10000/Garanzie-Anag-MS/desktop/garanzia
```

## Deployment to Render

1. Create a **private** GitHub repository and push these files.
2. In Render, choose New > Web Service and select the GitHub repository (or use the included `render.yaml` as a Blueprint).
3. Runtime: Node. Build command: `npm install --omit=dev`. Start command: `npm start`.
4. Optionally add the environment variable `MOCK_API_KEY` with a strong random value, and ensure your Liferay integration sends the `X-Mock-Api-Key` request header.
5. Once deployed, use `https://<your-render-service>.onrender.com/Garanzie-Anag-MS/desktop/garanzia` in the **test-only** Liferay integration configuration.

## Endpoint behavior

- `GET /health`: `200` status message, no key needed.
- `GET /Garanzie-Anag-MS/desktop/garanzia`: `200`, JSON array with 124 records. Optional API key check.
- `HEAD` supported; other methods on the Garanzie path return `405`.
- All other paths return `404`.

The original endpoint uses HTTP on port 7003; Render exposes an HTTPS hostname. Update the entire integration base URL, not only the hostname. If there are other endpoints, verbs, query params, authentication rules, or filtering logic, those are **not** simulated here.
