class ApiError extends Error {
  code: number;

  constructor(message = "Unexpected error", code = 500) {
    super(message);
    this.name = 'ApiInvocationError'
    this.code = code;
  }
}

export { ApiError };



