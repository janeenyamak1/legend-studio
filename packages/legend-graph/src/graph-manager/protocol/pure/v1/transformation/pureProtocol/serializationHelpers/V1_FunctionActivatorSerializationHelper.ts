/**
 * Copyright (c) 2020-present, Goldman Sachs
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {
  usingConstantValueSchema,
  usingModelSchema,
  type PlainObject,
  UnsupportedOperationError,
} from '@finos/legend-shared';
import { V1_SnowflakeAppDeploymentConfiguration } from '../../../engine/functionActivator/V1_SnowflakeAppDeploymentConfiguration.js';
import {
  createModelSchema,
  deserialize,
  list,
  primitive,
  serialize,
} from 'serializr';
import { V1_connectionPointerModelSchema } from './V1_ConnectionSerializationHelper.js';
import { V1_RestServiceDeploymentConfiguration } from '../../../engine/functionActivator/V1_RestServiceDeploymentConfiguration.js';
import {
  V1_DeploymentOwnership,
  V1_UserListOwnership,
  type V1_RestServiceOwnership,
} from '../../../model/packageableElements/function/V1_RestServiceOwnership.js';

const V1_SNOWFLAKE_APP_DEPLOYMENT_CONFIGURATION_APP_TYPE =
  'snowflakeDeploymentConfiguration';
const V1_REST_SERVICE_DEPLOYMENT_CONFIGURATION_APP_TYPE =
  'hostedServiceDeploymentConfiguration';

export const V1_SnowflakeAppDeploymentConfigurationAppModelSchema =
  createModelSchema(V1_SnowflakeAppDeploymentConfiguration, {
    _type: usingConstantValueSchema(
      V1_SNOWFLAKE_APP_DEPLOYMENT_CONFIGURATION_APP_TYPE,
    ),
    activationConnection: usingModelSchema(V1_connectionPointerModelSchema),
  });

export const V1_RestServiceDeploymentConfigurationAppModelSchema =
  createModelSchema(V1_RestServiceDeploymentConfiguration, {
    _type: usingConstantValueSchema(
      V1_REST_SERVICE_DEPLOYMENT_CONFIGURATION_APP_TYPE,
    ),
    host: primitive(),
    port: primitive(),
    path: primitive(),
  });

enum V1_RestServiceOwnershipType {
  DEPLOYMENT_OWNERSHIP = 'deployment',
  USERLIST_OWNERSHIP = 'userList',
}

const deploymentOwnershipSchema = createModelSchema(V1_DeploymentOwnership, {
  _type: usingConstantValueSchema(
    V1_RestServiceOwnershipType.DEPLOYMENT_OWNERSHIP,
  ),
  identifier: primitive(),
});

const userListOwnershipSchema = createModelSchema(V1_UserListOwnership, {
  _type: usingConstantValueSchema(
    V1_RestServiceOwnershipType.USERLIST_OWNERSHIP,
  ),
  users: list(primitive()),
});

export const V1_serializeRestServiceOwnership = (
  protocol: V1_RestServiceOwnership,
): PlainObject<V1_RestServiceOwnership> => {
  if (protocol instanceof V1_DeploymentOwnership) {
    return serialize(deploymentOwnershipSchema, protocol);
  } else if (protocol instanceof V1_UserListOwnership) {
    return serialize(userListOwnershipSchema, protocol);
  }
  throw new UnsupportedOperationError(
    `Can't serialize rest service ownership`,
    protocol,
  );
};

export const V1_deserializeRestServiceOwnership = (
  json: PlainObject<V1_RestServiceOwnership>,
): V1_RestServiceOwnership => {
  switch (json._type) {
    case V1_RestServiceOwnershipType.DEPLOYMENT_OWNERSHIP:
      return deserialize(deploymentOwnershipSchema, json);
    case V1_RestServiceOwnershipType.USERLIST_OWNERSHIP:
      return deserialize(userListOwnershipSchema, json);
    default:
      throw new UnsupportedOperationError(
        `Can't deserialize rest service ownership of type '${json._type}'`,
      );
  }
};
