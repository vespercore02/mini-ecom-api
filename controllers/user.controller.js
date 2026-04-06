const bcrypt = require("bcrypt");
const User = require("../models/User");

exports.getMe = async (req, res) => {
    try {

        const user = await User.findByPk(req.user.id, {
            attributes: [
                "id",
                "first_name",
                "middle_name",
                "last_name",
                "email",
                "phone",
                "role",
                "status",
                "createdAt",
                "updatedAt"
            ]
        });

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error fetching user profile"
        });
    }
};

exports.updateMe = async (req, res) => {
    try {

        const userId = req.user.id;
        const {
            first_name,
            middle_name,
            last_name,
            email,
            phone
        } = req.body;

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        if (email && email !== user.email) {
            const existingUser = await User.findOne({
                where: { email }
            });

            if (existingUser) {
                return res.status(400).json({
                    message: "Email already in use"
                });
            }
        }

        await user.update({
            first_name: first_name ?? user.first_name,
            middle_name: middle_name ?? user.middle_name,
            last_name: last_name ?? user.last_name,
            email: email ?? user.email,
            phone: phone ?? user.phone
        });

        res.json({
            message: "Profile updated successfully",
            user: {
                id: user.id,
                first_name: user.first_name,
                middle_name: user.middle_name,
                last_name: user.last_name,
                email: user.email,
                phone: user.phone,
                role: user.role,
                status: user.status
            }
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating profile"
        });
    }
};

exports.changePassword = async (req, res) => {
    try {

        const userId = req.user.id;
        const { old_password, new_password } = req.body;

        if (!old_password || !new_password) {
            return res.status(400).json({
                message: "Old password and new password are required"
            });
        }

        if (new_password.length < 6) {
            return res.status(400).json({
                message: "New password must be at least 6 characters"
            });
        }

        const user = await User.findByPk(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        const isMatch = await bcrypt.compare(old_password, user.password);

        if (!isMatch) {
            return res.status(400).json({
                message: "Old password is incorrect"
            });
        }

        const hashedPassword = await bcrypt.hash(new_password, 10);

        await user.update({
            password: hashedPassword
        });

        res.json({
            message: "Password changed successfully"
        });

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error changing password"
        });
    }
};

exports.updateUserStatus = async (req, res) => {
    try {

        const { id } = req.params;
        const { status } = req.body;

        const allowedStatus = ["active", "banned"];

        if (!allowedStatus.includes(status)) {
            return res.status(400).json({
                message: "Invalid status"
            });
        }

        const user = await User.findByPk(id);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        await user.update({ status });

        res.json(user);

    } catch (error) {
        console.error(error);
        res.status(500).json({
            message: "Error updating user status"
        });
    }
};