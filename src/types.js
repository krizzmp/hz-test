// @flow
export type Collection = {
  findAll: (...g: Object[]) => Collection,
  watch: () => rxjs$Observable<*>,
  store: (o: Object) => rxjs$Observable<*>
}
export type Horizon = {
  (collection: string): Collection,
  currentUser: () => Collection,
  hasAuthToken: () => boolean,
  authEndpoint: (provider:string) => rxjs$Observable<string>,
  connect: () => Horizon
}

export type User = { id: string }
export type Upc = { pid: string }
export type ProjectT = { id: string, name: string }
export type Task = { id: string, title: string }
