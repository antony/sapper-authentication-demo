<h1>{profile.name}</h1>

<h2>My Profile</h2>
<dl>
  <dt>Email:</dt>
  <dd>{profile.email}</dd>
</dl>

<h2>My Scopes</h2>
<ul>
  {#each profile.scope as scope}
  <li>{scope}</li>
  {/each}
</ul>

<script context="module">
  export async function preload (page, session) {
    return {
      profile: session.profile
    }
  }
</script>

<script>
  export let profile
</script>