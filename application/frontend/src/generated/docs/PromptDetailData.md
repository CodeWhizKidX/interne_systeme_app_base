# PromptDetailData

プロンプト詳細画面で使用される完全なデータ型

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** |  | [default to undefined]
**title** | **string** |  | [default to undefined]
**subTitle** | **string** |  | [default to undefined]
**description** | **string** |  | [default to undefined]
**isGem** | **boolean** |  | [default to undefined]
**isVisible** | **boolean** |  | [default to undefined]
**tags** | **Array&lt;string&gt;** |  | [default to undefined]
**startColor** | **string** |  | [default to undefined]
**shareStatus** | **string** |  | [optional] [default to undefined]
**endColor** | **string** |  | [default to undefined]
**createdAt** | **string** |  | [default to undefined]
**updatedAt** | **string** |  | [default to undefined]
**authorName** | **string** |  | [optional] [default to undefined]
**steps** | [**Array&lt;StepData&gt;**](StepData.md) |  | [default to undefined]
**gem** | **string** |  | [default to undefined]
**references** | [**Array&lt;ReferenceData&gt;**](ReferenceData.md) |  | [default to undefined]

## Example

```typescript
import { PromptDetailData } from './api';

const instance: PromptDetailData = {
    id,
    title,
    subTitle,
    description,
    isGem,
    isVisible,
    tags,
    startColor,
    shareStatus,
    endColor,
    createdAt,
    updatedAt,
    authorName,
    steps,
    gem,
    references,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
