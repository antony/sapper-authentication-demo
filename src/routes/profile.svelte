<script context="module">
  export async function preload(page, session) {
    return {
      user: session.user,
    };
  }
</script>

<script>
  export let user;
</script>

<h1>{user.username}</h1>

<h2>My Scopes</h2>
<ul>
  {#each user.scope as scope}
    <li>{scope}</li>
  {/each}
</ul>
