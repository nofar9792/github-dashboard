export interface LogContext {
  userId?: string;
  username?: string;
  error?: Error | string | unknown;
  duration?: number;
  count?: number;
}

export const logger = {
  info: (message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    // eslint-disable-next-line no-console
    console.log(
      JSON.stringify({
        level: "INFO",
        timestamp,
        message,
        ...context,
      })
    );
  },

  error: (message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    const errorMessage =
      context?.error instanceof Error
        ? context.error.message
        : typeof context?.error === "string"
          ? context.error
          : String(context?.error);

    console.error(
      JSON.stringify({
        level: "ERROR",
        timestamp,
        message,
        error: errorMessage,
        ...context,
      })
    );
  },

  warn: (message: string, context?: LogContext) => {
    const timestamp = new Date().toISOString();
    console.warn(
      JSON.stringify({
        level: "WARN",
        timestamp,
        message,
        ...context,
      })
    );
  },

  debug: (message: string, context?: LogContext) => {
    if (process.env.NODE_ENV === "development") {
      const timestamp = new Date().toISOString();
      // eslint-disable-next-line no-console
      console.log(
        JSON.stringify({
          level: "DEBUG",
          timestamp,
          message,
          ...context,
        })
      );
    }
  },
};
