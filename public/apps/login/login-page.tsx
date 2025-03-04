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

// @ts-ignore : Component not used
import React, { Component, useState } from 'react';
import {
  EuiText,
  EuiFieldText,
  EuiIcon,
  EuiSpacer,
  EuiButton,
  EuiImage,
  EuiListGroup,
  // @ts-ignore
  EuiForm,
  EuiFormRow,
} from '@elastic/eui';
import { CoreStart } from '../../../../../src/core/public';
import { ClientConfigType } from '../../types';
import defaultBrandImage from '../../assets/open_distro_for_elasticsearch_logo_h.svg';
import { SELECT_TENANT_PAGE_URI } from '../../../common';

interface LoginPageDeps {
  http: CoreStart['http'];
  config: ClientConfigType['ui']['basicauth']['login'];
}

export function LoginPage(props: LoginPageDeps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [loginFailed, setloginFailed] = useState(false);
  const [usernameValidationFailed, setUsernameValidationFailed] = useState(false);
  const [passwordValidationFailed, setPasswordValidationFailed] = useState(false);

  let errorLabel = null;
  if (loginFailed) {
    errorLabel = (
      <EuiText id="error" color="danger" textAlign="center">
        <b>Invalid username or password, please try again</b>
      </EuiText>
    );
  }

  // @ts-ignore : Parameter 'e' implicitly has an 'any' type.
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Clear errors
    setloginFailed(false);
    setUsernameValidationFailed(false);
    setPasswordValidationFailed(false);

    // Form validation
    if (username === '') {
      setUsernameValidationFailed(true);
      return;
    }

    if (password === '') {
      setPasswordValidationFailed(true);
      return;
    }

    try {
      // @ts-ignore : response not used
      const response = await props.http.post('/auth/login', {
        body: JSON.stringify({
          username,
          password,
        }),
      });
      // Forward search to keep nextUrl argument
      window.location.href =
        props.http.basePath.serverBasePath + SELECT_TENANT_PAGE_URI + window.location.search;
    } catch (error) {
      console.log(error);
      setloginFailed(true);
      return;
    }
  };

  // TODO: Get brand image from server config
  return (
    <EuiListGroup className="login-wrapper">
      {props.config.showbrandimage && (
        <EuiImage alt="" url={props.config.brandimage || defaultBrandImage} />
      )}
      <EuiSpacer size="s" />
      <EuiText size="m" textAlign="center">
        {props.config.title || 'Please login to Kibana'}
      </EuiText>
      <EuiSpacer size="s" />
      <EuiText size="s" textAlign="center">
        {props.config.subtitle ||
          'If you have forgotten your username or password, please ask your system administrator'}
      </EuiText>
      <EuiSpacer size="s" />
      <EuiForm component="form">
        <EuiFormRow>
          <EuiFieldText
            placeholder="Username"
            prepend={<EuiIcon type="user" />}
            onChange={(e) => setUsername(e.target.value)}
            value={username}
            isInvalid={usernameValidationFailed}
          />
        </EuiFormRow>
        <EuiFormRow isInvalid={passwordValidationFailed}>
          <EuiFieldText
            placeholder="Password"
            prepend={<EuiIcon type="lock" />}
            type="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
            isInvalid={usernameValidationFailed}
          />
        </EuiFormRow>
        <EuiFormRow>
          <EuiButton
            fill
            size="s"
            type="submit"
            className={props.config.buttonstyle || 'btn-login'}
            onClick={handleSubmit}
          >
            Log In
          </EuiButton>
        </EuiFormRow>
        {errorLabel}
      </EuiForm>
    </EuiListGroup>
  );
}
