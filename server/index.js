import express from 'express';
import { sendImg } from './sendImg.js';
import { resolve, dirname } from 'path';
import { fileURLToPath } from 'url';
import fs from 'fs-extra';
import fileUpload from 'express-fileupload';

const __dirname = dirname(fileURLToPath(import.meta.url));

const app = express();
app.use(fileUpload());

app.post('/upload', async function (req, res) {
	const uploadDir = resolve(__dirname, '../img');
	if (!fs.existsSync(uploadDir)) {
		fs.mkdirSync(uploadDir);
	}
	const { file: files } = req.files;
	for (let i = 0; i < files.length; i++) {
		const file = files[i];
		const targetPath = resolve(
			__dirname,
			`../img/${Date.now()}-index${i}-${file.name}`
		);
		await file.mv(targetPath);
	}
	await sendImg();
	res.json({ success: true });
});

app.listen(8912, () => {
	console.log(`Server running at http://localhost:8912`);
});
