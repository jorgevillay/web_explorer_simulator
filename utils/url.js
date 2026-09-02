export function validateUrlSyntax(rawUrl) {
  if (!rawUrl || rawUrl.startsWith("http://") || rawUrl.startsWith("https://"))
    return false;

  const q = rawUrl.indexOf("?");
  const pathPart = q >= 0 ? rawUrl.slice(0, q) : rawUrl;
  const queryPart = q >= 0 ? rawUrl.slice(q + 1) : null;

  if (
    pathPart.includes("?") ||
    pathPart.includes("&") ||
    pathPart.includes("=")
  )
    return false;

  const segments = pathPart.split("/");
  if (segments.length < 2 || segments.some((s) => !s)) return false;
  if (!/^[a-zA-Z0-9.-]+\.gov$/.test(segments[0])) return false;
  if (segments.slice(1).some((s) => !/^[a-zA-Z0-9_-]+$/.test(s))) return false;

  if (queryPart !== null) {
    if (!queryPart || queryPart.includes("?")) return false;

    const pairs = queryPart.split("&");
    if (pairs.some((p) => !p)) return false;

    for (const pair of pairs) {
      const i = pair.indexOf("=");
      if (i <= 0 || pair.indexOf("=", i + 1) !== -1) return false;

      const name = pair.slice(0, i);
      const value = pair.slice(i + 1);

      if (!/^[a-zA-Z0-9_-]+$/.test(name) || !value) return false;
    }
  }

  return true;
}

export function parseUrl(rawUrl) {
  const [pathPart, queryPart = ""] = rawUrl.split("?");
  const [domain, ...routeParts] = pathPart.split("/");
  const params = {};

  if (queryPart) {
    for (const pair of queryPart.split("&")) {
      const i = pair.indexOf("=");
      params[pair.slice(0, i)] = pair.slice(i + 1);
    }
  }

  return { domain, path: routeParts.join("/"), params };
}

export function normalizeUrl(rawUrl) {
  const parsed = parseUrl(rawUrl);
  const normalizedParams = Object.entries(parsed.params)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([k, v]) => `${k}=${v}`)
    .join("&");

  return `${parsed.domain}/${parsed.path}${normalizedParams ? `?${normalizedParams}` : ""}`;
}

export function getEndpointDefinition(parsed, endpointDefinitions) {
  const endpoint = endpointDefinitions[parsed.path];
  if (!endpoint) return null;

  const missing = endpoint.requiredParams.some(
    (key) => !(key in parsed.params),
  );

  if (missing) {
    throw new Error("Faltan parámetros requeridos para ejecutar la solicitud");
  }

  return endpoint;
}
