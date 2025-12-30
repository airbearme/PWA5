export const flags = {
  killSwitch: process.env.NEXT_PUBLIC_KILL_SWITCH === "1",
  canary: process.env.NEXT_PUBLIC_CANARY === "1",
};
