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
  import Protected from '../components/Protected.svelte'
</script>

<Protected role="admin">
  <h1>Site Admin</h1>

  <p>You are all powerful.</p>
</Protected>
