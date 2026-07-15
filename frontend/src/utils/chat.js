export const formatMessageTime = (value) => {
  if (!value) return "";
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return "";
  return date.toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' });
};

export const getUserDisplayName = (user) => {
  if (!user) return "Unknown";
  return user.username?.trim() || user.email?.split('@')[0] || "Unknown";
};

export const getRelativePresence = (isOnline) => (isOnline ? "Online" : "Offline");
