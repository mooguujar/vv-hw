const User = require('../models/User');
const jwt = require('jsonwebtoken');

exports.getUsers = (req, res) => {
  res.success([{ id: 1, name: 'Tim' }])
}

function signToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN }
  );
}

function generateToken(user) {
  return jwt.sign(
    { id: user._id, username: user.username },
    process.env.JWT_SECRET,
    { expiresIn: process.env.JWT_EXPIRES_IN || '60d' }
  );
}

const register = async (req, res) => {
  const { username, password } = req.body;
  console.log("🚀 ~ register ~ password: ", password);
  console.log("🚀 ~ register ~ username: ", username);

  try {
    const exist = await User.findOne({ username });
    if (exist) return res.fail('用户名已存在');

    const user = await User.create({ username, password });
    const token = signToken(user);
    res.success({ token, user: { id: user._id, username: user.username } });
  } catch (err) {
    res.fail({ message: '注册失败', error: err.message });
  }
}

async function login(req, res) {
  const { username, password } = req.body;

  const user = await User.findOne({ username });
  console.log("🚀 ~ login ~ user: ", user);
  if (!user || user.password !== password) {
    return res.fail('用户名或密码错误');
  }
1
  const token = generateToken(user);

  if (!user || user.password !== password) {
    return res.fail('登录失败')
  }

  return res.success({
    msg: `登录成功 ${username}`,
    username: username,
    token: token
  })
}

module.exports = {
  login,
  register
};
