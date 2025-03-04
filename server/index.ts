/*
 *   Copyright 2020 Amazon.com, Inc. or its affiliates. All Rights Reserved.
 *
 *   Licensed under the Apache License, Version 2.0 (the "License").
 *   You may not use this file except in compliance with the License.
 *   A copy of the License is located at
 *
 *       http://www.apache.org/licenses/LICENSE-2.0
 *
 *   or in the "license" file accompanying this file. This file is distributed
 *   on an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either
 *   express or implied. See the License for the specific language governing
 *   permissions and limitations under the License.
 */

import { schema, TypeOf } from '@kbn/config-schema';
import { PluginInitializerContext, PluginConfigDescriptor } from '../../../src/core/server';
import { OpendistroSecurityPlugin } from './plugin';

export const configSchema = schema.object({
  enabled: schema.boolean({ defaultValue: true }),
  allow_client_certificates: schema.boolean({ defaultValue: false }),
  readonly_mode: schema.object({
    roles: schema.arrayOf(schema.string(), { defaultValue: [] }),
  }),
  clusterPermissions: schema.object({
    include: schema.arrayOf(schema.string(), { defaultValue: [] }),
  }),
  indexPermissions: schema.object({
    include: schema.arrayOf(schema.string(), { defaultValue: [] }),
  }),
  disabledTransportCategories: schema.object({
    exclude: schema.arrayOf(schema.string(), { defaultValue: [] }),
  }),
  disabledRestCategories: schema.object({
    exclude: schema.arrayOf(schema.string(), { defaultValue: [] }),
  }),
  cookie: schema.object({
    secure: schema.boolean({ defaultValue: true }),
    name: schema.string({ defaultValue: 'security_authentication' }),
    password: schema.string({ defaultValue: 'security_cookie_default_password', minLength: 32 }),
    ttl: schema.number({ defaultValue: 60 * 60 * 1000 }),
    domain: schema.nullable(schema.string()),
    isSameSite: schema.oneOf(
      [
        schema.string({
          validate(value) {
            if (value === 'Strict' || value === 'Lax') {
              return `Allowed values of 'isSameSite' are ['Strict, 'Lax', true, false]`;
            }
          },
        }),
        schema.boolean(),
      ],
      { defaultValue: true }
    ),
  }),
  session: schema.object({
    ttl: schema.number({ defaultValue: 60 * 60 * 1000 }),
    keepalive: schema.boolean({ defaultValue: true }),
  }),
  auth: schema.object({
    type: schema.string({
      defaultValue: '',
      validate(value) {
        if (
          !['', 'basicauth', 'jwt', 'openid', 'saml', 'proxy', 'kerberos', 'proxycache'].includes(
            value
          )
        ) {
          return `allowed auth.type are ['', 'basicauth', 'jwt', 'openid', 'saml', 'proxy', 'kerberos', 'proxycache']`;
        }
      },
    }),
    anonymous_auth_enabled: schema.boolean({ defaultValue: false }),
    unauthenticated_routes: schema.arrayOf(schema.string(), { defaultValue: ['/api/status'] }),
    forbidden_usernames: schema.arrayOf(schema.string(), { defaultValue: [] }),
    logout_url: schema.string({ defaultValue: '' }),
  }),
  basicauth: schema.object({
    enabled: schema.boolean({ defaultValue: true }),
    unauthenticated_routes: schema.arrayOf(schema.string(), { defaultValue: ['/api/status'] }),
    forbidden_usernames: schema.arrayOf(schema.string(), { defaultValue: [] }),
    header_trumps_session: schema.boolean({ defaultValue: false }),
    alternative_login: schema.object({
      headers: schema.arrayOf(schema.string(), { defaultValue: [] }),
      show_for_parameter: schema.string({ defaultValue: '' }),
      valid_redirects: schema.arrayOf(schema.string(), { defaultValue: [] }),
      button_text: schema.string({ defaultValue: 'Login with provider' }),
      buttonstyle: schema.string({ defaultValue: '' }),
    }),
    loadbalancer_url: schema.maybe(schema.string()),
    login: schema.object({
      title: schema.string({ defaultValue: 'Please login to Kibana' }),
      subtitle: schema.string({
        defaultValue:
          'If you have forgotten your username or password, please ask your system administrator',
      }),
      showbrandimage: schema.boolean({ defaultValue: true }),
      brandimage: schema.string({ defaultValue: '' }), // TODO: update brand image
      buttonstyle: schema.string({ defaultValue: '' }),
    }),
  }),
  multitenancy: schema.maybe(
    schema.object({
      enabled: schema.boolean({ defaultValue: false }),
      show_roles: schema.boolean({ defaultValue: false }),
      enable_filter: schema.boolean({ defaultValue: false }),
      debug: schema.boolean({ defaultValue: false }),
      tenants: schema.object({
        enable_private: schema.boolean({ defaultValue: true }),
        enable_global: schema.boolean({ defaultValue: true }),
        preferred: schema.arrayOf(schema.string(), { defaultValue: [] }),
      }),
    })
  ),
  configuration: schema.maybe(
    schema.object({
      enabled: schema.boolean({ defaultValue: true }),
    })
  ),
  accountinfo: schema.maybe(
    schema.object({
      enabled: schema.boolean({ defaultValue: false }),
    })
  ),
  openid: schema.maybe(
    schema.object({
      connect_url: schema.maybe(schema.string()),
      header: schema.string({ defaultValue: 'Authorization' }),
      // TODO: test if siblingRef() works here
      // client_id is required when auth.type is openid
      client_id: schema.conditional(
        schema.siblingRef('auth.type'),
        'openid',
        schema.string(),
        schema.maybe(schema.string())
      ),
      client_secret: schema.string({ defaultValue: '' }),
      scope: schema.string({ defaultValue: 'openid profile email address phone' }),
      base_redirect_url: schema.string({ defaultValue: '' }),
      logout_url: schema.string({ defaultValue: '' }),
      root_ca: schema.string({ defaultValue: '' }),
      verify_hostnames: schema.boolean({ defaultValue: true }),
    })
  ),
  proxycache: schema.maybe(
    schema.object({
      // when auth.type is proxycache, user_header, roles_header and proxy_header_ip are required
      user_header: schema.conditional(
        schema.siblingRef('auth.type'),
        'proxycache',
        schema.string(),
        schema.maybe(schema.string())
      ),
      roles_header: schema.conditional(
        schema.siblingRef('auth.type'),
        'proxycache',
        schema.string(),
        schema.maybe(schema.string())
      ),
      proxy_header: schema.maybe(schema.string({ defaultValue: 'x-forwarded-for' })),
      proxy_header_ip: schema.conditional(
        schema.siblingRef('auth.type'),
        'proxycache',
        schema.string(),
        schema.maybe(schema.string())
      ),
      login_endpoint: schema.maybe(schema.string({ defaultValue: '' })),
    })
  ),
  jwt: schema.maybe(
    schema.object({
      enabled: schema.boolean({ defaultValue: false }),
      login_endpoint: schema.maybe(schema.string()),
      url_param: schema.string({ defaultValue: 'authorization' }),
      header: schema.string({ defaultValue: 'Authorization' }),
    })
  ),
  ui: schema.object({
    basicauth: schema.object({
      // the login config here is the same as old config `opendistro_security.basicauth.login`
      // Since we are now rendering login page to browser app, so move these config to browser side.
      login: schema.object({
        title: schema.string({ defaultValue: 'Please login to Kibana' }),
        subtitle: schema.string({
          defaultValue:
            'If you have forgotten your username or password, please ask your system administrator',
        }),
        showbrandimage: schema.boolean({ defaultValue: true }),
        brandimage: schema.string({ defaultValue: '' }),
        buttonstyle: schema.string({ defaultValue: '' }),
      }),
    }),
  }),
});

export type SecurityPluginConfigType = TypeOf<typeof configSchema>;

export const config: PluginConfigDescriptor<SecurityPluginConfigType> = {
  exposeToBrowser: {
    enabled: true,
    auth: true,
    ui: true,
    multitenancy: true,
    readonly_mode: true,
    clusterPermissions: true,
    indexPermissions: true,
    disabledTransportCategories: true,
    disabledRestCategories: true,
  },
  schema: configSchema,
  deprecations: ({ rename, unused }) => [
    rename('basicauth.login.title', 'ui.basicauth.login.title'),
    rename('basicauth.login.subtitle', 'ui.basicauth.login.subtitle'),
    rename('basicauth.login.showbrandimage', 'ui.basicauth.login.showbrandimage'),
    rename('basicauth.login.brandimage', 'ui.basicauth.login.brandimage'),
    rename('basicauth.login.buttonstyle', 'ui.basicauth.login.buttonstyle'),
  ],
};

//  This exports static code and TypeScript types,
//  as well as, Kibana Platform `plugin()` initializer.

export function plugin(initializerContext: PluginInitializerContext) {
  return new OpendistroSecurityPlugin(initializerContext);
}

export { OpendistroSecurityPluginSetup, OpendistroSecurityPluginStart } from './types';
