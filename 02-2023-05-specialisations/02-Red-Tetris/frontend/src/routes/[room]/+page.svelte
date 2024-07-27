<script lang="ts">
	import { goto } from '$app/navigation';

	const params = document.URL.replaceAll('://', '').split('/');
	const room = params[1];

	goto(`/#${room}`);
</script>
