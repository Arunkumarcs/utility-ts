# utility-ts

A comprehensive TypeScript utility library for AWS CDK, Lambda functions, and general development tasks.

## Installation

```bash
npm install utility-ts
# or
pnpm add utility-ts
# or
yarn add utility-ts
```

## Features

- **AWS CDK Utilities**: Helper functions for CDK stack management, naming, tagging, and all AWS services
- **Lambda Utilities**: Functions for working with API Gateway events and Lambda contexts
- **Middy Middleware**: Zod validation middleware for Middy handlers
- **Zod Utilities**: Schema validation and transformation utilities
- **Powertools Utilities**: Logger, Tracer, and Metrics utilities (Powertools-style)
- **General Utilities**: Process, file system, date, string, array, object, and more utilities

## Quick Start

### AWS CDK Utilities

```typescript
import { createLambdaFunction, createDynamoTable, generateResourceName } from 'utility-ts';
import { Stack } from 'aws-cdk-lib';
import * as dynamodb from 'aws-cdk-lib/aws-dynamodb';

const stack = new Stack(app, 'MyStack');

// Create Lambda function
const lambda = createLambdaFunction({
  stack,
  functionName: 'my-function',
  codePath: './lambda',
  handler: 'index.handler',
  runtime: lambda.Runtime.NODEJS_18_X
});

// Create DynamoDB table
const table = createDynamoTable({
  stack,
  tableName: 'users',
  partitionKey: { name: 'id', type: dynamodb.AttributeType.STRING },
  billingMode: dynamodb.BillingMode.PAY_PER_REQUEST
});
```

### Lambda Function Utilities

```typescript
import { getEventBody, getQueryParam, createSuccessResponse } from 'utility-ts';

export const handler = async (event, context) => {
  // Get request body
  const body = getEventBody(event);
  
  // Get query parameter
  const page = getQueryParam(event, 'page', '1');
  
  // Create response
  return createSuccessResponse({ message: 'Success', page });
};
```

### Middy with Zod Validation

```typescript
import { zodMiddleware, validateBody } from 'utility-ts';
import { z } from 'zod';
import middy from '@middy/core';

const bodySchema = z.object({
  name: z.string(),
  age: z.number().min(0).max(120)
});

export const handler = middy(async (event) => {
  const body = event.validatedBody; // Already validated!
  return createSuccessResponse({ message: `Hello ${body.name}` });
}).use(validateBody(bodySchema));
```

### Powertools-Style Utilities

```typescript
import { createPowertoolsLogger, createPowertoolsTracer, createPowertoolsMetrics } from 'utility-ts';

const logger = createPowertoolsLogger({ serviceName: 'my-service' });
const tracer = createPowertoolsTracer('my-service');
const metrics = createPowertoolsMetrics('my-service', 'MyApp');

export const handler = async (event, context) => {
  logger.info('Processing request', { userId: '123' });
  
  await tracer.trace('process-data', async () => {
    // Your code here
  });
  
  metrics.increment('requests');
  metrics.recordDuration('processing-time', 150);
  metrics.publishMetrics();
};
```

## Module Overview

### CDK Utilities (`utility-ts/cdk`)

Comprehensive utilities for all AWS services:

- **Core**: Stack management, naming, tagging, environment detection
- **Services**: Lambda, SNS, SQS, DynamoDB, API Gateway, S3, IAM, EventBridge, CloudWatch, VPC, Step Functions, KMS, Secrets Manager, SSM, CloudFront, ACM, Route53, ECR, Cognito, ECS, RDS

```typescript
import { 
  createLambdaFunction,
  createSnsTopic,
  createSqsQueue,
  createDynamoTable,
  createApiGateway,
  createS3Bucket
} from 'utility-ts';
```

### Lambda Utilities (`utility-ts/utils/lambda-utils`)

Helper functions for Lambda function development:

```typescript
import {
  getEventBody,
  getQueryParam,
  getPathParam,
  getHeader,
  createSuccessResponse,
  createErrorResponse,
  getCognitoUser
} from 'utility-ts';
```

### Middy Utilities (`utility-ts/middy`)

Middy middleware and handlers:

```typescript
import {
  zodMiddleware,
  validateBody,
  validateQuery,
  validatePath,
  withErrorHandling,
  withLogging
} from 'utility-ts';
```

### Zod Utilities (`utility-ts/utils/zod-utils`)

Schema validation utilities:

```typescript
import {
  createValidator,
  createSafeValidator,
  formatZodError,
  mergeSchemas
} from 'utility-ts';
```

### General Utilities (`utility-ts/utils`)

Comprehensive utility functions:

- **Process**: Process management, environment variables
- **Child Process**: Command execution, process spawning
- **Cluster**: Node.js cluster management, worker pools
- **CLI**: Command-line argument parsing, progress bars, spinners
- **Events**: EventEmitter utilities, debouncing, throttling
- **File System**: File operations, directory management
- **Date**: Date formatting, manipulation, timezone
- **String**: String manipulation, formatting, validation
- **Array**: Array operations, transformations
- **Object**: Object manipulation, deep operations
- **Promise**: Promise utilities, retry, timeout
- **HTTP**: HTTP request helpers
- **Query String**: Query string parsing, building, validation
- **Crypto**: Hashing, encryption utilities
- **Validation**: Data validation functions
- **Network**: Network utilities, port checking
- **Stream**: Stream processing
- **Compression**: Gzip, deflate compression
- **Timers**: Timer utilities, debounce, throttle, rate limiting
- **Performance Hooks**: Performance measurement, timing, metrics
- **Worker Threads**: Worker thread management, pools, message passing
- **TypeScript**: Type guards, assertions, type-safe helpers
- **And many more...**

## Documentation

- [Architecture Documentation](./docs/architecture.md)
- [Contributing Guide](./docs/contributing.md)
- [Onboarding Guide](./docs/onboarding.md)

## Development

### Prerequisites

- Node.js >= 14.0.0
- pnpm (recommended) or npm

### Setup

```bash
pnpm install
```

### Build

```bash
pnpm run build
```

### Watch Mode

```bash
pnpm run build:watch
```

### Clean

```bash
pnpm run clean
```

## TypeScript Support

This library is written in TypeScript and provides full type definitions. All functions are fully typed with JSDoc documentation.

## License

MIT

## Author

Arunkumarcs
