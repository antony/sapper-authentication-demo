<script context="module">
  import { protectRoute } from "../lib/protectRoute";
  import { goto } from "@sapper/app";
  export async function preload(page, session) {
    const redirectTo = protectRoute(page.path, session.profile);
    if (redirectTo) {
      goto(redirectTo);
    }
  }
</script>

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
