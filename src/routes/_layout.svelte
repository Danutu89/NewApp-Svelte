<script>
	import {onMount} from 'svelte'
	import Nav from '../components/Nav.svelte';
	import { loadProgressBar } from 'axios-progress-bar';
	import { stores } from '@sapper/app';
	const { session } = stores();
	
	onMount(async function() {
		loadProgressBar();
	});
</script>

<Nav/>

<reload style="height: 3rem;display:block"></reload>

<overflow></overflow>

<content>
	<slot></slot>
</content>



