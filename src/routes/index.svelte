<script>
  import { goto, stores } from "@sapper/app";
  const { session } = stores();
</script>

<svelte:head>
  <title>Sapper project template</title>
</svelte:head>

{#if $session.authenticated}
  <p>You are logged in as {$session.user.username}</p>
{:else}
  <p>
    <a href="/auth/login">Login</a>
    to access
  </p>
{/if}
