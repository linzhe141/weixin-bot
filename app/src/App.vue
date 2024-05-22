<script setup>
import { ref } from 'vue';

const inputRef = ref(null);
function changeHandle(_, uploadFiles) {
	console.log(inputRef.value);
}
</script>

<template>
	<div style="display: flex; justify-content: center; margin-top: 100px">
		<label>
			<div>选择图片</div>
			<input
				style="display: none"
				type="file"
				ref="inputRef"
				multiple
				@change="changeHandle"
			/>
		</label>
	</div>
</template>

<style scoped></style>
