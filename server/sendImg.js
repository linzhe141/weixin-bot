import fs from 'fs';
import crypto from 'crypto';
import { resolve, dirname } from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
dotenv.config({ path: ['.env.local', '.env'] });

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
		console.log(res.errcode);
		if (res.errcode === 0) {
			fs.unlinkSync(filePath);
			console.log(filePath, '发送成功');
			console.log('==========================');
			count++;
		}
		if (count === 20) {
			count = 0;
			setTimeout(() => {
				sendImg();
			}, 1000 * 65);
			break;
		}
	}
}

function checkImg(filePath) {
	// 获取图片大小
	const stats = fs.statSync(filePath);
	const fileSizeInBytes = stats.size;
	const fileSizeInMB = fileSizeInBytes / (1024 * 1024);

	// 设定压缩参数
	const targetSizeInMB = 2;
	let quality = 80; // 初始质量

	// 检查是否需要压缩
	if (fileSizeInMB > targetSizeInMB) {
		// 压缩图片
		return sharp(filePath)
			.jpeg({ quality }) // 初始压缩质量
			.toBuffer()
			.then((data) => {
				const compressedSizeInMB = data.length / (1024 * 1024);
				// 逐步降低质量直到达到目标大小
				while (compressedSizeInMB > targetSizeInMB && quality > 10) {
					quality -= 5;
					data = sharp(data).jpeg({ quality }).toBuffer();
					compressedSizeInMB = data.length / (1024 * 1024);
				}
				console.log(filePath, '压缩成功');
				return data;
			})
			.catch((err) => {
				console.error('Error during compression:', err);
			});
	}
}
