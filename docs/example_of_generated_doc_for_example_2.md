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
    - [Event Buses](#event-buses)
    - [AWS Event Rule Information](#aws-event-rule-information)
        - [Rules List](#rules-list)
        - [EventBusRule](#eventbusrule)
            - [Rule Details](#rule-details)
            - [Rule Pattern](#rule-pattern)
            - [Rule Targets](#rule-targets)
    - [AWS Step Function Information](#aws-step-function-information)
        - [StepFunction](#stepfunction)
            - [State Machine States](#state-machine-states)
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

| Amount | Resource Type                    |
|--------|----------------------------------|
| 1      | AWS::Events::EventBus            |
| 1      | AWS::Events::Rule                |
| 1      | AWS::IAM::Role                   |
| 1      | AWS::StepFunctions::StateMachine |

## Main AWS Resources Overview (Diagram Representation)

| Type                             | Name         |
|----------------------------------|--------------|
| AWS::Events::EventBus            | EventBus     |
| AWS::Events::Rule                | EventBusRule |
| AWS::StepFunctions::StateMachine | StepFunction |

## Event Buses

- EventBus

## AWS Event Rule Information

### Rules List

| Rule Name    | Rule State |
|--------------|------------|
| EventBusRule |            |

### EventBusRule

#### Rule Details

| Name         | Parent Event Bus | State | Target |
|--------------|------------------|-------|--------|
| EventBusRule | EventBus         |       |        |

#### Rule Pattern

```json
{
    "source": [
        "aws.ec2"
    ],
    "detail-type": [
        "EC2 Instance State-change Notification"
    ]
}
```

#### Rule Targets

| Type | Name | DLQ | SQS Params |
|------|------|-----|------------|
|      |      |     |            |

## AWS Step Function Information

### StepFunction

#### State Machine States

| StateID | StateType | Resource         | Next | Order | Retry | Catch |
|---------|-----------|------------------|------|-------|-------|-------|
| MyTask  | Task      | mylambdafunction |      | First | []    | []    |

[StepFunction diagram](TODO:)

# This is a custom markdown

Here is additional information about project/repository