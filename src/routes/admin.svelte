<script>
  import { stores } from '@sapper/app'
  const { session } = stores()
</script>

{#if $session.authenticated}
  {#if $session.profile.roles.includes('admin')}
    <h1>Site Admin</h1>
    <p>You are all powerful.</p>
  {:else}
    <h1>Go away you non-admin!</h1>
  {/if}
{/if}