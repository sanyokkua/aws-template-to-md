import { CommonResource } from "./common_models";

// AWS::S3::Bucket
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucket.html
export interface AwsS3Bucket extends CommonResource {
    "Properties": {
        "AccelerateConfiguration": {
            "AccelerationStatus": string
        },
        "AccessControl": string,
        "BucketEncryption": {
            "ServerSideEncryptionConfiguration": {
                "BucketKeyEnabled": boolean,
                "ServerSideEncryptionByDefault": {
                    "KMSMasterKeyID": string,
                    "SSEAlgorithm": string
                }
            }[]
        },
        "BucketName": string,
        "InventoryConfigurations": {
            "Destination": {
                "BucketAccountId": string,
                "BucketArn": string,
                "Format": string,
                "Prefix": string
            },
            "Enabled": boolean,
            "Id": string,
            "IncludedObjectVersions": string,
            "OptionalFields": string[],
            "Prefix": string,
            "ScheduleFrequency": string
        }[],
        "LifecycleConfiguration": {
            "Rules": {
                "AbortIncompleteMultipartUpload": {
                    "DaysAfterInitiation": number
                },
                "ExpirationDate": number,
                "ExpirationInDays": number,
                "ExpiredObjectDeleteMarker": boolean,
                "Id": string,
                "NoncurrentVersionExpiration": {
                    "NewerNoncurrentVersions": number,
                    "NoncurrentDays": number
                },
                "NoncurrentVersionExpirationInDays": number,
                "NoncurrentVersionTransition": {
                    "NewerNoncurrentVersions": number,
                    "StorageClass": string,
                    "TransitionInDays": number
                },
                "NoncurrentVersionTransitions": {
                    "NewerNoncurrentVersions": number,
                    "StorageClass": string,
                    "TransitionInDays": number
                }[],
                "ObjectSizeGreaterThan": number,
                "ObjectSizeLessThan": number,
                "Prefix": string,
                "Status": string,
                "Transition": {
                    "StorageClass": string,
                    "TransitionDate": number,
                    "TransitionInDays": number
                },
                "Transitions": {
                    "StorageClass": string,
                    "TransitionDate": number,
                    "TransitionInDays": number
                }[]
            }[]
        },
        "LoggingConfiguration": {
            "DestinationBucketName": string,
            "LogFilePrefix": string
        },
        "MetricsConfigurations": {
            "AccessPointArn": string,
            "Id": string,
            "Prefix": string,
            "TagFilters": any[]
        }[],
        "NotificationConfiguration": {
            "EventBridgeConfiguration": {
                "EventBridgeEnabled": boolean
            },
            "LambdaConfigurations": {
                "Event": string,
                "Filter": {
                    "S3Key": {
                        "Rules": {
                            "Name": string,
                            "Value": string
                        }[]
                    }
                },
                "Function": string
            }[],
            "QueueConfigurations": {
                "Event": string,
                "Filter": {
                    "S3Key": {
                        "Rules": {
                            "Name": string,
                            "Value": string
                        }[]
                    }
                },
                "Queue": string
            }[],
            "TopicConfigurations": {
                "Event": string,
                "Filter": {
                    "S3Key": {
                        "Rules": {
                            "Name": string,
                            "Value": string
                        }[]
                    }
                },
                "Topic": string
            }[]
        },
        "ObjectLockConfiguration": {
            "ObjectLockEnabled": string,
            "Rule": {
                "DefaultRetention": {
                    "Days": number,
                    "Mode": string,
                    "Years": number
                }
            }
        },
        "ObjectLockEnabled": boolean,
        "OwnershipControls": {
            "Rules": {
                "ObjectOwnership": string
            }[]
        },
        "PublicAccessBlockConfiguration": {
            "BlockPublicAcls": boolean,
            "BlockPublicPolicy": boolean,
            "IgnorePublicAcls": boolean,
            "RestrictPublicBuckets": boolean
        },
        "ReplicationConfiguration": {
            "Role": string,
            "Rules": {
                "DeleteMarkerReplication": {
                    "Status": string
                },
                "Destination": {
                    "AccessControlTranslation": {
                        "Owner": string
                    },
                    "Account": string,
                    "Bucket": string,
                    "EncryptionConfiguration": {
                        "ReplicaKmsKeyID": string
                    },
                    "Metrics": {
                        "EventThreshold": {
                            "Minutes": number
                        },
                        "Status": string
                    },
                    "ReplicationTime": {
                        "Status": string,
                        "Time": {
                            "Minutes": number
                        }
                    },
                    "StorageClass": string
                },
                "Filter": {
                    "And": {
                        "Prefix": string,
                        "TagFilters": {
                            "Key": string,
                            "Value": string
                        }[]
                    },
                    "Prefix": string,
                    "TagFilter": {
                        "Key": string,
                        "Value": string
                    }
                },
                "Id": string,
                "Prefix": string,
                "Priority": number,
                "SourceSelectionCriteria": {
                    "ReplicaModifications": {
                        "Status": string
                    },
                    "SseKmsEncryptedObjects": {
                        "Status": string
                    }
                },
                "Status": string
            }[]
        },
        "VersioningConfiguration": {
            "Status": string
        },
        "WebsiteConfiguration": {
            "ErrorDocument": string,
            "IndexDocument": string,
            "RedirectAllRequestsTo": {
                "HostName": string,
                "Protocol": string
            },
            "RoutingRules": {
                "RedirectRule": {
                    "HostName": string,
                    "HttpRedirectCode": string,
                    "Protocol": string,
                    "ReplaceKeyPrefixWith": string,
                    "ReplaceKeyWith": string
                },
                "RoutingRuleCondition": {
                    "HttpErrorCodeReturnedEquals": string,
                    "KeyPrefixEquals": string
                }
            }[]
        }
    };
}

// AWS::S3::BucketPolicy
// https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/aws-resource-s3-bucketpolicy.html
export interface AwsS3BucketPolicy extends CommonResource {
    "Properties": {
        "Bucket": string,
        "PolicyDocument": any
    };
}