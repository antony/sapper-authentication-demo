<script context="module">
  import { protectRoute } from "../functions/protectRoute";
  import { goto } from "@sapper/app";

  export async function preload(page, session) {
    const redirectTo = protectRoute(page.path, session.profile);
    if (redirectTo) {
      goto(redirectTo);
    }
  }
</script>

<h1>Site Admin</h1>

<p>You are all powerful.</p>
