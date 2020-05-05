<script>
  import Error from './Error.svelte'
  import { stores } from '@sapper/app'
  export let role
  const { session } = stores()
  let status = 404
  let error = {
    message: 'Not Found'
  }

</script>

{#if $session.authenticated}
  {#if $session.profile.roles.includes(role)}
  <slot />
  {:else}
    <Error {status} {error} />
  {/if}
{/if}
