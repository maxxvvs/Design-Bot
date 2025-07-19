let feedbackMessage = null;

module.exports = {
    getFeedbackMessage: () => feedbackMessage,
    setFeedbackMessage: (message) => { feedbackMessage = message; }
};
