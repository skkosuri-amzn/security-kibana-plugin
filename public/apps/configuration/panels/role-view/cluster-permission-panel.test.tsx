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

import React from 'react';
import { shallow } from 'enzyme';
import { ClusterPermissionPanel } from './cluster-permission-panel';
import { EuiButton, EuiEmptyPrompt } from '@elastic/eui';
import { PermissionTree } from '../permission-tree';

describe('Role view - cluster permission panel', () => {
  const sampleRole = 'role';
  const sampleClusterPermission = ['sampleClusterPermission'];

  it('no cluster permission', () => {
    const component = shallow(
      <ClusterPermissionPanel
        roleName={sampleRole}
        clusterPermissions={[]}
        actionGroups={{}}
        loading={false}
        isReserved={false}
      />
    );
    expect(component.find(EuiEmptyPrompt).length).toBe(1);
  });

  it('Add cluster permission button is disabled for reserved role', () => {
    const wrapper = shallow(
      <ClusterPermissionPanel
        roleName={sampleRole}
        clusterPermissions={[]}
        actionGroups={{}}
        loading={false}
        isReserved={true}
      />
    );
    const prompt = wrapper.find(EuiEmptyPrompt).dive();
    expect(prompt.find(EuiButton)).toHaveLength(1);
    const button = prompt.find('[data-test-subj="addClusterPermission"]');
    expect(button.prop('disabled')).toBe(true);
  });

  it('with cluster permission', () => {
    const component = shallow(
      <ClusterPermissionPanel
        roleName={sampleRole}
        clusterPermissions={sampleClusterPermission}
        actionGroups={{}}
        loading={false}
        isReserved={false}
      />
    );
    expect(component.find(PermissionTree).length).toBe(1);
    expect(component.find(PermissionTree).prop('permissions')).toBe(sampleClusterPermission);
  });
});
