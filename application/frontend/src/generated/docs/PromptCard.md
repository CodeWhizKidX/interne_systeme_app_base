# PromptCard

プロンプト一覧カードおよび詳細の共通基本データ型

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

## Example

```typescript
import { PromptCard } from './api';

const instance: PromptCard = {
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
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
