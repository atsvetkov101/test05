export const ERRORS = {
  ServerError: {
    error: 'Неизвестная ошибка',
    errorCode: 'ServerError',
  },
  ValidationError: (errors: object[]) => ({
    error: `Ошибка валидации. Подробнее: ${JSON.stringify(errors)}`,
    errorCode: 'ValidationError',
  }),
  RequestTimeout: (timeoutMs: number) => ({
    error: `Превышен таймаут выполнения запроса (${timeoutMs}мс)`,
    errorCode: 'RequestTimeout',
  }),
};
