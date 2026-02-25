# PromptResponse

プロンプト一覧と詳細の両方に対応する汎用的なレスポンスインターフェース  実際には、一覧用と詳細用で型を分ける方がより堅牢ですが、  userController.tsの例に倣い、any型を許容した形で定義します。

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**message** | **string** |  | [default to undefined]
**results** | **Array&lt;any&gt;** |  | [optional] [default to undefined]
**result** | **any** |  | [optional] [default to undefined]

## Example

```typescript
import { PromptResponse } from './api';

const instance: PromptResponse = {
    message,
    results,
    result,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
