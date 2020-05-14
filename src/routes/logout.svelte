<script context="module">
  import config from "../config.js";

  const { keycloak } = config;

  export async function preload(page, session) {
    await this.fetch(
      `${keycloak.authServerURL}/realms/${keycloak.realm}/protocol/openid-connect/logout`,
      {
        method: "POST",
        mode: "cors",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      }
    );
  }
</script>

<script>
  import { goto, stores } from "@sapper/app";

  const { session } = stores();

  session.set({ authenticated: false, user: null });

  goto("/");
</script>
