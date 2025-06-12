// src/app/components/MapDisplay.jsx
'use client';

import React, { useState, useEffect, useCallback } from 'react';
import { GoogleMap, LoadScript, MarkerF, Autocomplete } from '@react-google-maps/api';

const busStops = [
  { name: '別所バス停', lat: 35.031268, lng: 135.842742 },
  { name: '山上町バス停', lat: 35.02984, lng: 135.845499 },
  { name: '尾花川バス停', lat: 35.02875, lng: 135.84883 },
  { name: '三井寺バス停', lat: 35.01524, lng: 135.8502 },
  { name: '大門バス停', lat: 35.013083, lng: 135.850449 },
  { name: '競艇場前バス停', lat: 35.03373, lng: 135.85323 },
  { name: '三保ヶ崎バス停', lat: 35.02568, lng: 135.85056 },
  { name: '大津京駅バス停', lat: 35.031661, lng: 135.853336 },
  { name: '茶ヶ崎バス停', lat: 35.02322, lng: 135.8534 },
  { name: '皇子が丘公園バス停', lat: 35.02704, lng: 135.85408 },
  { name: '皇子ヶ丘バス停', lat: 35.028452, lng: 135.855079 },
  { name: 'イオン西大津前バス停', lat: 35.03299, lng: 135.8558 },
  { name: '浜大津バス停', lat: 35.01426, lng: 135.86139 },
  { name: '浜町バス停', lat: 35.01235, lng: 135.86177 },
  { name: '大津赤十字病院バス停', lat: 35.0155, lng: 135.8605 },
  { name: '柳ヶ崎(びわ湖大津館前)バス停', lat: 35.02534, lng: 135.85966 },
  { name: '浜大津アーカス(琵琶湖ホテル)バス停', lat: 35.01524, lng: 135.86474 },
  { name: '浜大津アーカスバス停', lat: 35.01476, lng: 135.86476 },
  { name: '近江神宮前バス停', lat: 35.02796, lng: 135.84587 },
  { name: '京町通りバス停/京町通バス停', lat: 35.011689, lng: 135.860646 },
  { name: '大津市民会館バス停', lat: 35.01548, lng: 135.85501 },
  { name: '競輪場前バス停', lat: 35.02324, lng: 135.85764 },
  { name: '中央大通りバス停', lat: 35.01077, lng: 135.86311 },
  { name: '裁判所前バス停', lat: 35.01881, lng: 135.85609 },
  { name: '大津駅口バス停', lat: 35.011689, lng: 135.860646 },
  { name: '大津駅前バス停/大津駅バス停', lat: 35.01258, lng: 135.86326 },
  { name: '県庁前バス停', lat: 35.00693, lng: 135.86414 },
  { name: '鏡が浜バス停', lat: 35.006138, lng: 135.869085 },
  { name: '展望台前バス停', lat: 35.0003, lng: 135.8698 },
  { name: '松ヶ枝町バス停', lat: 35.00762, lng: 135.86796 },
  { name: '一丁目南バス停', lat: 35.02273, lng: 135.8286 },
  { name: '藤尾奥町バス停', lat: 34.99723, lng: 135.82915 },
  { name: 'びわ湖霊園前バス停', lat: 35.00332, lng: 135.8344 },
  { name: '商工会議所前バス停/商工会議所前(大津)バス停', lat: 35.01255, lng: 135.86725 },
  { name: 'びわ湖ホールバス停', lat: 35.0084, lng: 135.87034 },
  { name: '比叡平一丁目バス停', lat: 35.02451, lng: 135.8281 },
  { name: '比叡平バス停', lat: 35.02501, lng: 135.82482 },
  { name: '際川バス停', lat: 35.04221, lng: 135.85906 },
  { name: '田ノ谷峠バス停/田の谷峠バス停', lat: 35.03598, lng: 135.82089 },
  { name: '比叡平二丁目バス停', lat: 35.02983, lng: 135.82488 },
  { name: 'ビアザ淡海バス停', lat: 35.00729, lng: 135.87118 },
  { name: '本宮町バス停', lat: 35.0222, lng: 135.85871 },
  { name: '大津署前バス停', lat: 35.02052, lng: 135.85871 },
  { name: '大津市民病院バス停', lat: 35.02381, lng: 135.8596 },
  { name: '三丁目東バス停', lat: 35.03264, lng: 135.82421 },
  { name: 'なぎさのプロムナードバス停', lat: 35.00958, lng: 135.87034 },
  { name: '藤尾・小金塚バス停', lat: 34.99818, lng: 135.83446 },
  { name: '大津市民病院玄関前バス停', lat: 35.02422, lng: 135.85966 },
  { name: '北際川バス停', lat: 35.04416, lng: 135.85871 },
  { name: '義仲寺バス停/義仲寺西武百貨店前バス停', lat: 35.00224, lng: 135.87114 },
  { name: 'マツダ前バス停', lat: 35.00165, lng: 135.87196 },
  { name: '比叡平三丁目バス停', lat: 35.03264, lng: 135.82421 },
  { name: '稲葉台バス停', lat: 34.99616, lng: 135.87877 },
  { name: '馬場一丁目バス停/馬場1丁目県立体育館前バス停', lat: 35.00336, lng: 135.87241 },
  { name: '比叡平口バス停', lat: 35.03723, lng: 135.83296 },
  { name: '藤尾小学校バス停', lat: 34.99596, lng: 135.83643 },
  { name: '竜ケ丘バス停', lat: 34.99478, lng: 135.87834 },
  { name: '県立体育館バス停', lat: 35.00424, lng: 135.87425 },
  { name: '山の手団地バス停', lat: 35.04632, lng: 135.84501 },
  { name: '鶴の里団地バス停', lat: 35.05041, lng: 135.8443 },
  { name: '鶴の里橋バス停', lat: 35.05063, lng: 135.84581 },
  { name: '国道膳所バス停', lat: 35.00031, lng: 135.8757 },
  { name: '花屋敷池の里北バス停', lat: 35.0536, lng: 135.8446 },
  { name: '鶴の里東バス停', lat: 35.0503, lng: 135.8483 },
  { name: 'びわ湖大津プリンスホテルバス停', lat: 35.0028, lng: 135.8824 },
  { name: '西ノ庄バス停', lat: 35.05193, lng: 135.85058 },
  { name: '山中上バス停', lat: 35.04562, lng: 135.82823 },
  { name: '花屋敷池の里南バス停', lat: 35.0518, lng: 135.8451 },
  { name: '緑ヶ丘バス停', lat: 35.0531, lng: 135.8491 },
  { name: '唐崎バス停', lat: 35.0594, lng: 135.8601 },
  { name: '湖城が丘バス停/湖城ケ丘バス停', lat: 35.054, lng: 135.8519 },
  { name: '木ノ下町バス停/木の下町バス停', lat: 35.0583, lng: 135.8576 },
  { name: '山中町バス停', lat: 35.0478, lng: 135.8344 },
  { name: '北唐崎バス停', lat: 35.0617, lng: 135.861 },
  { name: '夢見ヶ丘バス停', lat: 35.0567, lng: 135.853 },
  { name: '丸ノ内町バス停/丸の内町バス停', lat: 35.0061, lng: 135.8772 },
  { name: '四ツ谷バス停', lat: 35.0594, lng: 135.854 },
  { name: '雲雀ヶ丘バス停', lat: 35.0607, lng: 135.8546 },
  { name: '山中バス停', lat: 35.0483, lng: 135.8306 },
  { name: '膳所公園バス停', lat: 35.0044, lng: 135.8773 },
  { name: '滋賀病院玄関前バス停/滋賀病院前バス停', lat: 35.0645, lng: 135.861 },
  { name: '本丸町バス停', lat: 35.0045, lng: 135.8797 },
  { name: '上別保バス停/上別保町バス停', lat: 34.9926, lng: 135.8812 },
  { name: '石川町バス停', lat: 35.0067, lng: 135.8795 },
  { name: '中ノ庄バス停/中の庄バス停', lat: 35.0543, lng: 135.8557 },
  { name: '三池バス停', lat: 35.011, lng: 135.8821 },
  { name: '観音口バス停', lat: 35.0142, lng: 135.8837 },
  { name: '焼野口バス停', lat: 35.0175, lng: 135.8821 },
  { name: '晴園寮バス停', lat: 35.0197, lng: 135.8821 },
  { name: '御殿ヶ浜バス停', lat: 35.0084, lng: 135.8813 },
  { name: '下阪本バス停', lat: 35.0682, lng: 135.8643 },
  { name: '園山バス停', lat: 35.016, lng: 135.8872 },
  { name: 'アパート前バス停', lat: 35.0212, lng: 135.8841 },
  { name: '焼野中町バス停', lat: 35.0211, lng: 135.8821 },
  { name: '焼野バス停', lat: 35.0142, lng: 135.8821 },
  { name: '衛生科学センター前バス停/環境科学センター前バス停', lat: 35.0189, lng: 135.8863 },
  { name: '永大団地前バス停', lat: 35.0232, lng: 135.8837 },
  { name: '東レ北門前バス停/東レ北門バス停', lat: 35.0229, lng: 135.8863 },
  { name: '無動寺バス停', lat: 35.0349, lng: 135.8078 },
  { name: '売店前バス停', lat: 35.1583, lng: 135.836 },
  { name: '太間町バス停', lat: 34.9803, lng: 135.9102 },
  { name: 'ローム滋賀前バス停', lat: 34.9788, lng: 135.9126 },
  { name: '萱野浦北通りバス停', lat: 34.9796, lng: 135.9189 },
  { name: '東塔バス停/東塔(坂本ケーブル口)バス停', lat: 35.048, lng: 135.8391 },
  { name: 'ケーブル坂本駅バス停', lat: 35.0869, lng: 135.8698 },
  { name: 'パワーセンター大津PCOバス停', lat: 34.9765, lng: 135.9197 },
  { name: 'ロイヤルオークホテルバス停', lat: 34.9754, lng: 135.9189 },
  { name: '東レ正門前(おりば専用)バス停', lat: 35.0256, lng: 135.8858 },
  { name: '石山駅バス停', lat: 34.9625, lng: 135.903 },
  { name: '日吉大社前バス停', lat: 35.0841, lng: 135.8679 },
  { name: '延暦寺バスセンターバス停', lat: 35.0483, lng: 135.8378 },
  { name: '玉の浦北バス停', lat: 34.973, lng: 135.9179 },
  { name: '京阪坂本駅前バス停', lat: 35.0818, lng: 135.869 },
  { name: '松原バス停/東レ前(松原)バス停', lat: 34.9702, lng: 135.9038 },
  { name: '宮ノ内バス停', lat: 34.9663, lng: 135.9054 },
  { name: '琵琶湖漕艇場バス停', lat: 34.9678, lng: 135.905 },
  { name: '大萱六丁目西バス停', lat: 34.9763, lng: 135.9229 },
  { name: '比叡山坂本駅バス停', lat: 35.0801, lng: 135.8712 },
  { name: '坂本医院前バス停', lat: 34.9697, lng: 135.9056 },
  { name: '晴嵐小学校前バス停', lat: 34.9688, lng: 135.9029 },
  { name: '比叡辻バス停', lat: 35.0765, lng: 135.868 },
  { name: '栄町バス停', lat: 34.9673, lng: 135.903 },
  { name: '西塔(釈迦堂)バス停', lat: 35.0402, lng: 135.8209 },
  { name: '玉の浦バス停', lat: 34.9702, lng: 135.9179 },
  { name: '唐橋前バス停', lat: 34.9663, lng: 135.9015 },
  { name: '唐橋前(復路)バス停', lat: 34.96642, lng: 135.90123 },
  { name: '石山高校前バス停', lat: 34.9644, lng: 135.9009 },
  { name: '大宮町バス停', lat: 34.9818, lng: 135.9221 },
  { name: '大宮町東バス停', lat: 34.9806, lng: 135.9234 },
  { name: '唐橋前(往路)バス停', lat: 34.96627, lng: 135.90184 },
  { name: '泉福寺バス停', lat: 34.9789, lng: 135.9247 },
  { name: '大萱六丁目バス停', lat: 34.9751, lng: 135.9246 },
  { name: '日吉団地口バス停', lat: 35.087, lng: 135.875 },
  { name: '幻住庵バス停', lat: 34.9744, lng: 135.8973 },
  { name: '南大萱バス停', lat: 34.9781, lng: 135.9261 },
  { name: '国分一丁目バス停', lat: 34.9723, lng: 135.8993 },
  { name: '針田橋バス停', lat: 34.9712, lng: 135.8994 },
  { name: '来迎寺カネカ前バス停', lat: 34.9705, lng: 135.926 },
  { name: '国分町バス停', lat: 34.97, lng: 135.9002 },
  { name: '赤地蔵前バス停', lat: 34.9806, lng: 135.9022 },
  { name: '大将軍1丁目バス停', lat: 34.9822, lng: 135.9038 },
  { name: '国分団地バス停', lat: 34.9708, lng: 135.8972 },
  { name: '西浦バス停', lat: 34.9806, lng: 135.9298 },
  { name: '大江二丁目バス停', lat: 34.9859, lng: 135.908 },
  { name: '仏神寺バス停', lat: 34.9839, lng: 135.9035 },
  { name: '日吉台一丁目バス停', lat: 35.087, lng: 135.878 },
  { name: '橋本(往路)1バス停', lat: 34.98829, lng: 135.90632 },
  { name: '橋本(復路)1バス停', lat: 34.98801, lng: 135.90675 },
  { name: '峰道(大師像前)バス停', lat: 35.039, lng: 135.8118 },
  { name: '西教寺バス停', lat: 35.0898, lng: 135.8679 },
  { name: '木ノ岡団地前バス停', lat: 35.0931, lng: 135.871 },
  { name: '専称寺前バス停', lat: 34.9863, lng: 135.903 },
  { name: '東レ瀬田事業場前バス停', lat: 34.9897, lng: 135.9079 },
  { name: '橋本バス停/橋本(往路)2バス停/橋本(復路)2バス停', lat: 34.9881, lng: 135.9065 },
  { name: '瀬田北小学校バス停', lat: 34.9893, lng: 135.9123 },
  { name: '大江バス停', lat: 34.9845, lng: 135.9062 },
  { name: '久保江バス停', lat: 34.987, lng: 135.9116 },
  { name: '瀬田南小学校前バス停', lat: 34.9897, lng: 135.9135 },
  { name: '藤ケ森北市民センターバス停', lat: 34.9922, lng: 135.9142 },
  { name: '高橋川バス停', lat: 34.9904, lng: 135.9113 },
  { name: '瀬田ニ丁目バス停', lat: 34.9912, lng: 135.908 },
  { name: '神領建部大社前バス停/建部大社バス停', lat: 34.9888, lng: 135.8993 },
  { name: '日吉市民センター前バス停', lat: 35.087, lng: 135.882 },
  { name: '京阪石山寺バス停', lat: 34.9601, lng: 135.9022 },
  { name: '大萱1丁目バス停', lat: 34.9924, lng: 135.9175 },
  { name: '瀬田市民センター前バス停', lat: 34.9894, lng: 135.9148 },
  { name: '神領3丁目バス停', lat: 34.9855, lng: 135.8986 },
  { name: '大津車庫バス停', lat: 34.9822, lng: 135.8932 },
  { name: '檜山バス停', lat: 35.097, lng: 135.875 },
  { name: '瀬田駅バス停', lat: 34.9957, lng: 135.9142 },
  { name: '大江三丁目バス停', lat: 34.9913, lng: 135.9038 },
  { name: '日吉台北ニ丁目バス停', lat: 35.088, lng: 135.881 },
  { name: '神領団地バス停', lat: 34.9839, lng: 135.9004 },
  { name: '椋橋バス停', lat: 34.9944, lng: 135.9035 },
  { name: '古墳前バス停', lat: 34.9961, lng: 135.9038 },
  { name: '瀬田駅口バス停', lat: 34.9959, lng: 135.9113 },
  { name: '瀬田高校前バス停', lat: 34.9989, lng: 135.9103 },
  { name: '東北自治会館バス停', lat: 34.9965, lng: 135.9083 },
  { name: '博愛保育園前バス停', lat: 34.9995, lng: 135.9079 },
  { name: '瀬田変電所前バス停', lat: 34.9999, lng: 135.906 },
  { name: '建部大社南口バス停', lat: 34.9859, lng: 135.8973 },
  { name: '瀬田バスストップバス停', lat: 34.9915, lng: 135.9328 },
  { name: '桑畑バス停', lat: 34.9804, lng: 135.8906 },
  { name: '日吉台三丁目バス停', lat: 35.0903, lng: 135.8817 },
  { name: '神領大和苑バス停', lat: 34.9822, lng: 135.8973 },
  { name: '大津市東消防署前バス停', lat: 34.9814, lng: 135.896 },
  { name: '新緑苑団地バス停', lat: 34.9782, lng: 135.892 },
  { name: '新緑苑団地口バス停', lat: 34.9793, lng: 135.8938 },
  { name: '日吉台四丁目バス停', lat: 35.0927, lng: 135.8804 },
  { name: '下野郷原バス停', lat: 34.9754, lng: 135.8909 },
  { name: '南谷口(西武団地口)バス停', lat: 34.9754, lng: 135.8953 },
  { name: '神領二丁目バス停', lat: 34.9847, lng: 135.8997 },
  { name: '一里山バス停', lat: 34.9882, lng: 135.9238 },
  { name: '月の輪バス停', lat: 34.9859, lng: 135.9261 },
  { name: '大江4丁目東バス停', lat: 34.9942, lng: 135.9015 },
  { name: '石山寺山門前バス停', lat: 34.9575, lng: 135.9042 },
  { name: '葛原遊園地バス停', lat: 34.9723, lng: 135.8943 },
  { name: '野郷原バス停', lat: 34.9733, lng: 135.8899 },
  { name: '庄山中バス停', lat: 34.9722, lng: 135.8876 },
  { name: '苗鹿バス停', lat: 35.1018, lng: 135.8778 },
  { name: '石山団地口バス停', lat: 34.9686, lng: 135.8938 },
  { name: '月の輪二丁目バス停', lat: 34.983, lng: 135.928 },
  { name: '瀬田中学校前バス停', lat: 34.9806, lng: 135.9328 },
  { name: '島津メクテム前バス停', lat: 34.9774, lng: 135.9328 },
  { name: '電業会館前バス停', lat: 34.9754, lng: 135.9328 },
  { name: '大江東バス停', lat: 34.9922, lng: 135.9018 },
  { name: '水天宮バス停', lat: 34.973, lng: 135.9328 },
  { name: '新緑苑児童公園前バス停', lat: 34.9774, lng: 135.8951 },
  { name: '石山団地バス停', lat: 34.9705, lng: 135.892 },
  { name: '千寿の郷バス停', lat: 34.968, lng: 135.8893 },
  { name: '一ツ松バス停', lat: 34.9664, lng: 135.8887 },
  { name: '山之神の池バス停', lat: 34.97, lng: 135.8871 },
  { name: '野郷原一丁目バス停', lat: 34.973, lng: 135.892 },
  { name: '栗林町バス停', lat: 34.9638, lng: 135.8872 },
  { name: '石山団地中央バス停', lat: 34.9691, lng: 135.8906 },
  { name: '樋ノ口バス停', lat: 34.9622, lng: 135.8863 },
  { name: '緑のふれあいセンターバス停', lat: 34.9719, lng: 135.8863 },
  { name: '庄山東自治会館前バス停', lat: 34.9715, lng: 135.8892 },
  { name: '西武大津グリーンハイツバス停', lat: 34.9738, lng: 135.8973 },
  { name: '一里山三丁目バス停', lat: 34.9859, lng: 135.9221 },
  { name: '松陽2丁目バス停', lat: 34.9837, lng: 135.9328 },
  { name: '瀬田川団地バス停', lat: 34.9786, lng: 135.9351 },
  { name: '松陽2丁目東バス停', lat: 34.9829, lng: 135.9348 },
  { name: '大浜バス停', lat: 34.9622, lng: 135.8893 },
  { name: '野々宮バス停', lat: 34.9604, lng: 135.8899 },
  { name: '松陽3丁目バス停', lat: 34.9814, lng: 135.9358 },
  { name: '朝倉バス停', lat: 34.9587, lng: 135.8906 },
  { name: '雄琴温泉ホテル前バス停', lat: 35.109, lng: 135.8897 },
  { name: '石山幼稚園前バス停', lat: 34.9575, lng: 135.8918 },
  { name: 'バイパス一里山バス停', lat: 34.9868, lng: 135.9221 },
  { name: '石山小学校前バス停', lat: 34.9571, lng: 135.8938 },
  { name: '西武園口バス停', lat: 34.9749, lng: 135.8988 },
  { name: '滋賀大西門バス停', lat: 34.9763, lng: 135.8885 },
  { name: '名神瀬田東バス停', lat: 34.9922, lng: 135.9349 },
  { name: '瀬田川団地口バス停', lat: 34.9806, lng: 135.9351 },
  { name: '横川バス停', lat: 35.0116, lng: 135.8037 },
  { name: '小松原バス停', lat: 34.9555, lng: 135.8943 },
  { name: '月の輪三丁目バス停', lat: 34.9818, lng: 135.9298 },
  { name: '北千町バス停', lat: 34.9546, lng: 135.8943 },
  { name: '滋賀大学バス停/滋賀大前バス停', lat: 34.9757, lng: 135.8858 },
  { name: '上千町バス停', lat: 34.9515, lng: 135.8953 },
  { name: '中千町バス停', lat: 34.953, lng: 135.8943 },
  { name: '瀬田公園バス停', lat: 34.9789, lng: 135.9413 },
  { name: '自動車教習所前バス停', lat: 34.9789, lng: 135.9429 },
  { name: '雄琴温泉バス停', lat: 35.1062, lng: 135.8906 },
  { name: 'ぜぜ自動車教習所バス停', lat: 35.0016, lng: 135.8856 },
  { name: '県立アイスアリーナバス停', lat: 34.9789, lng: 135.9451 },
  { name: 'カネボウベルパークバス停', lat: 34.9814, lng: 135.9406 },
  { name: '大津市公設市場バス停', lat: 34.9822, lng: 135.9406 },
  { name: '赤尾町バス停', lat: 34.9482, lng: 135.8966 },
  { name: '平津バス停', lat: 34.9463, lng: 135.8973 },
  { name: '稲津北口バス停', lat: 34.9442, lng: 135.9009 },
  { name: '瀬田ゴルフ場バス停', lat: 34.9602, lng: 135.9461 },
  { name: '北雄琴バス停', lat: 35.1118, lng: 135.8893 },
  { name: '南郷中学校バス停', lat: 34.9427, lng: 135.9038 },
  { name: '文化ゾーン前バス停/文化ゾーンバス停', lat: 34.9754, lng: 135.9451 },
  { name: '赤川バス停', lat: 34.9458, lng: 135.9022 },
  { name: '雄琴駅バス停', lat: 35.1017, lng: 135.8893 },
  { name: '稲津(復路)バス停', lat: 34.9416, lng: 135.90184 },
  { name: '南郷二丁目バス停', lat: 34.9388, lng: 135.9056 },
  { name: '稲津(往路)バス停', lat: 34.94191, lng: 135.90129 },
  { name: '南郷二丁目東バス停', lat: 34.9392, lng: 135.9079 },
  { name: '滋賀医大西門前バス停/医大西門バス停', lat: 34.98, lng: 135.9478 },
  { name: '北大津高校前バス停', lat: 35.1147, lng: 135.8876 },
  { name: '南郷一丁目バス停', lat: 34.942, lng: 135.9079 },
  { name: '岩間寺バス停', lat: 34.9221, lng: 135.8837 },
  { name: '上稲津バス停', lat: 34.938, lng: 135.8997 },
  { name: '東大津高校バス停', lat: 34.9657, lng: 135.9472 },
  { name: '上仰木バス停', lat: 35.1276, lng: 135.8778 },
  { name: '龍谷大学バス停', lat: 34.9952, lng: 135.9227 },
  { name: '仰木西公園前バス停', lat: 35.1259, lng: 135.8778 },
  { name: '南郷洗堰バス停/洗堰バス停', lat: 34.9472, lng: 135.9126 },
  { name: '札場バス停', lat: 34.9463, lng: 135.9102 },
  { name: '辻バス停', lat: 34.9439, lng: 135.9135 },
  { name: '黒津(往路)バス停', lat: 34.9366, lng: 135.9114 },
  { name: '湖南台住宅バス停', lat: 34.9626, lng: 135.9461 },
  { name: '黒津(復路)バス停', lat: 34.936, lng: 135.9114 },
  { name: '滋賀医大前(往路のみ)バス停/滋賀医大前バス停/滋賀医大前(復路のみ)バス停', lat: 34.9785, lng: 135.949 },
  { name: '大谷大学グランド前バス停', lat: 34.957, lng: 135.9442 },
  { name: 'けやき通りバス停', lat: 35.1235, lng: 135.8821 },
  { name: '南郷バス停', lat: 34.9338, lng: 135.9126 },
  { name: '石居口バス停', lat: 34.9328, lng: 135.9135 },
  { name: 'ゼオンポリミクスバス停', lat: 34.9304, lng: 135.9142 },
  { name: '石居町バス停', lat: 34.927, lng: 135.9142 },
  { name: '堂(復路)バス停', lat: 34.9221, lng: 135.9142 },
  { name: '仰木小学校前バス停', lat: 35.1206, lng: 135.8797 },
  { name: 'みどりヶ丘バス停', lat: 34.919, lng: 135.9142 },
  { name: '堂(往路)バス停', lat: 34.9212, lng: 135.9142 },
  { name: 'のぞみ公園前バス停', lat: 35.1206, lng: 135.8821 },
  { name: '山ノ下バス停', lat: 35.1189, lng: 135.8797 },
  { name: '仰木の里小学校前バス停', lat: 35.1189, lng: 135.8837 },
  { name: '堂橋バス停', lat: 34.9254, lng: 135.9142 },
  { name: 'レークピアセンター前バス停', lat: 35.1165, lng: 135.8856 },
  { name: '内畑バス停', lat: 34.9292, lng: 135.9229 },
  { name: '仰木の里東三丁目バス停', lat: 35.1147, lng: 135.8856 },
  { name: '堂橋(往路)バス停', lat: 34.9258, lng: 135.9143 },
  { name: '御呂戸川緑地前バス停', lat: 35.1127, lng: 135.8841 },
  { name: '平尾バス停', lat: 34.9279, lng: 135.9251 },
  { name: '岡の平バス停', lat: 34.9265, lng: 135.926 },
  { name: '仰木の里中学校前バス停', lat: 35.1098, lng: 135.8837 },
  { name: 'けやき通り東バス停', lat: 35.122, lng: 135.8837 },
  { name: '里口バス停', lat: 35.1165, lng: 135.8778 },
  { name: 'このみ公園前バス停', lat: 35.1158, lng: 135.8821 },
  { name: '下仰木バス停', lat: 35.115, lng: 135.8778 },
  { name: '太子バス停', lat: 34.9317, lng: 135.9328 },
  { name: '成安造形大学バス停', lat: 35.1075, lng: 135.8821 },
  { name: '里バス停', lat: 35.1136, lng: 135.8778 },
  { name: '十王堂前バス停', lat: 34.93, lng: 135.9328 },
  { name: '川向バス停', lat: 34.9458, lng: 135.9328 },
  { name: '田上市民センターバス停', lat: 34.9439, lng: 135.9328 },
  { name: '仰木の里東バス停', lat: 35.11, lng: 135.8856 },
  { name: '仰木の里東七丁目バス停', lat: 35.1121, lng: 135.8872 },
  { name: '新浜バス停', lat: 34.9427, lng: 135.9328 },
  { name: '中野バス停', lat: 34.9405, lng: 135.9328 },
  { name: '仰木の里バス停', lat: 35.1062, lng: 135.8856 },
  { name: 'サンシャイン入口バス停', lat: 34.9385, lng: 135.9328 },
  { name: '中野口バス停', lat: 34.9392, lng: 135.9328 },
  { name: '枝バス停', lat: 34.9372, lng: 135.9328 },
  { name: '神立(復路)バス停', lat: 34.936, lng: 135.9328 },
  { name: '衣川バス停', lat: 35.0999, lng: 135.8821 },
  { name: '神立(往路)バス停', lat: 34.9366, lng: 135.9328 },
  { name: '青山一丁目バス停', lat: 34.9571, lng: 135.9348 },
  { name: '田上小学校前バス停', lat: 34.9347, lng: 135.9328 },
  { name: 'レークピア北口バス停', lat: 35.118, lng: 135.8856 },
  { name: '松ヶ丘七丁目バス停/松が丘七丁目バス停', lat: 34.958, lng: 135.9328 },
  { name: '枝東口バス停', lat: 34.9378, lng: 135.9351 },
  { name: '平野バス停', lat: 34.9602, lng: 135.9328 },
  { name: '青山五丁目バス停', lat: 34.9515, lng: 135.9328 },
  { name: '松ヶ丘三丁目バス停/松が丘三丁目バス停', lat: 34.9538, lng: 135.9328 },
  { name: '羽栗バス停', lat: 34.9493, lng: 135.9328 },
  { name: '田上中学バス停', lat: 34.9472, lng: 135.9328 },
  { name: '関口バス停', lat: 34.9419, lng: 135.9429 },
  { name: '里南口バス停', lat: 35.1118, lng: 135.8778 },
  { name: '田上幼稚園前バス停', lat: 34.9452, lng: 135.9328 },
  { name: '森南口バス停', lat: 34.9392, lng: 135.9406 },
  { name: '森バス停', lat: 34.9385, lng: 135.942 },
  { name: '上関バス停', lat: 34.9366, lng: 135.9442 },
  { name: '上田上小学校前バス停', lat: 34.9338, lng: 135.9451 },
  { name: '仰木台東口バス停', lat: 35.1037, lng: 135.8821 },
  { name: '新免バス停', lat: 34.9317, lng: 135.9451 },
  { name: '青山七丁目バス停', lat: 34.9493, lng: 135.9328 },
  { name: '田上車庫バス停', lat: 34.9304, lng: 135.9451 },
  { name: '公民館バス停', lat: 34.9292, lng: 135.9451 },
  { name: '関ノ津バス停', lat: 34.927, lng: 135.9451 },
  { name: '仰木道バス停', lat: 35.1017, lng: 135.8797 },
  { name: '天神山バス停', lat: 34.9258, lng: 135.9451 },
  { name: '蛙岩バス停', lat: 34.9242, lng: 135.9451 },
  { name: '堅田出町バス停', lat: 35.1017, lng: 135.8856 },
  { name: '浮御堂前バス停', lat: 35.0991, lng: 135.8856 },
  { name: '東急団地入口バス停', lat: 34.909, lng: 135.9529 },
  { name: 'もみじが丘バス停', lat: 34.9079, lng: 135.9529 },
  { name: '堅田本町バス停', lat: 35.0982, lng: 135.8821 },
  { name: '桐生飛島バス停', lat: 34.9067, lng: 135.9529 },
  { name: '新川バス停', lat: 34.9056, lng: 135.9529 },
  { name: '本堅田バス停', lat: 35.097, lng: 135.8821 },
  { name: '牧バス停', lat: 34.9044, lng: 135.9529 },
  { name: '外畑バス停', lat: 34.903, lng: 135.9529 },
  { name: '末広町バス停', lat: 35.0952, lng: 135.8821 },
  { name: '本堅田三丁目バス停', lat: 35.0934, lng: 135.8821 },
  { name: '立木観音前バス停', lat: 34.9493, lng: 135.9229 },
  { name: '牧口バス停', lat: 34.9015, lng: 135.9529 },
  { name: 'アルプス登山口バス停', lat: 34.9189, lng: 135.9529 },
  { name: '白州不動尊前バス停', lat: 34.9174, lng: 135.9529 },
  { name: '曽束バス停', lat: 34.916, lng: 135.9529 },
  { name: '堅田駅口バス停', lat: 35.1037, lng: 135.8872 },
  { name: '堅田駅バス停', lat: 35.1042, lng: 135.887 },
  { name: '鹿跳橋バス停', lat: 34.9221, lng: 135.9529 },
  { name: '桐生バス停', lat: 34.9142, lng: 135.9529 },
  { name: '曽束中バス停', lat: 34.913, lng: 135.9529 },
  { name: '沢野バス停', lat: 34.9118, lng: 135.9529 },
  { name: '西大石淀町バス停', lat: 34.8988, lng: 135.9507 },
  { name: '桐生新橋バス停', lat: 34.9103, lng: 135.9529 },
  { name: '曽束口バス停', lat: 34.9107, lng: 135.9483 },
  { name: '南庄バス停', lat: 34.9084, lng: 135.9451 },
  { name: '牧東口バス停', lat: 34.9069, lng: 135.9429 },
  { name: '大石東バス停', lat: 34.9056, lng: 135.9406 },
  { name: '宮前橋バス停', lat: 34.9044, lng: 135.9385 },
  { name: '極楽橋バス停', lat: 34.903, lng: 135.9366 },
  { name: '桜公園東バス停', lat: 34.9015, lng: 135.9351 },
  { name: '大石小学校バス停', lat: 34.9004, lng: 135.9328 },
  { name: '上桐生口バス停', lat: 34.8988, lng: 135.9529 },
  { name: '桜谷口バス停', lat: 34.8988, lng: 135.9304 },
  { name: '東大石淀町バス停', lat: 34.8972, lng: 135.9507 },
  { name: 'ゴルフ場前バス停', lat: 34.896, lng: 135.928 },
  { name: '今堅田2丁目バス停', lat: 35.1062, lng: 135.8953 },
  { name: '今道内湖バス停', lat: 35.1075, lng: 135.8973 },
  { name: '倉骨バス停', lat: 34.8947, lng: 135.9261 },
  { name: '今堅田出島灯台バス停', lat: 35.109, lng: 135.8997 },
  { name: '琵琶湖大橋口バス停', lat: 35.1098, lng: 135.9015 },
  { name: '桜谷中央バス停', lat: 34.8972, lng: 135.9328 },
  { name: '郡農協前バス停', lat: 34.896, lng: 135.9351 },
  { name: '南庄道バス停', lat: 34.8947, lng: 135.9385 },
  { name: '上桐生グランド前バス停', lat: 34.8947, lng: 135.9529 },
  { name: '勾当内侍前バス停', lat: 34.8934, lng: 135.9406 },
  { name: '大野バス停', lat: 34.892, lng: 135.9429 },
  { name: '畑バス停', lat: 34.8906, lng: 135.9451 },
  { name: '中村バス停', lat: 34.8887, lng: 135.9451 },
  { name: '沢口バス停', lat: 34.887, lng: 135.9451 },
  { name: '上桐生バス停', lat: 34.8934, lng: 135.9529 },
  { name: '大石中バス停', lat: 34.896, lng: 135.9406 },
  { name: '伊香立診療所前バス停', lat: 35.151, lng: 135.9088 },
  { name: '家田道バス停', lat: 35.1487, lng: 135.9088 },
  { name: '普門バス停', lat: 35.1466, lng: 135.9088 },
  { name: '向在地道バス停', lat: 35.145, lng: 135.9073 },
  { name: '伊香立小学校前バス停', lat: 35.1432, lng: 135.906 },
  { name: '発電所前バス停', lat: 35.1417, lng: 135.9056 },
  { name: '真野浜バス停', lat: 35.1396, lng: 135.9038 },
  { name: '竜門バス停', lat: 35.1378, lng: 135.9038 },
  { name: '馬場バス停', lat: 35.1363, lng: 135.9022 },
  { name: '清風町南口バス停', lat: 35.1444, lng: 135.9015 },
  { name: '下在地バス停', lat: 35.1351, lng: 135.9022 },
  { name: '花園町バス停', lat: 35.1432, lng: 135.9009 },
  { name: '清水町バス停', lat: 35.141, lng: 135.9 },
  { name: '美空南バス停', lat: 35.1392, lng: 135.8988 },
  { name: 'びわこローズタウン口バス停', lat: 35.1378, lng: 135.8988 },
  { name: '真野中学校前バス停', lat: 35.145, lng: 135.8973 },
  { name: '北在地バス停', lat: 35.1338, lng: 135.9022 },
  { name: '清風町北口バス停', lat: 35.1458, lng: 135.9009 },
  { name: '向陽町バス停', lat: 35.1472, lng: 135.8988 },
  { name: '美空東バス停', lat: 35.1402, lng: 135.8973 },
  { name: '奥出バス停', lat: 35.132, lng: 135.9022 },
  { name: 'フレスコみどり店前バス停', lat: 35.1487, lng: 135.8973 },
  { name: 'フレスコ向陽店前バス停', lat: 35.148, lng: 135.8988 },
  { name: '陽明町北口1バス停', lat: 35.1487, lng: 135.9, },
  { name: '陽明町北口2バス停', lat: 35.1493, lng: 135.9009 },
  { name: '美空北バス停', lat: 35.1417, lng: 135.8973 },
  { name: '小野駅バス停', lat: 35.1509, lng: 135.8953 },
  { name: '真野北小前バス停', lat: 35.1524, lng: 135.8943 },
  { name: '朝日一丁目バス停', lat: 35.1539, lng: 135.8943 },
  { name: '矢筈石倉バス停', lat: 35.1633, lng: 135.8953 },
  { name: '清和町バス停', lat: 35.1557, lng: 135.8943 },
  { name: '伊香立中学校前バス停', lat: 35.1617, lng: 135.8973 },
  { name: '南朝日ニ丁目バス停', lat: 35.1568, lng: 135.8943 },
  { name: '湖青一丁目バス停', lat: 35.1582, lng: 135.8943 },
  { name: '緑町北口バス停', lat: 35.1595, lng: 135.8943 },
  { name: '榛原の里バス停', lat: 35.1604, lng: 135.8953 },
  { name: '中垣内バス停', lat: 35.1663, lng: 135.9009 },
  { name: '北朝日ニ丁目バス停', lat: 35.1578, lng: 135.8953 },
  { name: '小田原口バス停', lat: 35.1648, lng: 135.9022 },
  { name: '龍華バス停', lat: 35.1633, lng: 135.9038 },
  { name: '龍華道バス停', lat: 35.1624, lng: 135.9022 },
  { name: '小野小学校前バス停', lat: 35.1609, lng: 135.8997 },
  { name: '水明一丁目バス停', lat: 35.1595, lng: 135.8988 },
  { name: '小田原バス停', lat: 35.1663, lng: 135.9038 },
  { name: '北部クリーンセンター前バス停', lat: 35.17, lng: 135.9056 },
  { name: '脇出バス停', lat: 35.1687, lng: 135.9056 },
  { name: '水明南口バス停', lat: 35.1582, lng: 135.8997 },
  { name: '還来神社前バス停', lat: 35.172, lng: 135.9056 },
  { name: '小野バス停', lat: 35.1546, lng: 135.8966 },
  { name: '上龍華バス停', lat: 35.164, lng: 135.9056 },
  { name: '下龍華バス停', lat: 35.1617, lng: 135.9056 },
  { name: '栗原道バス停', lat: 35.1764, lng: 135.906 },
  { name: '小野神社前バス停', lat: 35.1568, lng: 135.8997 },
  { name: '大津赤十字滋賀病院バス停', lat: 35.0155, lng: 135.8605 },
  { name: '和迩中バス停', lat: 35.1789, lng: 135.9038 },
  { name: '途中バス停', lat: 35.1788, lng: 135.8562 },
  { name: '榎バス停', lat: 35.1804, lng: 135.9038 },
  { name: '和邇小学校前バス停', lat: 35.1824, lng: 135.9038 },
  { name: '栗原バス停', lat: 35.1779, lng: 135.9056 },
  { name: '妙道会聖地バス停', lat: 35.1834, lng: 135.9022 },
  { name: '桐生辻バス停', lat: 34.909, lng: 135.9507 },
  { name: '和邇駅バス停', lat: 35.1848, lng: 135.9022 },
  { name: '上の町バス停/上ノ町バス停', lat: 35.1866, lng: 135.9009 },
  { name: '納所バス停', lat: 35.1887, lng: 135.8988 },
  { name: '花折峠口バス停', lat: 35.1906, lng: 135.861 },
  { name: '大鳥居バス停', lat: 35.1994, lng: 135.8618 },
  { name: '平バス停', lat: 35.2045, lng: 135.8618 },
  { name: 'びわ湖バレイ口バス停/びわ湖バレイ前バス停', lat: 35.2091, lng: 135.8618 },
  { name: '近江木戸バス停', lat: 35.2227, lng: 135.8754 },
  { name: '新道足尾谷橋バス停', lat: 35.2158, lng: 135.864 },
  { name: '志賀駅バス停', lat: 35.2198, lng: 135.8687 },
  { name: '木戸口バス停', lat: 35.2242, lng: 135.8762 },
  { name: '葛川学校前バス停', lat: 35.2536, lng: 135.8458 },
  { name: '葛川中村バス停', lat: 35.257, lng: 135.8428 },
  { name: '下中村バス停', lat: 35.2601, lng: 135.8407 },
  { name: '郵便局前バス停/葛川郵便局バス停', lat: 35.2625, lng: 135.8391 },
  { name: '坊村バス停', lat: 35.2683, lng: 135.836 },
  { name: '町居バス停', lat: 35.2758, lng: 135.8344 },
  { name: '葛川梅の木バス停/梅ノ木バス停', lat: 35.281, lng: 135.8328 },
  { name: '下梅の木バス停', lat: 35.2831, lng: 135.8328 },
  { name: '上貫井バス停', lat: 35.1912, lng: 135.8973 },
  { name: '貫井バス停', lat: 35.19, lng: 135.8973 },
  { name: '細川バス停', lat: 35.2902, lng: 135.8328 }
];

const getDistance = (lat1, lng1, lat2, lng2) => {
  // Haversine 公式
  const toRad = (value) => (value * Math.PI) / 180;
  const R = 6371000; // 地球の半径(m)
  const dLat = toRad(lat2 - lat1);
  const dLng = toRad(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRad(lat1)) *
      Math.cos(toRad(lat2)) *
      Math.sin(dLng / 2) *
      Math.sin(dLng / 2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return R * c;
};

const MapDisplay = () => {
  const [currentPosition, setCurrentPosition] = useState(null);
  const [mapError, setMapError] = useState(null);
  const [showBusStops, setShowBusStops] = useState(false);
  const [search, setSearch] = useState('');
  const [suggestions, setSuggestions] = useState([]);
  const [selectedBusStop, setSelectedBusStop] = useState(null);
  const [mapInstance, setMapInstance] = useState(null);
  const [nearbyBusStops, setNearbyBusStops] = useState([]);

  // デフォルトのセンター (例: 大津市役所)
  const defaultCenter = {
    lat: 35.0130, // 大津市役所の緯度
    lng: 135.8625 // 大津市役所の経度
  };

  const mapContainerStyle = {
    width: '100%',
    height: '140vh', // 地図の高さ (画面の高さの70%)
    minHeight: '800px', // 最低でも400pxの高さ
    borderRadius: '0.5rem', // 角丸
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)', // 影
  };

  // ユーザーの現在位置を取得する関数
  const getCurrentLocation = useCallback(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentPosition({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          });
          setMapError(null); // エラーメッセージをクリア
        },
        (error) => {
          console.warn("位置情報の取得エラー:", error.message);
          setMapError(`位置情報を取得できませんでした (エラーコード: ${error.code})。\nデフォルトの地点（大津市役所付近）を表示します。`);
          setCurrentPosition(defaultCenter); // エラー時はデフォルト地点に設定
        },
        { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 } // 取得オプション
      );
    } else {
      setMapError("お使いのブラウザは位置情報機能に対応していません。\nデフォルトの地点（大津市役所付近）を表示します。");
      setCurrentPosition(defaultCenter); // 対応していない場合もデフォルト地点に設定
    }
  }, [defaultCenter]); // defaultCenter が変わらない限り再生成しない

  // コンポーネントが読み込まれたときに一度だけ現在位置を取得
  useEffect(() => {
    getCurrentLocation();
  }, [getCurrentLocation]);

  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // 予測変換
  useEffect(() => {
    if (search.length === 0) {
      setSuggestions([]);
      return;
    }
    setSuggestions(
      busStops.filter((stop) =>
        stop.name.toLowerCase().includes(search.toLowerCase())
      ).slice(0, 10)
    );
  }, [search]);

  // バス停選択時に地図を移動
  useEffect(() => {
    if (selectedBusStop && mapInstance) {
      mapInstance.panTo({ lat: selectedBusStop.lat, lng: selectedBusStop.lng });
      mapInstance.setZoom(17);
    }
  }, [selectedBusStop, mapInstance]);

  // 「近くのバス停を検索」ボタン押下時
  const handleShowNearbyBusStops = () => {
    if (!currentPosition) return;
    const filtered = busStops.filter((stop) => {
      const dist = getDistance(
        currentPosition.lat,
        currentPosition.lng,
        stop.lat,
        stop.lng
      );
      return dist <= 500;
    });
    setNearbyBusStops(filtered);
    setShowBusStops(true);
  };

  if (!apiKey) {
    return (
      <div className="p-4 text-center text-red-600 bg-red-100 rounded-md">
        Google Maps APIキーが設定されていません。環境変数を確認してください。
      </div>
    );
  }

  return (
    <>
      {/* 検索欄 */}
      <div className="w-full max-w-md mx-auto mb-4 relative">
        <input
          type="text"
          className="w-full border rounded-md px-4 py-2 text-lg"
          placeholder="バス停名を検索"
          value={search}
          onChange={e => {
            setSearch(e.target.value);
            setSelectedBusStop(null);
          }}
          onBlur={() => {
            // 入力値がバス停名と一致する場合、そのバス停を選択
            const found = busStops.find(
              stop => stop.name === search
            );
            if (found) {
              setSelectedBusStop(found);
            }
          }}
          onKeyDown={e => {
            if (e.key === 'Enter') {
              const found = busStops.find(
                stop => stop.name === search
              );
              if (found) {
                setSelectedBusStop(found);
                setSuggestions([]);
              }
            }
          }}
          autoComplete="off"
        />
        {suggestions.length > 0 && (
          <ul className="absolute z-10 bg-white border w-full rounded shadow max-h-60 overflow-y-auto">
            {suggestions.map((stop, idx) => (
              <li
                key={stop.name + idx}
                className="px-4 py-2 hover:bg-blue-100 cursor-pointer"
                onClick={() => {
                  setSearch(stop.name);
                  setSelectedBusStop(stop);
                  setSuggestions([]);
                }}
              >
                {stop.name}
              </li>
            ))}
          </ul>
        )}
      </div>
      <button
        className="px-6 py-3 bg-blue-600 text-white rounded-md font-semibold shadow hover:bg-blue-700 transition mb-4"
        onClick={handleShowNearbyBusStops}
      >
        近くのバス停を検索
      </button>
      <LoadScript
        googleMapsApiKey={apiKey}
        libraries={['places']}
      >
        {mapError && (
          <p className="text-orange-600 bg-orange-100 p-3 rounded-md text-center mb-3 text-sm whitespace-pre-line">
            {mapError}
          </p>
        )}
        {currentPosition ? (
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            center={
              selectedBusStop
                ? { lat: selectedBusStop.lat, lng: selectedBusStop.lng }
                : currentPosition
            }
            zoom={selectedBusStop ? 17 : 15}
            onLoad={map => setMapInstance(map)}
            options={{
              streetViewControl: false,
              mapTypeControl: false,
              fullscreenControl: true,
              zoomControl: true,
            }}
          >
            {/* 現在地マーカー */}
            <MarkerF
              position={currentPosition}
              title="あなたの現在地 (またはその周辺)"
              icon={{
                url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png',
              }}
            />
            {/* バス停マーカー（半径500m以内のみ表示） */}
            {showBusStops &&
              nearbyBusStops.map((stop, idx) => (
                <MarkerF
                  key={idx}
                  position={{ lat: stop.lat, lng: stop.lng }}
                  title={stop.name}
                  label={{
                    text: stop.name,
                    color: '#333',
                    fontWeight: 'bold',
                    fontSize: '14px',
                  }}
                  icon={{
                    url: 'http://maps.google.com/mapfiles/ms/icons/red-dot.png',
                  }}
                />
              ))}
            {/* 検索で選択したバス停を強調 */}
            {selectedBusStop && (
              <MarkerF
                position={{ lat: selectedBusStop.lat, lng: selectedBusStop.lng }}
                title={selectedBusStop.name}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/green-dot.png',
                }}
              />
            )}
          </GoogleMap>
        ) : (
          <div className="flex items-center justify-center text-lg text-gray-600 dark:text-gray-400" style={mapContainerStyle}>
            地図を読み込み中か、位置情報を取得中です...
          </div>
        )}
      </LoadScript>
    </>
  );
};

export default MapDisplay;