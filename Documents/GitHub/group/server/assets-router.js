const express = require('express');
const router = express.Router();
const config = require('../config/config.js'); // 根据你的实际路径调整

// 正则表达式匹配图片和视频
const imageRegex = /\/.+\.(svg|png|jpg|jpeg)$/;
const videoRegex = /\/.+\.(mp4|ogv)$/;

// 处理图片请求
router.get(imageRegex, (req, res) => {
  const filePath = req.path;
  res.redirect(303, `${config.apiBaseUrl}/src${filePath}`);
});

// 处理视频请求
router.get(videoRegex, (req, res) => {
  const filePath = req.path;
  res.redirect(303, `${config.apiBaseUrl}/src${filePath}`);
});

module.exports = router;
