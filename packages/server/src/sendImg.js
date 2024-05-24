import fs from 'fs';
import crypto from 'crypto';
import { resolve, dirname } from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const weixinbotUrl = process.env.WEIXIN_BOT_URL;
let count = 0;
export async function sendImg() {
	const imgPath = resolve(__dirname, '../img');
	if (fs.readdirSync(imgPath).length === 0) {
		count = 0;
	}
	for (const item of fs.readdirSync(imgPath)) {
		const filePath = resolve(imgPath, item);
		let imageBuffer;
		const checkData = await checkImg(filePath);
		if (checkData) {
			imageBuffer = checkData;
		} else {
			imageBuffer = fs.readFileSync(filePath);
		}
		const base64 = imageBuffer.toString('base64');
		const md5 = crypto.createHash('md5').update(imageBuffer).digest('hex');
		const data = {
			msgtype: 'image',
			image: { base64, md5 }
		};
		const request = await fetch(weixinbotUrl, {
			method: 'POST',
			body: JSON.stringify(data)
		});
		const res = await request.json();
		console.log('errcode：', res.errcode);
		if (res.errcode === 0) {
			fs.unlinkSync(filePath);
			console.log(filePath, '发送成功');
			console.log('==========================');
			count++;
		}
		if (count === 20) {
			count = 0;
			await delay(1000 * 65); // 使用 delay 函数代替 setTimeout
			await sendImg();
		}
	}
}

async function checkImg(filePath) {
	// 获取图片大小
	const stats = fs.statSync(filePath);
	const fileSizeInBytes = stats.size;
	const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

	// 设定压缩参数
	const targetSizeInMB = 2;
	let quality = 99; // 初始质量

	// 检查是否需要压缩
	if (fileSizeInMB > targetSizeInMB) {
		// 压缩图片
		sharp.cache(false);
		let data = await sharp(filePath)
			.jpeg({ quality }) // 初始压缩质量
			.toBuffer();
		let compressedSizeInMB = data.length / (1024 * 1024);
		// 逐步降低质量直到达到目标大小
		while (compressedSizeInMB > targetSizeInMB) {
			quality -= 1;
			data = await sharp(data).jpeg({ quality }).toBuffer();
			compressedSizeInMB = data.length / (1024 * 1024);
		}
		console.log(filePath, '压缩成功', compressedSizeInMB + 'MB');
		return data;
	}
}

function delay(ms) {
	return new Promise((resolve) => setTimeout(resolve, ms));
}
