import express from 'express';
import { sendImg } from './sendImg.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import unzipper from 'unzipper';
import convert from 'heic-convert';
import fileUpload from 'express-fileupload';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(fileUpload());

app.post('/upload', async function (req, res) {
	try {
		const uploadDir = resolve(__dirname, '../../../img');
		if (!fs.existsSync(uploadDir)) {
			fs.mkdirSync(uploadDir);
		}
		let { file: files } = req.files;
		if (!Array.isArray(files)) {
			files = [files];
		}
		for (let i = 0; i < files.length; i++) {
			const file = files[i];
			const targetPath = resolve(
				__dirname,
				`../../../img/${Date.now()}-index${i}-${file.name}`
			);
			await file.mv(targetPath);
		}

		for (const item of fs.readdirSync(uploadDir)) {
			if (item.includes('.zip')) {
				const zipFilePath = resolve(uploadDir, item);
				const zip = fs
					.createReadStream(zipFilePath)
					.pipe(unzipper.Parse({ forceStream: true }));
				for await (const entry of zip) {
					const fileName = entry.path;
					const type = entry.type; // 'Directory' or 'File'
					if (type === 'File') {
						const [name] = fileName.split('/').reverse();
						if (name[0] !== '.') {
							const targetPath = resolve(
								__dirname,
								`../img/${Date.now()}-index-${name}`
							);
							entry.pipe(fs.createWriteStream(targetPath));
						}
					} else {
						entry.autodrain();
					}
				}
				fs.unlinkSync(zipFilePath);
			}
		}
		await Promise.all(
			fs
				.readdirSync(uploadDir)
				.filter((item) => item.toLocaleLowerCase().includes('heic'))
				.map(async (item) => {
					const itemPath = resolve(uploadDir, item);
					const inputBuffer = await fs.readFile(itemPath);
					const outputBuffer = await convert({
						buffer: inputBuffer, // the HEIC file buffer
						format: 'PNG' // output format
					});
					const targetName = item.replace(/\.HEIC$/i, '.PNG');
					const targetPath = resolve(
						__dirname,
						`../img/${Date.now()}-index-${targetName}`
					);
					await fs.writeFile(targetPath, outputBuffer);
					fs.unlinkSync(itemPath);
				})
		);
		console.log('图片处理完成');
		await sendImg();
		res.json({ success: true });
	} catch (error) {
		res.json({ success: false, msg: error });
	}
});

app.listen(8912, () => {
	console.log(`Server running at http://localhost:8912`);
});
