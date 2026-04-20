export const maskSecret = (value?: string | null) => !value ? "" : value.length <= 3 ? "***" : `${"*".repeat(Math.max(4, value.length - 2))}${value.slice(-2)}`;
