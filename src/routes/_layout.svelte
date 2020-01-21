<script>
	import {onMount} from 'svelte'
	import Nav from '../components/Nav.svelte';
	import { loadProgressBar } from 'axios-progress-bar';
	
	onMount(async function() {
		loadProgressBar();
	});
</script>

<Nav/>

<reload style="height: 3rem;display:block"></reload>

<content>
	<slot></slot>
</content>