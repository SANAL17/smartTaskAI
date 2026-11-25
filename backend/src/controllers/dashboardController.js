
const mongoose = require("mongoose");
const Task = require("../models/Task"); // Adjust path if needed

const getDashboardData = async (req, res) => {
    try {
        // Get parameters from query
        const { userId, year, month } = req.query;

        // Validate required parameters
        if (!userId || !year || !month) {
            return res.status(400).json({
                success: false,
                message: "User ID, year and month are required."
            });
        }

        // Validate user ID
        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                success: false,
                message: "Invalid user ID."
            });
        }

        const selectedYear = Number(year);
        const selectedMonth = Number(month);

        // Validate year and month
        if (
            !Number.isInteger(selectedYear) ||
            selectedYear < 1970 ||
            selectedYear > 9999 ||
            !Number.isInteger(selectedMonth) ||
            selectedMonth < 1 ||
            selectedMonth > 12
        ) {
            return res.status(400).json({
                success: false,
                message: "Invalid year or month."
            });
        }

        const userObjectId = new mongoose.Types.ObjectId(userId);

        // Calculate selected month date range
        const startDate = new Date(
            Date.UTC(selectedYear, selectedMonth - 1, 1)
        );

        const endDate = new Date(
            Date.UTC(selectedYear, selectedMonth, 1)
        );

        // Filter tasks belonging to the user
        // and created during the selected month
        const monthFilter = {
            user: userObjectId,
            createdAt: {
                $gte: startDate,
                $lt: endDate
            }
        };

        // Fetch dashboard statistics
        const [
            totalTasks,
            pendingTasks,
            inProgress,
            completed,
            dailyCompletions,
            recentlyCompletedTasks
        ] = await Promise.all([

            // Total tasks
            Task.countDocuments(monthFilter),

            // Pending tasks
            Task.countDocuments({
                ...monthFilter,
                status: "Pending"
            }),

            // In Progress tasks
            Task.countDocuments({
                ...monthFilter,
                status: "In Progress"
            }),

            // Completed tasks
            Task.countDocuments({
                ...monthFilter,
                status: "Completed"
            }),

            // Daily completed tasks
            Task.aggregate([
                {
                    $match: {
                        user: userObjectId,
                        status: "Completed",
                        completedDate: {
                            $gte: startDate,
                            $lt: endDate
                        }
                    }
                },
                {
                    $group: {
                        _id: {
                            $dayOfMonth: "$completedDate"
                        },
                        value: {
                            $sum: 1
                        }
                    }
                },
                {
                    $sort: {
                        _id: 1
                    }
                }
            ]),
            Task.find({
                user: userObjectId,
                status: "Completed",
                completedDate: {
                    $gte: startDate,
                    $lt: endDate
                }
            })
                .sort({ completedDate: -1 })
                .limit(5)
                .select("title priority completedDate")
                .lean()
        ]);

        // Convert aggregation results into a map
        const completionMap = {};

        dailyCompletions.forEach((item) => {
            completionMap[item._id] = item.value;
        });

        // Get total days in selected month
        const daysInMonth = new Date(
            Date.UTC(selectedYear, selectedMonth, 0)
        ).getUTCDate();

        // Generate daily completion data
        const completedData = Array.from(
            { length: daysInMonth },
            (_, index) => ({
                day: index + 1,
                value: completionMap[index + 1] || 0
            })
        );

        // Get month name
        const monthName = new Date(
            Date.UTC(selectedYear, selectedMonth - 1, 1)
        ).toLocaleString("en-US", {
            month: "long",
            timeZone: "UTC"
        });

        // Final response
        return res.status(200).json({
            success: true,
            message: "Dashboard data fetched successfully.",
            data: {
                month: `${monthName} - ${selectedYear}`,
                completedData,
                totalTasks,
                pendingTasks,
                inProgress,
                completed,
                recentlyCompletedTasks
            }
        });

    } catch (error) {
        console.error("Dashboard Controller Error:", error);

        return res.status(500).json({
            success: false,
            message: "Unable to fetch dashboard data."
        });
    }
};

module.exports = {
    getDashboardData
};
