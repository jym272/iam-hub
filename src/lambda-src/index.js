const AWS = require('aws-sdk');
const sns = new AWS.SNS();

exports.handler = async (event) => {
    console.log('Budget enforcement function triggered:', JSON.stringify(event));

    try {
        // Parse the budget alert message
        const message = JSON.parse(event.Records[0].Sns.Message);

        // Extract budget information
        const budgetName = message.BudgetName;
        const threshold = message.ThresholdBreached;

        console.log(`Budget ${budgetName} has exceeded ${threshold}% of the limit`);

        // Send notification
        await sns.publish({
            TopicArn: process.env.BUDGET_TOPIC_ARN,
            Message: `ALERT: Budget ${budgetName} has exceeded ${threshold}% of the limit`,
            Subject: `Budget Alert - ${budgetName}`
        }).promise();

        // TODO: Implement user access key disabling if critical threshold reached
        if (threshold >= 100) {
            console.log('Critical threshold reached - would disable access keys here');
            // Future enhancement: disable user access keys
        }

        return {
            statusCode: 200,
            body: JSON.stringify('Budget enforcement completed')
        };
    } catch (error) {
        console.error('Error in budget enforcement:', error);
        throw error;
    }
};