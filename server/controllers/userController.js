import User from '../models/User.js';

export const syncUser = async (req, res) => {
  try {
    const { uid, email } = req.user;
    let user = await User.findOne({ firebaseUid: uid });

    if (!user) {
      user = await User.create({
        firebaseUid: uid,
        name: email.split('@')[0],
        email,
      });
    }

    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Failed to sync user', error: error.message });
  }
};