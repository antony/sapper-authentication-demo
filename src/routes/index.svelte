<style>
	
</style>

<script>
  import { goto } from '@sapper/app'
  
  let email = null
  let password = 'user123'

  async function login () {
    await fetch('http://localhost:2000/session', {
      method: 'POST',
      mode: 'cors',
      credentials: 'include',
      headers: {
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        email,
        password
      })
    })

    window.location.href= 'profile' 
  }
</script>

<svelte:head>
	<title>Sapper project template</title>
</svelte:head>

<p>Login</p>
<select bind:value={email}>
  <option value={null}>-- Choose --</option>
  <option value="user@example.com">User</option>
  <option value="owner@example.org">Owner</option>
  <option value="admin@example.net">Admin</option>
</select>
<input type="password" bind:value={password} />
<button type="button" disabled={!email} on:click={login}>Log in</button>