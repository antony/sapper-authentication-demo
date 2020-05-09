<script>
	import config from '../config.js'
  import { goto, stores } from '@sapper/app'

  const { keycloak } = config
	const { session } = stores()
	let redirect = ""
	if (typeof document !== 'undefined') {
		redirect = `?redirect_uri=${encodeURI(document.location.origin)}/auth/logout`
	}
	const logoutURL = `${keycloak.authServerURL}/realms/${keycloak.realm}/protocol/openid-connect/logout${redirect}`

	const logout = () => {
		session.set({ authenticated: false, profile: null })
		goto(logoutURL)
	}

  export let segment
</script>

<style>
	nav {
		border-bottom: 1px solid rgba(255,62,0,0.1);
		font-weight: 300;
		padding: 0 1em;
    display: flex;
    justify-content: space-between;
	}

	ul {
		margin: 0;
		padding: 0;
	}

	/* clearfix */
	ul::after {
		content: '';
		display: block;
		clear: both;
	}

	li {
		display: block;
		float: left;
	}

	[aria-current] {
		position: relative;
		display: inline-block;
	}

	[aria-current]::after {
		position: absolute;
		content: '';
		width: calc(100% - 1em);
		height: 2px;
		background-color: rgb(255,62,0);
		display: block;
		bottom: -1px;
	}

	a {
		text-decoration: none;
		padding: 1em 0.5em;
		display: block;
	}
</style>

<nav>
	<ul>
		<li><a aria-current='{segment === undefined ? "page" : undefined}' href='.'>home</a></li>
    {#if $session.authenticated}
      <li><a aria-current='{segment === "profile" ? "page" : undefined}' href='profile'>profile</a></li>
      {#if $session.profile.roles.includes('owner')}
        <li><a aria-current='{segment === "organisation" ? "page" : undefined}' href='organisation'>my organisation</a></li>
      {:else if $session.profile.roles.includes('admin')}
        <li><a aria-current='{segment === "admin" ? "page" : undefined}' href='admin'>admin tools</a></li>
      {/if}
    {/if}
	</ul>
  <ul>
    {#if $session.authenticated}
    <li><a href={logoutURL} on:click|once|preventDefault={logout}>log out</a></li>
    {/if}
  </ul>
</nav>
