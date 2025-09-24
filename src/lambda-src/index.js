const { SNSClient, PublishCommand } = require('@aws-sdk/client-sns');
const { IAMClient, UpdateAccessKeyCommand, ListAccessKeysCommand } = require('@aws-sdk/client-iam');

const snsClient = new SNSClient();
const iamClient = new IAMClient();

exports.handler = async (event) => {
    console.log('Budget enforcement function triggered:', JSON.stringify(event, null, 2));

    try {
        // Validate event structure
        if (!event.Records || !event.Records[0] || !event.Records[0].Sns) {
            throw new Error('Invalid SNS event structure');
        }

        // Parse the budget alert message
        const snsMessage = event.Records[0].Sns.Message;
        const message = JSON.parse(snsMessage);

        // Extract budget information - handle AWS Budget notification format
        const budgetName = message.BudgetName || message.budgetName;
        const threshold = message.ThresholdBreached || message.threshold;
        const accountId = message.AccountId || message.accountId;

        if (!budgetName || !threshold) {
            console.warn('Missing budget information in message:', message);
            return {
                statusCode: 400,
                body: JSON.stringify('Missing budget information')
            };
        }

        console.log(`Budget ${budgetName} has exceeded ${threshold}% of the limit`);

        // Send enhanced notification
        const alertMessage = {
            alert: `CRITICAL: Budget ${budgetName} has exceeded ${threshold}% of the limit`,
            account: accountId,
            timestamp: new Date().toISOString(),
            budgetName,
            threshold,
            action: threshold >= 100 ? 'ACCESS_KEYS_DISABLED' : 'MONITORING'
        };

        await snsClient.send(new PublishCommand({
            TopicArn: process.env.BUDGET_TOPIC_ARN,
            Message: JSON.stringify(alertMessage, null, 2),
            Subject: `🚨 Budget Alert - ${budgetName} (${threshold}%)`
        }));

        // Implement access key disabling for critical threshold
        if (threshold >= 100) {
            console.log('Critical threshold reached - disabling access keys for budget:', budgetName);

            // Extract username from budget name (assumes format: budget-{username})
            const username = budgetName.replace('budget-', '');

            if (username && username !== budgetName) {
                try {
                    // List user's access keys
                    const listResponse = await iamClient.send(new ListAccessKeysCommand({
                        UserName: username
                    }));

                    // Disable all access keys for this user
                    for (const accessKey of listResponse.AccessKeyMetadata || []) {
                        if (accessKey.Status === 'Active') {
                            await iamClient.send(new UpdateAccessKeyCommand({
                                UserName: username,
                                AccessKeyId: accessKey.AccessKeyId,
                                Status: 'Inactive'
                            }));
                            console.log(`Disabled access key ${accessKey.AccessKeyId} for user ${username}`);
                        }
                    }

                    console.log(`Successfully disabled access keys for user: ${username}`);
                } catch (iamError) {
                    console.error(`Failed to disable access keys for user ${username}:`, iamError);
                    // Don't throw - we still want to log the budget breach
                }
            }
        }

        return {
            statusCode: 200,
            body: JSON.stringify({
                message: 'Budget enforcement completed',
                budgetName,
                threshold,
                action: threshold >= 100 ? 'access_keys_disabled' : 'notification_sent'
            })
        };
    } catch (error) {
        console.error('Error in budget enforcement:', error);

        // Send error notification
        try {
            await snsClient.send(new PublishCommand({
                TopicArn: process.env.BUDGET_TOPIC_ARN,
                Message: `Budget enforcement Lambda error: ${error.message}`,
                Subject: '❌ Budget Enforcement Error'
            }));
        } catch (snsError) {
            console.error('Failed to send error notification:', snsError);
        }

        throw error;
    }
};