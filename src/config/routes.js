import { Router } from '@beyonk/sapper-rbac'

const routes = new Router()
  .restrict('/admin.*', ['admin'])
  .restrict('/organisation.*', ['owner'])
  .restrict('/profile.*', ['admin', 'owner', 'user'])
  .unrestrict('/.*') // add this after the guarded sub-urls
  .build()

export default routes
