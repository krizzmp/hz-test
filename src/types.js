// @flow
import type { Observable } from 'rxjs'
export type Collection = {
  findAll: (...g: Object[]) => Collection,
  watch: () => Observable<*>,
  store: (o: Object) => Observable<*>,
  update: (o: Object) => Observable<*>
}
export type Horizon = {
  (collection: string): Collection,
  currentUser: () => Collection,
  hasAuthToken: () => boolean,
  authEndpoint: (provider: string) => Observable<string>,
  connect: () => Horizon
}

export type User = { id: string }
export type Upc = { pid: string }
export type ProjectT = {
  id: string,
  name: string
}
export type Task = {
  id: string,
  title: string,
  description: string,
  claimedBy: string,
  done: boolean
}
