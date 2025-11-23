/**
 * AWS CDK Cognito Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as cognito from "aws-cdk-lib/aws-cognito";
import { generateResourceName } from "../naming";

/**
 * Creates a Cognito User Pool
 * @param stack - The stack
 * @param userPoolName - Name of the user pool
 * @param options - User pool options
 * @returns The created user pool
 * @example
 * const userPool = createUserPool(stack, 'my-user-pool', {
 *   signInAliases: { email: true },
 *   passwordPolicy: { minLength: 8 }
 * })
 */
export function createUserPool(
  stack: Stack,
  userPoolName: string,
  options?: {
    signInAliases?: cognito.SignInAliases;
    passwordPolicy?: cognito.PasswordPolicy;
    selfSignUpEnabled?: boolean;
    userVerification?: {
      emailSubject?: string;
      emailBody?: string;
    };
  }
): cognito.UserPool {
  const userPoolId = generateResourceName({
    stack,
    resourceType: "userpool",
    resourceName: userPoolName,
  });

  return new cognito.UserPool(stack, userPoolId, {
    userPoolName: userPoolId,
    signInAliases: options?.signInAliases || { email: true },
    selfSignUpEnabled: options?.selfSignUpEnabled !== false,
    passwordPolicy: options?.passwordPolicy || {
      minLength: 8,
      requireLowercase: true,
      requireUppercase: true,
      requireDigits: true,
      requireSymbols: false,
    },
    userVerification: options?.userVerification
      ? {
          emailSubject: options.userVerification.emailSubject,
          emailBody: options.userVerification.emailBody,
        }
      : undefined,
  });
}

/**
 * Creates a Cognito User Pool Client
 * @param userPool - The user pool
 * @param clientName - Name of the client
 * @param options - Client options
 * @returns The created user pool client
 * @example
 * const client = createUserPoolClient(userPool, 'web-client', {
 *   generateSecret: false,
 *   oAuth: { flows: { authorizationCodeGrant: true } }
 * })
 */
export function createUserPoolClient(
  userPool: cognito.IUserPool,
  clientName: string,
  options?: {
    generateSecret?: boolean;
    oAuth?: {
      flows: cognito.OAuthFlows;
      scopes: cognito.OAuthScope[];
      callbackUrls?: string[];
      logoutUrls?: string[];
    };
  }
): cognito.UserPoolClient {
  return userPool.addClient(clientName, {
    generateSecret: options?.generateSecret !== false,
    oAuth: options?.oAuth
      ? {
          flows: options.oAuth.flows,
          scopes: options.oAuth.scopes,
          callbackUrls: options.oAuth.callbackUrls,
          logoutUrls: options.oAuth.logoutUrls,
        }
      : undefined,
  });
}

/**
 * Creates a Cognito Identity Pool
 * @param stack - The stack
 * @param identityPoolName - Name of the identity pool
 * @param userPool - The user pool
 * @param userPoolClient - The user pool client
 * @returns The created identity pool
 * @example
 * const identityPool = createIdentityPool(stack, 'my-identity-pool', userPool, client)
 */
export function createIdentityPool(
  stack: Stack,
  identityPoolName: string,
  userPool: cognito.IUserPool,
  userPoolClient: cognito.IUserPoolClient
): cognito.CfnIdentityPool {
  const identityPoolId = generateResourceName({
    stack,
    resourceType: "identitypool",
    resourceName: identityPoolName,
  });

  return new cognito.CfnIdentityPool(stack, identityPoolId, {
    identityPoolName: identityPoolId,
    allowUnauthenticatedIdentities: false,
    cognitoIdentityProviders: [
      {
        clientId: userPoolClient.userPoolClientId,
        providerName: userPool.userPoolProviderName,
      },
    ],
  });
}

