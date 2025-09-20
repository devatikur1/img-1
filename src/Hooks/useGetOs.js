export const getOS = () => {
  if (navigator.userAgentData) {
    return navigator.userAgentData.platform || "Unknown";
  }
  return navigator.platform || "Unknown";
};