<script>
	import {onMount} from 'svelte'
	import Nav from '../components/Nav.svelte';
	import { loadProgressBar } from 'axios-progress-bar';
	import { stores } from '@sapper/app';
	import jwt from 'jsonwebtoken';
	import Cookie from 'cookie-universal';

	const cookies = Cookie();
	const { session, page } = stores();

	onMount(async function() {
		loadProgressBar();
	});
</script>

<Nav/>

<reload style="height: 3rem;display:block"></reload>

<content>
	<slot></slot>
</content>