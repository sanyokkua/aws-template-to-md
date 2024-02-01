# Example of App

![Tag 1](https://picsum.photos/50/20)
![Tag 2](https://picsum.photos/50/20)
![Tag 3](https://picsum.photos/50/20)

## Repository Short Description

This is a Sample

## Table Of Content

- [Example of App](#example-of-app)
    - [Repository Short Description](#repository-short-description)
    - [Repository Maintainers](#repository-maintainers)
    - [Essential Repository Information](#essential-repository-information)
    - [Artifact Environments](#artifact-environments)
    - [Artifact Design](#artifact-design)
    - [Related Projects](#related-projects)
    - [AWS Resources Overview](#aws-resources-overview)
    - [Main AWS Resources Overview (Diagram Representation)](#main-aws-resources-overview-(diagram-representation))
    - [AWS Api Gateway Information](#aws-api-gateway-information)
        - [ApiGateway](#apigateway)
            - [Useful Links](#useful-links)
    - [AWS DynamoDB Information](#aws-dynamodb-information)
        - [DynamoDBTable - Keys](#dynamodbtable---keys)
    - [AWS Lambda Information](#aws-lambda-information)
    - [AWS SQS Information](#aws-sqs-information)
    - [AWS SNS Information](#aws-sns-information)
        - [SNSTopic](#snstopic)
- [This is a custom markdown](#this-is-a-custom-markdown)

## Repository Maintainers

| Name         | Link                                       | Email            |
|--------------|--------------------------------------------|------------------|
| Maintainer 1 | [https://example.com](https://example.com) | example@mail.com |
| Maintainer 2 | [https://example.com](https://example.com) | example@mail.com |

## Essential Repository Information

- Branching strategy: [link to description](https://example.com)
- Main programming language: [Typescript](https://www.typescriptlang.org/docs/handbook/typescript-in-5-minutes.html)
- Artifact is deployed to: **AWS**
- Infrastructure Definition Technology:  [CDK](https://docs.aws.amazon.com/cdk/v2/guide/home.html)
- CI/CD Tool: [Jenkins](https://www.jenkins.io/doc/)
- CI/CD Build Pipeline Page: [link](https://example.com)
- CI/CD Deployment Pipeline Page: [link](https://example.com)
- Cloud Forge page: [link](https://example.com)

## Artifact Environments

| Name        | Description | Account ID                       |
|-------------|-------------|----------------------------------|
| Production  | Production  | [111111111](https://example.com) |
| Development | Development | [2222222](https://example.com)   |
| Staging     | Staging     | [3333333](https://example.com)   |

## Artifact Design

By the following [link](https://picsum.photos/200/100) can be found diagram of the whole solution.

![Diagram of the current artifact](https://picsum.photos/200/100)

## Related Projects

- [Project 1](https://example.com)
- [Project 2](https://example.com)

## AWS Resources Overview

| Amount | Resource Type            |
|--------|--------------------------|
| 1      | AWS::ApiGateway::RestApi |
| 1      | AWS::DynamoDB::Table     |
| 1      | AWS::Lambda::Function    |
| 1      | AWS::SNS::Topic          |
| 1      | AWS::SQS::Queue          |

## Main AWS Resources Overview (Diagram Representation)

| Type                     | Name           |
|--------------------------|----------------|
| AWS::ApiGateway::RestApi | ApiGateway     |
| AWS::DynamoDB::Table     | DynamoDBTable  |
| AWS::Lambda::Function    | LambdaFunction |
| AWS::SNS::Topic          | SNSTopic       |
| AWS::SQS::Queue          | SQSQueue       |

## AWS Api Gateway Information

### ApiGateway

#### Useful Links

- [Open API Specification](TODO)
- [API Gateway Usage Instruction](TODO)
- [Postman Collection](TODO)
- [Postman Collection Secrets](TODO)

## AWS DynamoDB Information

### DynamoDBTable - Keys

| Field Name | Value Type | Key Type | Local Secondary Indexes | Global Secondary Indexes | Key Role      |
|------------|------------|----------|-------------------------|--------------------------|---------------|
| ID         | Number     | HASH     |                         |                          | Partition Key |

<details>
<summary>
Record Example
</summary>
TODO:
</details>

## AWS Lambda Information

| Name           | Arch   | Runtime    | Timeout (Sec) | RAM (Mb) | /tmp Size (Mb) | Tracing | Env Vars |
|----------------|--------|------------|---------------|----------|----------------|---------|----------|
| LambdaFunction | x86_64 | nodejs14.x | 3             | 128      | 512            |         |          |

## AWS SQS Information

| Name     | Fifo | Deduplication | Delay (Sec) | Retention Period (Sec) | Visibility Timeout (Sec) |
|----------|------|---------------|-------------|------------------------|--------------------------|
| SQSQueue | No   | Disabled      | 0           | 345600                 | 30                       |

## AWS SNS Information

### SNSTopic

# This is a custom markdown

Here is additional information about project/repository