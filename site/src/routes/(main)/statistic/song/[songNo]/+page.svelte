<script lang="ts">
    import PageTitle from "$lib/components/layout/main/Page-title.svelte";
    import MySongRanking from "$lib/components/statistic/song/MySongRanking.svelte";
    import SongRatingScoreDistribution from "$lib/components/statistic/song/SongRatingScoreDistribution.svelte";
    import { COLOR } from "$lib/module/util/index.js";

    let { data } = $props();
</script>

<PageTitle title={`통계 - ${data.measure.title}`}/>
<h1>
    {data.measure.title}
    <div class="info-container">
        <div
            class="info-item"
            style:background-color={COLOR.RATING.MEASURE(
                data.measure.measureValue,
            )}
        >
            {data.measure.measureValue}
        </div>
        <div
            class="info-item"
            style:background-color={COLOR.DIFFICULTY[
                data.measure.diff
            ].toString()}
        >
            ★{data.measure.level}
        </div>
    </div>
</h1>
<div class="info">
    {'info'}
</div>

<MySongRanking statisticData={data.statisticData} myData={data.myData}/>
<SongRatingScoreDistribution statisticData={data.statisticData} myData={data.myData}/>

<style>
    h1 {
        display: flex;
        flex-wrap: wrap;
        column-gap: 10px;
        & .info-container {
            display: flex;
            align-items: flex-end;
            box-sizing: border-box;
            padding-bottom: 5px;
            column-gap: 5px;
        }
        & .info-item {
            font-size: 16px;
            width: 45px;
            height: 25px;
            display: flex;
            justify-content: center;
            align-items: center;
            box-sizing: border-box;
            padding-bottom: 2px;
            color: white;
            border-radius: 5px;
        }
    }

    .info {
        font-size: 13px;
        color: gray;
        margin-bottom: 20px;
    }
</style>
