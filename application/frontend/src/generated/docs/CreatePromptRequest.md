# CreatePromptRequest

プロンプト作成APIリクエストボディのデータ型 フロントエンドから送信される情報に対応

## Properties

Name | Type | Description | Notes
------------ | ------------- | ------------- | -------------
**id** | **string** | クライアント側で一時的に生成されるID (バックエンドで無視または検証する) | [default to undefined]
**title** | **string** | プロンプトのタイトル | [default to undefined]
**description** | **string** | プロンプト全体の詳細な説明 | [default to undefined]
**tags** | **Array&lt;string&gt;** | プロンプトに関連付けられたタグのリスト (例: #ビジネス, #メール) | [default to undefined]
**isGem** | **boolean** | Gem（高度な機能）を使用するかどうか | [default to undefined]
**startColor** | **string** | カードのグラデーションの開始色 (HEX値) | [default to undefined]
**endColor** | **string** | カードのグラデーションの終了色 (HEX値) | [default to undefined]
**steps** | [**Array&lt;CreateStepData&gt;**](CreateStepData.md) | プロンプトの実行ステップの配列 | [default to undefined]
**gem** | **string** | Gemが有効な場合の基になるプロンプト文字列 (isGemがtrueの場合に存在する) | [default to undefined]
**references** | [**Array&lt;CreateReferenceData&gt;**](CreateReferenceData.md) | 参考リンクの配列（任意） | [optional] [default to undefined]

## Example

```typescript
import { CreatePromptRequest } from './api';

const instance: CreatePromptRequest = {
    id,
    title,
    description,
    tags,
    isGem,
    startColor,
    endColor,
    steps,
    gem,
    references,
};
```

[[Back to Model list]](../README.md#documentation-for-models) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to README]](../README.md)
