# habicat

[Figma](https://www.figma.com/board/c9IoR1BGjw9uC0TF87CDdo/%E3%82%A2%E3%82%A4%E3%83%87%E3%82%A2%E5%87%BA%E3%81%97%E3%83%BB%E3%83%96%E3%83%AC%E3%82%A4%E3%83%B3%E3%82%B9%E3%83%88%E3%83%BC%E3%83%9F%E3%83%B3%E3%82%B0?node-id=2002-270&t=xLKkb9HE5uZ0MoH1-1)

# 手順

## ReactNative

### 作成者のみ実施(最初の一回のみ実施)

#### Node.js が必要（v18 以上推奨）

```bash
node -v
```

#### Expo CLI で始める場合

```bash
npx create-expo-app habicat --template blank-typescript
cd habicat
npx expo start
```

### 作成者以外が実施

#### リポジトリを clone

```bash
git clone https://github.com/yourname/habicat.git
cd habicat/mobile/habicat
```

#### package-lock.json 通りに完全一致でインストール

```bash
npm ci
```

#### 起動

```bash
npx expo start
```

### 共通(npx expo start コマンド実行後)

#### Xcode の初回セットアップ(Xcode をインストールしていない場合)

##### コマンドラインツールのインストール

```bash
sudo xcode-select --install
```

##### ライセンスに同意

```bash
sudo xcodebuild -license accept
```

###

```bash
npx expo start を実行した状態で、ターミナルで i キーを押すだけです。
bashnpx expo start
```

起動したら

iOS エミュレータの場合
i キーを押す
Android エミュレータの場合
a キーを押す(Android Studio が必要)

## その他

iOS エミュレータ開くときに下記エラーが出た場合

```bash
Error: xcrun simctl boot F2B0E504-9622-4BFC-A71E-FED0F5532A8F exited with non-zero code: 2
An error was encountered processing the command (domain=NSPOSIXErrorDomain, code=2):
Unable to boot device because we cannot determine the runtime bundle.
No such file or directory
```

iOS ランタイムがインストールできていない

1. XCode→Setting→Components 開く
2. iOS Simulator インストール
3. 完了後

```bash
npx expo start -c
```

## docker

```bash
# バックエンドディレクトリへ移動
cd backend

# docker起動
docker-compose up -d

# Swagger UI
http://localhost:8000/docs

# API定義データ
http://localhost:8000/openapi.json
```

## データを手動でいれる方法

```bash
docker exec -it mysql_db mysql -u appuser -papppass appdb

# MySQL
INSERT INTO users (name, email, password, streak_days, last_stamped_date) VALUES ('テストユーザー', 'test@example.com', 'password123', 0, NULL);

```
