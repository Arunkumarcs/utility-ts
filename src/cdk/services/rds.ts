/**
 * AWS CDK RDS Utilities
 */

import { Stack, Duration } from "aws-cdk-lib";
import * as rds from "aws-cdk-lib/aws-rds";
import * as ec2 from "aws-cdk-lib/aws-ec2";
import * as secretsmanager from "aws-cdk-lib/aws-secretsmanager";
import { generateResourceName } from "../naming";

/**
 * Creates an RDS database instance
 * @param stack - The stack
 * @param instanceName - Name of the instance
 * @param vpc - The VPC
 * @param options - Database instance options
 * @returns The created database instance
 * @example
 * const db = createRdsInstance(stack, 'my-db', vpc, {
 *   engine: rds.DatabaseInstanceEngine.postgres({ version: rds.PostgresEngineVersion.VER_14 }),
 *   instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO)
 * })
 */
export function createRdsInstance(
  stack: Stack,
  instanceName: string,
  vpc: ec2.IVpc,
  options: {
    engine: rds.IInstanceEngine;
    instanceType: ec2.InstanceType;
    databaseName?: string;
    credentials?: rds.Credentials;
    allocatedStorage?: number;
    maxAllocatedStorage?: number;
    multiAz?: boolean;
    deletionProtection?: boolean;
    backupRetention?: Duration;
  }
): rds.DatabaseInstance {
  const instanceId = generateResourceName({
    stack,
    resourceType: "rds",
    resourceName: instanceName,
  });

  return new rds.DatabaseInstance(stack, instanceId, {
    engine: options.engine,
    instanceType: options.instanceType,
    vpc,
    databaseName: options.databaseName,
    credentials: options.credentials,
    allocatedStorage: options.allocatedStorage || 20,
    maxAllocatedStorage: options.maxAllocatedStorage,
    multiAz: options.multiAz || false,
    deletionProtection: options.deletionProtection || false,
    backupRetention: options.backupRetention || Duration.days(7),
  });
}

/**
 * Creates a PostgreSQL RDS instance
 * @param stack - The stack
 * @param instanceName - Name of the instance
 * @param vpc - The VPC
 * @param options - Database instance options
 * @returns The created database instance
 * @example
 * const db = createPostgresInstance(stack, 'my-postgres', vpc, {
 *   instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
 *   databaseName: 'mydb'
 * })
 */
export function createPostgresInstance(
  stack: Stack,
  instanceName: string,
  vpc: ec2.IVpc,
  options: {
    instanceType: ec2.InstanceType;
    databaseName?: string;
    credentials?: rds.Credentials;
    allocatedStorage?: number;
    maxAllocatedStorage?: number;
    multiAz?: boolean;
    version?: rds.PostgresEngineVersion;
  }
): rds.DatabaseInstance {
  return createRdsInstance(stack, instanceName, vpc, {
    engine: rds.DatabaseInstanceEngine.postgres({
      version: options.version || rds.PostgresEngineVersion.VER_14,
    }),
    instanceType: options.instanceType,
    databaseName: options.databaseName,
    credentials: options.credentials,
    allocatedStorage: options.allocatedStorage,
    maxAllocatedStorage: options.maxAllocatedStorage,
    multiAz: options.multiAz,
  });
}

/**
 * Creates a MySQL RDS instance
 * @param stack - The stack
 * @param instanceName - Name of the instance
 * @param vpc - The VPC
 * @param options - Database instance options
 * @returns The created database instance
 * @example
 * const db = createMysqlInstance(stack, 'my-mysql', vpc, {
 *   instanceType: ec2.InstanceType.of(ec2.InstanceClass.T3, ec2.InstanceSize.MICRO),
 *   databaseName: 'mydb'
 * })
 */
export function createMysqlInstance(
  stack: Stack,
  instanceName: string,
  vpc: ec2.IVpc,
  options: {
    instanceType: ec2.InstanceType;
    databaseName?: string;
    credentials?: rds.Credentials;
    allocatedStorage?: number;
    maxAllocatedStorage?: number;
    multiAz?: boolean;
    version?: rds.MysqlEngineVersion;
  }
): rds.DatabaseInstance {
  return createRdsInstance(stack, instanceName, vpc, {
    engine: rds.DatabaseInstanceEngine.mysql({
      version: options.version || rds.MysqlEngineVersion.VER_8_0,
    }),
    instanceType: options.instanceType,
    databaseName: options.databaseName,
    credentials: options.credentials,
    allocatedStorage: options.allocatedStorage,
    maxAllocatedStorage: options.maxAllocatedStorage,
    multiAz: options.multiAz,
  });
}

/**
 * Creates database credentials from Secrets Manager
 * @param stack - The stack
 * @param secretName - Name of the secret
 * @param username - Database username
 * @returns The credentials
 * @example
 * const credentials = createDbCredentialsFromSecret(stack, 'db-credentials', 'admin')
 */
export function createDbCredentialsFromSecret(
  stack: Stack,
  secretName: string,
  username: string
): rds.Credentials {
  const secret = secretsmanager.Secret.fromSecretNameV2(
    stack,
    `Secret-${secretName}`,
    secretName
  );
  return rds.Credentials.fromSecret(secret, username);
}

