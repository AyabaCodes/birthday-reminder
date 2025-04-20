const cron = require("node-cron");
const User = require("../models/User");
const emailService = require("../services/EmailService");

class BirthdayCheckerJob {
  init() {
    // cron job Runs every 1 minutes
    //test code with cron.schedule("*/1 * * * *", it will run every 1 minute: use today date to test.

    //cron job runs daily every 7am
    //"0 7 * * *"
    cron.schedule("0 7 * * *", this.run.bind(this), {
      timezone: "Africa/Lagos",
    });
  }

  async run() {
    // Runs every 1 minutes
    console.log("[CRON] Running birthday check...");
    try {
      const today = new Date();
      const startOfDay = new Date(today);
      startOfDay.setHours(0, 0, 0, 0);

      const users = await User.find({
        birthMonth: today.getMonth() + 1,
        birthDay: today.getDate(),
        $or: [
          { emailStatus: "failed" },
          {
            $and: [
              { emailStatus: "sent" },
              { lastEmailSent: { $lt: startOfDay } },
            ],
          },
          { emailStatus: "pending" },
        ],
      });
      console.log(`[CRON] Found ${users.length} birthdays today`);
      for (const user of users) {
        try {
          const { success, error } = await emailService.sendBirthdayEmail(
            user.email,
            user.username
          );

          if (success) {
            user.lastEmailSent = new Date();
            user.emailStatus = "sent";
            console.log(
              `Birthday message sent successfully to ${user.username}`
            );
          } else {
            user.emailStatus = "failed";
            console.log(
              `Birthday message failed to be sent to ${user.username}`
            );
          }

          await user.save();
        } catch (error) {
          console.error(`Error processing user ${user.email}:`, error);
        }
      }
    } catch (error) {
      console.error("Birthday check job failed:", error);
    }
  }
}

module.exports = new BirthdayCheckerJob();
