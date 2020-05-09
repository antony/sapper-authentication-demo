<h1>{profile.username}</h1>

<h2>My Roles</h2>
<ul>
  {#each profile.roles as role}
  <li>{role}</li>
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