const { Notification } = require("../../models/notification.model");
const { checkJWT } = require("../../utils/auth");

const notificationResolvers = {
    Query: {
        async getNotifications(parent, args, context) {
            checkJWT(context);
            const { userId, count } = args;
            const notifications = await Notification.find({
                user: userId,
            }).sort({
                updatedAt: -1,
            });
            if (notifications.length !== count) {
                return notifications;
            } else {
                return [];
            }
        },
    },
    Mutation: {
        async markAsRead(parent, args, context) {
            checkJWT(context);
            const { userId } = args;

            const notifications = await Notification.find({ user: userId });
            for (const notification of notifications) {
                if (!notification.isRead) {
                    notification.isRead = true;
                    await notification.save();
                }
            }
            return notifications;
        },
    },
    Notification: {
        async user(parent) {
            await parent.populate("user");
            return parent.user;
        },
        async from(parent) {
            await parent.populate("from");
            return parent.from;
        },
        async post(parent) {
            await parent.populate("post");
            return parent.post;
        },
        async comment(parent) {
            await parent.populate("comment");
            return parent.comment;
        },
    },
};

module.exports = { notificationResolvers };
