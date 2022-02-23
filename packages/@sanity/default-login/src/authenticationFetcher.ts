import {User} from '@sanity/types'
import getProviders from './util/getProviders'
import {getVersionedClient} from './versionedClient'

export default {
  getProviders,

  getCurrentUser: (): Promise<User | null> =>
    getVersionedClient()
      .request({
        uri: '/users/me',
        withCredentials: true,
        tag: 'users.get-current',
      })
      .then((user) => {
        return user && user.id ? user : null
      })
      .catch((err) => {
        if (err.statusCode === 401) {
          return null
        }
        throw err
      }),

  logout: (): Promise<void> => getVersionedClient().auth.logout(),
}
