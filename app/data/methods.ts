const METHODS = ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'HEAD', 'OPTIONS'] as const

type TMethod = (typeof METHODS)[number]

export { METHODS, type TMethod }
