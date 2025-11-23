# utility-ts Architecture

**Last Updated:** 2025-11-23
**Version:** 1.0.0
**Authors:** Arunkumarcs

## Overview

utility-ts is a TypeScript utility library designed to provide reusable helper functions for common development tasks, with a primary focus on AWS CDK (Cloud Development Kit) utilities. The library is structured as a modular, tree-shakeable package that can be easily integrated into TypeScript projects.

## System Context

utility-ts is a standalone library that operates independently and can be consumed by any TypeScript project. It integrates with:

- **AWS CDK**: Provides utilities for CDK stack management, naming conventions, tagging, and environment detection
- **TypeScript Projects**: Can be imported and used in any TypeScript/JavaScript project
- **Package Managers**: Distributed via npm/pnpm/yarn

## Goals and Non-Goals

### Goals

- Provide reusable utility functions for common TypeScript development tasks
- Offer comprehensive AWS CDK helper functions to reduce boilerplate code
- Maintain a modular architecture for easy tree-shaking and selective imports
- Ensure type safety with full TypeScript support
- Follow best practices for library design and API consistency

### Non-Goals

- Not a framework or application runtime
- Does not provide AWS service implementations (only CDK utilities)
- Does not include testing utilities (focus on runtime utilities)
- Does not provide CLI tools or executables

## High-Level Design

The library is organized into logical modules, each containing related utility functions:

```
utility-ts/
├── src/
│   ├── index.ts          # Main entry point
│   ├── utils/            # General utilities module
│   │   ├── index.ts      # Utils module entry point
│   │   ├── process-utils.ts
│   │   ├── fs-utils.ts
│   │   ├── date-utils.ts
│   │   ├── string-utils.ts
│   │   ├── array-utils.ts
│   │   ├── object-utils.ts
│   │   ├── promise-utils.ts
│   │   ├── http-utils.ts
│   │   ├── crypto-utils.ts
│   │   ├── validation-utils.ts
│   │   ├── lambda-utils.ts
│   │   ├── zod-utils.ts
│   │   ├── powertools-utils.ts
│   │   └── ... (30+ utility modules)
│   ├── cdk/              # AWS CDK utilities module
│   │   ├── index.ts      # CDK module entry point
│   │   ├── types.ts      # Type definitions
│   │   ├── naming.ts     # Naming utilities
│   │   ├── tags.ts       # Tagging utilities
│   │   ├── environment.ts # Environment detection
│   │   ├── context.ts    # Stack context utilities
│   │   ├── stack-info.ts # Stack metadata
│   │   ├── outputs.ts    # CloudFormation outputs
│   │   ├── stack.ts      # Stack utilities
│   │   └── services/     # Service-specific utilities
│   │       ├── lambda.ts
│   │       ├── sns.ts
│   │       ├── sqs.ts
│   │       ├── dynamodb.ts
│   │       └── ... (20+ service modules)
│   └── middy/            # Middy middleware utilities
│       ├── index.ts      # Middy module entry point
│       ├── types.ts      # Type definitions
│       ├── middleware.ts # Middleware functions
│       ├── handlers.ts    # Handler utilities
│       └── zod-middleware.ts # Zod validation middleware
└── dist/                 # Compiled output
```

## Detailed Design

### Core Components

#### Main Entry Point (`src/index.ts`)

**Responsibilities:**

- Re-export all public APIs from sub-modules
- Provide a single import point for consumers
- Maintain backward compatibility

**Interfaces:**

- Exports from `./utils`
- Exports from `./cdk`

**Dependencies:**

- Internal modules only

#### General Utilities Module (`src/utils/`)

**Responsibilities:**

- Provide comprehensive general-purpose utility functions
- Organize utilities by functional domain
- Support Lambda function development

**Key Modules:**

- **Process Utilities**: Process management, environment variables, platform info
- **File System Utilities**: File operations, directory management, JSON handling
- **Date Utilities**: Date formatting, manipulation, timezone operations
- **String Utilities**: String manipulation, formatting, case conversion
- **Array Utilities**: Array operations, transformations, filtering
- **Object Utilities**: Object manipulation, deep operations, path access
- **Promise Utilities**: Promise helpers, retry, timeout, concurrency control
- **HTTP Utilities**: HTTP request helpers, query string building
- **Crypto Utilities**: Hashing, encryption, token generation
- **Validation Utilities**: Data validation, schema validation
- **Lambda Utilities**: API Gateway event helpers, response builders
- **Zod Utilities**: Zod schema validation and transformation
- **Powertools Utilities**: Logger, Tracer, Metrics (Powertools-style)
- **Network Utilities**: Port checking, IP validation, URL parsing
- **Stream Utilities**: Stream processing and transformation
- **Compression Utilities**: Gzip, deflate compression
- **And 20+ more utility modules**

**Dependencies:**

- Node.js built-in modules
- `aws-lambda` types (for Lambda utilities)

#### CDK Utilities Module (`src/cdk/`)

**Responsibilities:**

- Provide AWS CDK-specific helper functions
- Organize utilities by functional area
- Maintain type safety for CDK constructs
- Support all major AWS services

**Interfaces:**

- **Types** (`types.ts`): Common interfaces and type definitions
- **Naming** (`naming.ts`): Stack and resource naming utilities
- **Tags** (`tags.ts`): Resource tagging utilities
- **Environment** (`environment.ts`): Environment detection and configuration
- **Context** (`context.ts`): Stack context management
- **Stack Info** (`stack-info.ts`): Stack metadata accessors
- **Outputs** (`outputs.ts`): CloudFormation output helpers
- **Stack** (`stack.ts`): StandardStack class with built-in utilities
- **Services** (`services/`): Service-specific utilities for:
  - Lambda, SNS, SQS, DynamoDB, API Gateway, S3, IAM, EventBridge
  - CloudWatch, VPC, Step Functions, KMS, Secrets Manager, SSM
  - CloudFront, ACM, Route53, ECR, Cognito, ECS, RDS

**Dependencies:**

- `aws-cdk-lib`: AWS CDK core library
- `constructs`: CDK constructs library

#### Middy Utilities Module (`src/middy/`)

**Responsibilities:**

- Provide Middy middleware functions
- Support Lambda handler development
- Integrate Zod validation

**Interfaces:**

- **Types** (`types.ts`): Middy type definitions
- **Middleware** (`middleware.ts`): Common middleware functions
- **Handlers** (`handlers.ts`): Handler wrapper utilities
- **Zod Middleware** (`zod-middleware.ts`): Zod schema validation middleware

**Dependencies:**

- `@types/aws-lambda`: AWS Lambda type definitions
- `zod`: Schema validation (peer dependency)

### Data Flow

As a utility library, utility-ts does not have a traditional data flow. Instead:

1. **Import**: Consumer imports desired utilities from the library
2. **Usage**: Consumer calls utility functions with appropriate parameters
3. **Return**: Functions return processed values or perform side effects (e.g., tagging)

### APIs and Interfaces

#### Public API

The library exposes a clean, modular API:

```typescript
// General utilities
import { 
  getEventBody, 
  createSuccessResponse,
  formatDate,
  chunk,
  deepClone
} from "utility-ts";

// CDK utilities - full import
import {
  generateStackName,
  applyDefaultTags,
  getEnvironment,
  createLambdaFunction,
  createDynamoTable
} from "utility-ts";

// Middy utilities
import { 
  zodMiddleware, 
  validateBody,
  withErrorHandling 
} from "utility-ts";

// Powertools utilities
import { 
  createPowertoolsLogger,
  createPowertoolsTracer 
} from "utility-ts";

// Module-specific imports (tree-shakeable)
import { generateStackName } from "utility-ts/cdk/naming";
import { getEventBody } from "utility-ts/utils/lambda-utils";
```

#### Type Definitions

All public types are exported for consumer use:

- `CommonTags` - Tag key-value pairs
- `StackNamingOptions` - Stack naming configuration
- `ResourceNamingOptions` - Resource naming configuration

## Technology Stack

### Core

- **Language:** TypeScript 5.3+
- **Module System:** CommonJS (compiled output)
- **Target:** ES2020

### Dependencies

**Runtime Dependencies:**
- **aws-cdk-lib:** ^2.100.0 - AWS CDK core library
- **constructs:** ^10.3.0 - CDK constructs library

**Peer Dependencies (Optional):**
- **zod:** For Zod validation utilities (install separately if needed)
- **@middy/core:** For Middy middleware (install separately if needed)

**Dev Dependencies:**
- **typescript:** ^5.3.3 - Type checking and compilation
- **@types/node:** ^20.10.0 - Node.js type definitions
- **@types/aws-lambda:** ^8.10.130 - AWS Lambda type definitions
- **@types/jest:** ^29.5.0 - Jest type definitions

### Development Tools

- **TypeScript:** ^5.3.3 - Type checking and compilation
- **pnpm:** Package manager
- **Node.js:** >=14.0.0

### Build System

- **TypeScript Compiler:** Direct compilation via `tsc`
- **Output:** CommonJS modules in `dist/` directory
- **Type Definitions:** Generated `.d.ts` files

## Security Considerations

### Package Security

- No runtime dependencies that execute code
- All dependencies are peer dependencies or dev dependencies where appropriate
- Regular dependency audits recommended

### Type Safety

- Full TypeScript type checking
- No `any` types in public APIs
- Strict mode enabled for compilation

### Data Handling

- Library does not handle sensitive data
- All functions are pure or operate on provided constructs
- No network calls or external service interactions

## Performance and Scalability

### Performance Requirements

- **Bundle Size:** Minimal impact through tree-shaking
- **Runtime Performance:** O(1) or O(n) operations only
- **Memory:** No persistent state or memory leaks

### Tree-Shaking Support

The modular structure enables effective tree-shaking:

- Each module can be imported independently
- Unused exports are eliminated by bundlers
- No side effects in module initialization

### Limitations

- Utility functions only - no caching or optimization layers
- Synchronous operations only
- No async utilities currently

## Reliability and Monitoring

### Error Handling

- Functions validate inputs where appropriate
- TypeScript provides compile-time type checking
- Runtime errors are passed through to consumers

### Testing Strategy

- Unit tests for all utility functions (recommended)
- Type checking via TypeScript compiler
- Integration tests with CDK stacks (recommended)

## Deployment and Operations

### Distribution

- Published to npm registry
- Versioned using semantic versioning
- Distribution includes:
  - Compiled JavaScript (`dist/*.js`)
  - Type definitions (`dist/*.d.ts`)
  - Source maps (`dist/*.js.map`)
  - README and LICENSE

### Version Management

- Semantic versioning (MAJOR.MINOR.PATCH)
- Breaking changes increment MAJOR version
- New features increment MINOR version
- Bug fixes increment PATCH version

### Development Workflow

1. **Development**: Make changes in `src/`
2. **Build**: Run `pnpm run build` to compile
3. **Test**: Run tests (when implemented)
4. **Version**: Update version in `package.json`
5. **Publish**: Run `pnpm publish` (runs prepublishOnly script)

## Alternative Designs Considered

### Alternative 1: Monolithic Single File

**Pros:**

- Simpler structure
- Single import point

**Cons:**

- No tree-shaking support
- Harder to maintain
- Larger bundle size

**Decision:** Modular structure chosen for better tree-shaking and maintainability

### Alternative 2: Separate Packages per Module

**Pros:**

- Maximum modularity
- Independent versioning

**Cons:**

- Complex dependency management
- Overhead for small utilities
- More packages to maintain

**Decision:** Single package with modular structure provides best balance

## Future Considerations

### Planned Improvements

- Implement comprehensive test suite
- Add CI/CD pipeline
- Create usage examples and guides
- Add more AWS service utilities (OpenSearch, Glue, SFTP Transfer Family)
- Expand Powertools utilities with full CloudWatch integration
- Add performance benchmarks

### Recent Additions

- ✅ Comprehensive general utilities (30+ modules)
- ✅ Full AWS CDK service utilities (20+ services)
- ✅ Lambda function utilities
- ✅ Middy middleware with Zod validation
- ✅ Powertools-style logger, tracer, and metrics
- ✅ Zod schema validation utilities
- ✅ All functions include JSDoc documentation with examples

### Long-term Vision

Become a comprehensive TypeScript utility library with:

- Broad coverage of common development tasks
- Extensive AWS CDK utilities
- Well-documented and tested APIs
- Active community contributions
- Regular updates and maintenance

## References and Resources

- [AWS CDK Documentation](https://docs.aws.amazon.com/cdk/)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/)
- [Semantic Versioning](https://semver.org/)

## Glossary

- **CDK**: Cloud Development Kit - AWS infrastructure as code framework
- **Stack**: A CDK unit of deployment containing AWS resources
- **Construct**: A CDK building block representing a cloud component
- **Tree-shaking**: Dead code elimination in bundlers
- **Type Definition**: TypeScript `.d.ts` files providing type information

---

_This document follows Google's documentation standards for architecture documentation._
