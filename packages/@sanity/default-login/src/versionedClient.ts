import type {SanityClient} from '@sanity/client'
/**
 * Only for use inside of @sanity/default-login
 * Don't import this from external modules.
 *
 * @internal
 */

const API_VERSION = '2021-06-07'

export function getVersionedClient(): SanityClient {
  return require('part:@sanity/base/client').withConfig({
    apiVersion: API_VERSION,
  }) as SanityClient
}
