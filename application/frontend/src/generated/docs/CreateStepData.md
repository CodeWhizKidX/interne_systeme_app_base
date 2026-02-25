# CreateStepData

プロンプト作成時の各ステップのデータ型

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**title** | **string** | ステップのタイトル | [default to undefined]
**subTitle** | **string** | ステップのサブタイトル | [default to undefined]
**promptTemplate** | **string** | プロンプトテンプレートの文字列（入力フィールドのプレースホルダーを含む） | [default to undefined]
**inputFields** | **Array&lt;string&gt;** | ユーザーが入力するフィールドのキー名リスト | [default to undefined]

## Example

```typescript
import { CreateStepData } from './api';

const instance: CreateStepData = {
    title,
    subTitle,
    promptTemplate,
    inputFields,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
