export const ja = {
    main: {
        title: '太鼓レーティング',
        description: '太鼓の達人の実力を測定し、管理するサイトです。',
        start: '始める',
        features: [
            {
                title: 'レーティング測定',
                description: 'ドンだーひろばのデータをアップロードして、自分のレーティングを確認できます。'
            },
            {
                title: 'ランキング',
                description: '他のユーザーとレーティングを比較してみましょう。'
            },
            {
                title: '統計',
                description: '曲別、段位別の統計データを確認してみましょう。'
            }
        ]
    },
    header: {
        ranking: '順位',
        docs: '文書',
        statistics: '統計',
        measure: '定数表',
        my_profile: 'マイプロフィール',
        my_rating: 'マイレーティング',
        login: 'ログイン',
        logout: 'ログアウト',
        close: '閉じる'
    },
    docs: {
        doc: '文書',
        titles: [
            '01. 概要',
            '02. データアップロード'
        ],
        translated_by_ai: ''
    },
    start: {
        title: '始める',
        nickname: 'ニックネーム',
        nickname_placeholder: 'ニックネームを入力してください',
        bio: 'ステータスメッセージ',
        agreement: {
            line1: {
                plain: 'ユーザーは%sで確認できる次のデータをこのサイトにアップロードできます。',
                child: 'ドンだーひろば'
            },
            line1_list: [
                'ニックネーム',
                '太鼓番',
                '段位道場合格データ',
                'すべての曲の各難易度のプレイ記録'
            ],
            line2: {
                plain: 'ユーザーがアップロードしたデータは、%sで退会時にすべて削除されます。',
                child: 'こちら'
            },
            line3: 'ユーザーがアップロードしたデータはすべて公開されることがあります。',
            line4: 'ユーザーがアップロードしたデータは、匿名化された形で統計分析に使用されることがあります。',
            agree: '上記の条項に同意します。'
        },
        button: '始める',
        error_alert: 'エラーが発生しました。'
    },
    me: {
        title: 'マイプロフィール',
        profile: 'プロフィール',
        taiko_profile: '太鼓プロフィール',
        nickname: 'ニックネーム',
        nickname_placeholder: 'ニックネームを入力してください',
        bio: 'ステータスメッセージ',
        save: '保存する',
        success_alert: 'プロフィールが変更されました。',
        error_alert: 'エラーが発生しました。',
        hideDan: '段位を隠す'
    },
    ranking: {
        title: 'ランキング %s'
    },
    user_page: {
        alert: {
            image_download: '画像がまもなくダウンロードされます。'
        },
        profile: {
            last_update: '最終更新:',
            no_bio: 'ステータスメッセージがありません。',
            ranking: 'ランキング',
            current_tier: '現在のティア',
            rating: 'レーティング'
        },
        rating_song: {
            title: '曲レーティング',
            top_50: '上位50曲',
            download: 'ダウンロード',
            others: 'その他の曲'
        },
        statistics: {
            title: '統計',
            top_50: '上位50曲',
            history: '履歴'
        },
        rating_info: {
            ranking: 'ランキング',
            current_tier: '現在のティア',
            rating: 'レーティング'
        }
    },
    migrate: {
        confirm: 'データ移行が可能です。移行しますか？',
        button: '移行する',
        migrating: 'データ移行中...',
        success: 'データ移行成功！',
        my_rating: 'マイレーティング',
        error: 'データ移行エラー',
        already_exists: 'すでにレーティングデータが存在します。',
        not_possible: 'データ移行は不可能です。'
    },
    dani: {
        '5kyu': '5級',
        '4kyu': '4級',
        '3kyu': '3級',
        '2kyu': '2級',
        '1kyu': '1級',
        '1dan': '初段',
        '2dan': '二段',
        '3dan': '三段',
        '4dan': '四段',
        '5dan': '五段',
        '6dan': '六段',
        '7dan': '七段',
        '8dan': '八段',
        '9dan': '九段',
        '10dan': '十段',
        'kuroto': '玄人',
        'meijin': '名人',
        'chojin': '超人',
        'tatsujin': '達人'
    },
    statistic: {
        title: "統計",
        info: 'オレンジ色は自分のデータを含む範囲です。',
        dani: {
            title: '段位関連統計',
            daniDistribution: '段位分布',
            ratingScoreByDani: '段位別レーティングスコア',
            description: '自分が現在どの程度の位置にいるか確認し、他の人と比べてみましょう。'
        },
        song: {
            title: '曲別統計',
            songRatingDistribution: '曲レーティング分布',
            songRatingByTier: 'ティア別レーティング分布',
            myRanking: (ranking: number) => `マイ ランキング: ${ranking}位`
        }
    },
    measure: {
        title: '定数表',
        measure: '定数',
        level: 'レベル',
        song_title: '曲名',
        search_placeholder: '曲名で検索'
    }
}