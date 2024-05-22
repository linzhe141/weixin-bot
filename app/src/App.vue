<script setup>
import { ref } from 'vue';
const disabled = ref(false);
const inputRef = ref(null);
async function changeHandle() {
	disabled.value = true;
	const files = inputRef.value.files;
	const data = new FormData();
	for (const item of files) {
		data.append('file', item);
	}
	await fetch('/api/upload', {
		method: 'POST',
		body: data
	});
	disabled.value = false;
}
</script>

<template>
	<div
		style="
			display: flex;
			justify-content: center;
			margin-top: 100px;
			position: relative;
		"
	>
		<label>
			<div class="btn" style="display: flex; align-items: center">
				选择图片
				<div
					v-if="disabled"
					style="
						width: 16px;
						height: 16px;
						animation: rotating 2s linear infinite;
					"
				>
					<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1024 1024">
						<path
							fill="currentColor"
							d="M512 64a32 32 0 0 1 32 32v192a32 32 0 0 1-64 0V96a32 32 0 0 1 32-32m0 640a32 32 0 0 1 32 32v192a32 32 0 1 1-64 0V736a32 32 0 0 1 32-32m448-192a32 32 0 0 1-32 32H736a32 32 0 1 1 0-64h192a32 32 0 0 1 32 32m-640 0a32 32 0 0 1-32 32H96a32 32 0 0 1 0-64h192a32 32 0 0 1 32 32M195.2 195.2a32 32 0 0 1 45.248 0L376.32 331.008a32 32 0 0 1-45.248 45.248L195.2 240.448a32 32 0 0 1 0-45.248zm452.544 452.544a32 32 0 0 1 45.248 0L828.8 783.552a32 32 0 0 1-45.248 45.248L647.744 692.992a32 32 0 0 1 0-45.248zM828.8 195.264a32 32 0 0 1 0 45.184L692.992 376.32a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0m-452.544 452.48a32 32 0 0 1 0 45.248L240.448 828.8a32 32 0 0 1-45.248-45.248l135.808-135.808a32 32 0 0 1 45.248 0z"
						></path>
					</svg>
				</div>
			</div>
			<input
				style="display: none"
				type="file"
				ref="inputRef"
				multiple
				@change="changeHandle"
			/>
		</label>
		<div
			v-if="disabled"
			style="
				position: absolute;
				top: 0;
				bottom: 0;
				right: 0;
				left: 0;
				cursor: not-allowed;
			"
		></div>
	</div>
	<div
		v-if="disabled"
		style="
			color: #fff;
			display: flex;
			justify-content: center;
			margin-top: 50px;
		"
	>
		请耐心等待，此过程比较慢。。。
	</div>
</template>

<style scoped>
.btn {
	border-radius: 4px;
	padding: 6px 24px;
	background: #2e9a40;
	cursor: pointer;
	color: #fff;
}
.btn:hover {
	background: #29903b;
}
</style>
