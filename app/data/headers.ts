const HEADERS = [
  // General
  'Accept',
  'Accept-Encoding',
  'Accept-Language',
  'Cache-Control',
  'Connection',
  'Content-Length',
  'Content-Type',
  'Cookie',
  'Date',
  'Host',
  'Origin',
  'Pragma',
  'Referer',
  'TE',
  'Trailer',
  'Transfer-Encoding',
  'Upgrade',
  'User-Agent',
  'Via',
  'Warning',

  // Conditional
  'If-Match',
  'If-Modified-Since',
  'If-None-Match',
  'If-Range',
  'If-Unmodified-Since',
  'Range',

  // CORS
  'Access-Control-Request-Method',
  'Access-Control-Request-Headers',

  // Security / Auth
  'Authorization',
  'Proxy-Authorization',
  'X-CSRF-Token',
  'X-Requested-With',

  // Client hints
  'Sec-CH-UA',
  'Sec-CH-UA-Platform',
  'Sec-CH-UA-Mobile',
  'Sec-Fetch-Dest',
  'Sec-Fetch-Mode',
  'Sec-Fetch-Site',
  'Sec-Fetch-User',
  'Sec-GPC',

  // Custom / Common non-standard
  'X-Forwarded-For',
  'X-Forwarded-Host',
  'X-Forwarded-Proto',
  'X-Real-IP',
  'X-Frame-Options',
  'X-Content-Type-Options',
  'X-API-Key',
  'X-Auth-Token',
  'X-Request-ID',
  'X-Correlation-ID',
]

export { HEADERS }
