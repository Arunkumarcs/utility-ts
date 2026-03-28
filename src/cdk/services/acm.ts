/**
 * AWS CDK ACM (Certificate Manager) Utilities
 */

import { Stack } from "aws-cdk-lib";
import * as acm from "aws-cdk-lib/aws-certificatemanager";
import * as route53 from "aws-cdk-lib/aws-route53";
import { generateResourceName } from "../naming";

/**
 * Creates an ACM certificate
 * @param stack - The stack
 * @param certificateName - Name of the certificate
 * @param domainName - Domain name for the certificate
 * @param options - Certificate options
 * @returns The created certificate
 * @example
 * const cert = createCertificate(stack, 'my-cert', 'example.com', {
 *   subjectAlternativeNames: ['*.example.com']
 * })
 */
export function createCertificate(
  stack: Stack,
  certificateName: string,
  domainName: string,
  options?: {
    subjectAlternativeNames?: string[];
    validation?: acm.CertificateValidation;
    hostedZone?: route53.IHostedZone;
  }
): acm.Certificate {
  const certId = generateResourceName({
    stack,
    resourceType: "cert",
    resourceName: certificateName,
  });

  let validation: acm.CertificateValidation | undefined;

  // If hosted zone is provided, use DNS validation
  if (options?.hostedZone) {
    validation = acm.CertificateValidation.fromDns(options.hostedZone);
  } else if (options?.validation) {
    validation = options.validation;
  } else {
    // Default to email validation
    validation = acm.CertificateValidation.fromEmail();
  }

  const certProps: acm.CertificateProps = {
    domainName,
    subjectAlternativeNames: options?.subjectAlternativeNames,
    validation,
  };

  return new acm.Certificate(stack, certId, certProps);
}

/**
 * Creates an ACM certificate with DNS validation
 * @param stack - The stack
 * @param certificateName - Name of the certificate
 * @param domainName - Domain name for the certificate
 * @param hostedZone - Route53 hosted zone
 * @param subjectAlternativeNames - Additional domain names
 * @returns The created certificate
 * @example
 * const cert = createCertificateWithDnsValidation(stack, 'my-cert', 'example.com', hostedZone, ['*.example.com'])
 */
export function createCertificateWithDnsValidation(
  stack: Stack,
  certificateName: string,
  domainName: string,
  hostedZone: route53.IHostedZone,
  subjectAlternativeNames?: string[]
): acm.Certificate {
  return createCertificate(stack, certificateName, domainName, {
    subjectAlternativeNames,
    validation: acm.CertificateValidation.fromDns(hostedZone),
    hostedZone,
  });
}

/**
 * Creates an ACM certificate with email validation
 * @param stack - The stack
 * @param certificateName - Name of the certificate
 * @param domainName - Domain name for the certificate
 * @param subjectAlternativeNames - Additional domain names
 * @returns The created certificate
 * @example
 * const cert = createCertificateWithEmailValidation(stack, 'my-cert', 'example.com', ['*.example.com'])
 */
export function createCertificateWithEmailValidation(
  stack: Stack,
  certificateName: string,
  domainName: string,
  subjectAlternativeNames?: string[]
): acm.Certificate {
  return createCertificate(stack, certificateName, domainName, {
    subjectAlternativeNames,
    validation: acm.CertificateValidation.fromEmail(),
  });
}

/**
 * Gets an existing ACM certificate by ARN
 * @param stack - The stack
 * @param certificateArn - ARN of the certificate
 * @returns The certificate reference
 * @example
 * const cert = getCertificateByArn(stack, 'arn:aws:acm:region:account:certificate/cert-id')
 */
export function getCertificateByArn(
  stack: Stack,
  certificateArn: string
): acm.ICertificate {
  return acm.Certificate.fromCertificateArn(stack, "ImportedCert", certificateArn);
}

