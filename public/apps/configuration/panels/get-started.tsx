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

import {
  EuiButton,
  EuiText,
  EuiTitle,
  EuiSteps,
  EuiCode,
  EuiSpacer,
  EuiImage,
  EuiFlexItem,
  EuiFlexGroup,
  EuiPanel,
  EuiPageHeader,
} from '@elastic/eui';
import React from 'react';
import { FormattedMessage } from '@kbn/i18n/react';
import { AppDependencies } from '../../types';
import securityStepsDiagram from '../../../assets/get_started.svg';
import { buildHashUrl } from '../utils/url-builder';
import { Action, ResourceType } from '../types';
import { DocLinks } from '../constants';
import { ExternalLink, ExternalLinkButton } from '../utils/display-utils';

const setOfSteps = [
  {
    title: 'Add backends',
    children: (
      <>
        <EuiText size="s" color="subdued">
          Add authentication<EuiCode>(authc)</EuiCode>and authorization<EuiCode>(authz)</EuiCode>
          information to<EuiCode>plugins/opendistro_security/securityconfig/config.yml</EuiCode>.
          The <EuiCode>authc</EuiCode> section contains the backends to check user credentials
          against. The <EuiCode>authz</EuiCode>
          section contains any backends to fetch external identities from. The most common example
          of an external identity is an LDAP group.{' '}
          <ExternalLink href={DocLinks.AuthenticationFlowDoc} />
        </EuiText>

        <EuiSpacer size="m" />

        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem grow={false}>
            <ExternalLinkButton
              fill
              href={DocLinks.BackendConfigurationDoc}
              text="Create config.yml"
            />
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              data-test-subj="review-authentication-and-authorization"
              onClick={() => {
                window.location.href = buildHashUrl(ResourceType.auth);
              }}
            >
              Review authentication and authorization
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="l" />
      </>
    ),
  },
  {
    title: 'Create roles',
    children: (
      <>
        <EuiText size="s" color="subdued">
          Roles are reusable collections of permissions. The default roles are a great starting
          point, but you might need to create custom roles that meet your exact needs.{' '}
          <ExternalLink href={DocLinks.CreateRolesDoc} />
        </EuiText>

        <EuiSpacer size="m" />

        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiButton
              data-test-subj="explore-existing-roles"
              fill
              onClick={() => {
                window.location.href = buildHashUrl(ResourceType.roles);
              }}
            >
              Explore existing roles
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              data-test-subj="create-new-role"
              onClick={() => {
                window.location.href = buildHashUrl(ResourceType.roles, Action.create);
              }}
            >
              Create new role
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>

        <EuiSpacer size="l" />
      </>
    ),
  },
  {
    title: 'Map users',
    children: (
      <>
        <EuiText size="s" color="subdued">
          After a user successfully authenticates, the security plugin retrieves that user’s roles.
          You can map roles directly to users, but you can also map them to external identities.{' '}
          <ExternalLink href={DocLinks.MapUsersToRolesDoc} />
        </EuiText>

        <EuiSpacer size="m" />

        <EuiFlexGroup gutterSize="s">
          <EuiFlexItem grow={false}>
            <EuiButton
              data-test-subj="map-users-to-role"
              fill
              onClick={() => {
                window.location.href = buildHashUrl(ResourceType.users);
              }}
            >
              Map users to a role
            </EuiButton>
          </EuiFlexItem>
          <EuiFlexItem grow={false}>
            <EuiButton
              data-test-subj="create-internal-user"
              onClick={() => {
                window.location.href = buildHashUrl(ResourceType.users, Action.create);
              }}
            >
              Create internal user
            </EuiButton>
          </EuiFlexItem>
        </EuiFlexGroup>
      </>
    ),
  },
];

export function GetStarted(props: AppDependencies) {
  return (
    <>
      <div className="panel-restrict-width">
        <EuiPageHeader>
          <EuiTitle size="l">
            <h1>Get started</h1>
          </EuiTitle>
          <ExternalLinkButton text="Open in new window" href={buildHashUrl()} />
        </EuiPageHeader>

        <EuiPanel paddingSize="l">
          <EuiText size="s" color="subdued">
            <p>
              The Open Distro for Elasticsearch security plugin lets you define the API calls that
              users can make and the data they can access. The most basic configuration consists of
              three steps.
            </p>
          </EuiText>

          <EuiSpacer size="l" />

          <EuiImage
            size="xl"
            alt="Three steps to set up your security"
            url={securityStepsDiagram}
          />

          <EuiSpacer size="l" />

          <EuiSteps steps={setOfSteps} />
        </EuiPanel>

        <EuiSpacer size="l" />

        <EuiPanel paddingSize="l">
          <EuiTitle size="s">
            <h3>Optional: Configure audit logs</h3>
          </EuiTitle>
          <EuiText size="s" color="subdued">
            <p>
              <FormattedMessage
                id="audit.logs.introduction"
                defaultMessage="Audit logs let you track user access to your Elasticsearch cluster and are useful for compliance purposes."
              />{' '}
              <ExternalLink href={DocLinks.AuditLogsDoc} />
            </p>
            <EuiButton
              data-test-subj="review-audit-log-configuration"
              fill
              onClick={() => {
                window.location.href = buildHashUrl(ResourceType.auditLogging);
              }}
            >
              Review Audit Log Configuration
            </EuiButton>
          </EuiText>
        </EuiPanel>
      </div>
    </>
  );
}
