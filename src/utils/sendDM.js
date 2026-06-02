async function sendDM(user, messagePayload) {
  try {
    await user.send(messagePayload);
    return { success: true };
  } catch (error) {
    console.warn(`[Punisher] Could not DM user ${user.tag} (${user.id}): ${error.message}`);
    return { success: false, error: error.message };
  }
}

module.exports = { sendDM };
