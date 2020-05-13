import { Router } from '@beyonk/sapper-rbac'

const routes = new Router()
  .restrict('/admin?.+', ['admin'])
  .restrict('/organisation?.+', ['member'])
  .restrict('/profile?.+', ['member'])
  .unrestrict('/?.*') // add this after the guarded sub-urls
  .build()

export default routes