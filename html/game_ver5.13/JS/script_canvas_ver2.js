/// <reference path="createJS.js" />

//ポップアップとボタン

//データをやり取りするにはPHPが必要


// 基本プロパティ //
{

    //デモモードをONにするか
    var demonstration_MODE = false;
    //trueで1回ずつだけ。ジレンマは4回
    var demonstration_list = false;
    var demo_svo_angle = -5;
    var demo_emotion = true;
    var demo_position_change = false;

    //デモモード時の実行関数
    function setDemoPara(){

        //SVO
        CP_angle = Math.PI / 180 * demo_svo_angle;

        //CP_angle = demo_svo_angle;
        self_weight = Math.cos(CP_angle);
        other_weight = Math.sin(CP_angle);
        console.log("demo self : " + self_weight);
        console.log("demo other : " + other_weight);

        //表情変化
        QUAL_faceMotion_flag = demo_emotion;

        //反転か
        QUAL_PD_change_flag = demo_position_change;

        console.log("demo mode:");
        console.log("demo SVO angle :"+demo_svo_angle);
        console.log("demo emotion expression :"+QUAL_faceMotion_flag);
        console.log("demo position change :"+QUAL_PD_change_flag);
    }

    //クオルトリクスモードか
    var qualtlics_MODE = false;

    //デバッグモードか
    var DEBUG = false;
    //var DEBUG = false;
    if (DEBUG) console.log("DEBUG : " + DEBUG);

    //選択肢のテキスト
    var C_NAME = "緑";
    var C_save_NAME = "C";

    var D_NAME = "青";
    var D_save_NAME = "D";

    //プレイヤーネーム
    var PLAYER_NAME = "あなた";
    var CP_NAME = "ひより";

    //選んだ手の名前
    var PLAYER_CHOICE = C_NAME;
    var CP_CHOICE = C_NAME;

    //その1手で得られる得点
    var PLAYER_GET = 0;
    var CP_GET = 0;

    //本番ゲームのラウンド
    var Round_toReal_Number = 0;

    if (DEBUG) {
        Round_toReal_Number = 12 - 1;
    } else {
        Round_toReal_Number = 11 - 1;
    }

    //次へボタン
    var NEXT_NAME = "次へ";

    //ゲームの名前
    var STAGHUNT = "SH";
    var PDILEMMA = "PD";

    //ノーマル名
    var NORMAL = "_Nor";
    //リバース名
    var REVERSED = "_Rev";

    //囚人のジレンマの回数
    var HOW_TIMES_DILEMMA = 5;

    if (DEBUG && demonstration_list) HOW_TIMES_DILEMMA = 4;


    //重み、角度は、-45,-5,5,45
    //コンピュータの重みself、相手に対する重みother
    var CP_angle = 0;
    var self_weight = Math.cos(CP_angle);
    var other_weight = Math.sin(CP_angle);

    //ランダムに角度を決定する関数
    function SetRandomAngle() {
        var angle;
        var set_type;
        //クオルトリクス上ならクオルトリクスでランダマイズする。
        if (qualtlics_MODE) {
            /*
            if(QUAL_angle == "-45"){
                set_type = -45;
            }else if(QUAL_angle == "-5"){
                set_type = -5;
            }else if(QUAL_angle == "5"){
                set_type = 5;
            }else{
                set_type = 45;
            }*/

            set_type = Number(QUAL_angle);
            //5度×　マイナス9か、マイナス1か、1か、9
            angle = Math.PI / 180 * set_type;
            //self_weight = Math.cos(angle);
            //other_weight = Math.sin(angle);

        } else {
            //このプログラム上での実行
            var randomizer = Math.floor(Math.random() * 4.0);
            if (randomizer == 0) {
                set_type = -45;
            } else if (randomizer == 1) {
                set_type = -5;
            } else if (randomizer == 2) {
                set_type = 5;
            } else {
                set_type = 45;
            }

            angle = Math.PI / 180 * set_type;
            //self_weight = Math.cos(angle);
            //other_weight = Math.sin(angle);

            var randomizer_face = Math.floor(Math.random() * 2.0);
            if (randomizer_face == 0) {
                QUAL_faceMotion_flag = true;
            } else{
                QUAL_faceMotion_flag = false;
            }
        }

        if (DEBUG) {
            console.log("angle : " + set_type + "° :");
        }

        CP_angle = angle;

        if(demonstration_MODE){
            CP_angle =  Math.PI / 180 * demo_svo_angle;
        }

        self_weight = Math.cos(angle);
        other_weight = Math.sin(angle);

        if (DEBUG) console.log("self : " + self_weight);
        if (DEBUG) console.log("other : " + other_weight);

    };

    //SetRandomAngle();
    //if(DEBUG)console.log("self : " + self_weight);
    //if(DEBUG)console.log("other : " + other_weight);

}


// 変数ゾーン //
{
    //ゲームのステージ
    var game_stage;
    //キャンバスの大きさ
    var canvasWidth;
    var canvasHeight;

    //マトリックスのリスト
    var matrix_list = [[20, 3, 1, 0, 0, 1, 1, 1]];
    const en = 9;

    //マトリックスリストの長さ
    var list_length = matrix_list.length;
    //現在のラウンド
    var round = 0;
    //現在のマトリックス
    var choice_matrix = matrix_list[round];
    //マトリックスに配置されている数値、ペイオフ値
    var a = choice_matrix[0];
    var b = choice_matrix[1];
    var c = choice_matrix[2];
    var d = choice_matrix[3];
    var e = choice_matrix[4];
    var f = choice_matrix[5];
    var g = choice_matrix[6];
    var h = choice_matrix[7];

    //鹿狩りSHのマトリックスを入れ替えるための箱
    var SH_normal_list = [];
    var SH_reverse_list = [];
    //反転かのリスト
    var SH_position_change_flag_list = [];

    //囚人のジレンマPDのマトリックスを入れ替えるか否かの箱
    var PD_normal_list;
    var PD_reverse_list;
    var PD_position_change_flag_list = [];

    //エージェントの評価値のリスト
    //配列で1つのマトリックスから獲得させる
    //同じ評価値ははじく
    var CP_Row_list = [];

    //評価値の計算
    function caluculateRowAndIntoList(PL_value, CP_value) {
        var row_value;

        row_value = self_weight * CP_value + other_weight * PL_value;

        if (!(CP_Row_list.includes(row_value))) {
            CP_Row_list.push(row_value);
        }

    }

    //降順化のための関数
    function compareFunction(a, b) {
        return a - b;

    }

    //array.indexOf(11);
    //リストのどこにあるか

    //マトリックスを初期化する。m_sizeで範囲を指定する
    function mat(m_size) {
        var staghunt = [];
        var pd = [];
        for (var a = 0; a < m_size; a++) {
            for (var b = 0; b < m_size; b++) {
                for (var c = 0; c < m_size; c++) {
                    for (var d = 0; d < m_size; d++) {
                        for (var e = 0; e < m_size; e++) {
                            for (var f = 0; f < m_size; f++) {
                                for (var g = 0; g < m_size; g++) {
                                    for (var h = 0; h < m_size; h++) {
                                        //stag hunt
                                        if (a == b && g == h && c == f && d == e && a > d && d >= g && g > c) {
                                            //配列にプッシュ
                                            //staghunt.push([b, a, d, c, f, e, h, g, STAGHUNT]);
                                            SH_normal_list.push([b, a, d, c, f, e, h, g, STAGHUNT + NORMAL,false]);
                                            
                                            //配列に設定
                                            //上下左右入れ替えたもの
                                            SH_reverse_list.push([h, g, f, e, d, c, b, a, STAGHUNT + REVERSED,true]);

                                            //上下左右入れ替えたもの
                                            //if(!DEBUG)staghunt.push([h, g, f, e, d, c, b, a, STAGHUNT+REVERSED]);

                                        } else if (a == b && g == h && c == f && d == e && d > a && a > g && g > c) {
                                            //配列に代入
                                            PD_normal_list = [b, a, d, c, f, e, h, g, PDILEMMA + NORMAL,false];
                                            //pd.push([b, a, d, c, f, e, h, g, "PD"]);

                                            PD_reverse_list = [h, g, f, e, d, c, b, a, PDILEMMA + REVERSED,true];
                                            //pd.push([h, g, f, e, d, c, b, a, "PD_reversed"]);
                                        }

                                    }
                                }
                            }
                        }
                    }
                }
            }
        }
        var matrix_list = [];

        //得られたリストに関して並び替え
        //参考：配列の要素の並びをシャッフルする。
        //GRAY CODE
        //フィッシャーアルゴリズムに基づく
        function ListShuffle(list = [[1, 2], [2, 3], [3, 4]]) {
            for (var i = list.length - 1; i > 0; i--) {
                var rand = Math.floor(Math.random() * (i + 1));
                if (DEBUG) console.log(i + ":  :" + rand);

                var box = list[i];
                list[i] = list[rand];
                list[rand] = box;
            }

            if (DEBUG) {
                for (var i = 0; i < list.length; i++) {
                    console.log(list[i]);
                }
            }
            console.log("shuffle:complete")
            return list;

        }

        //ListShuffle([1,2,3,4,5,6]);

        //配列を2倍に
        staghunt = staghunt.concat(SH_normal_list);
        staghunt = staghunt.concat(SH_reverse_list);

        //通常配列のみ
        if (DEBUG && demonstration_list) {
            staghunt = [];
            staghunt = staghunt.concat(SH_normal_list);
            //staghunt = staghunt.concat([[5,4,5,4,2,3,2,3,"goshi_nisan",true]]);
        }
        
        staghunt = ListShuffle(staghunt);

        Round_toReal_Number = staghunt.length;

        //結合
        matrix_list = matrix_list.concat(staghunt);

        if (QUAL_PD_change_flag) {
            for (var i = 0; i < HOW_TIMES_DILEMMA; i++) {
                pd.push(PD_reverse_list);
            }

        } else {
            for (var i = 0; i < HOW_TIMES_DILEMMA; i++) {
                pd.push(PD_normal_list);
            }

        }
        matrix_list = matrix_list.concat(pd);
        //if (DEBUG && demonstration_list) matrix_list.push([en, en, en, en, en, en, en, en, "End",true]);
        if (DEBUG) console.log("matrilx list length : " + matrix_list.length);

        choice_matrix = matrix_list[0];
        a = choice_matrix[0];
        b = choice_matrix[1];
        c = choice_matrix[2];
        d = choice_matrix[3];
        e = choice_matrix[4];
        f = choice_matrix[5];
        g = choice_matrix[6];
        h = choice_matrix[7];

        //評価値を計算
        for (var i = 0; i < matrix_list.length; i++) {
            for (var j = 0; j < 4; j++) {
                caluculateRowAndIntoList(matrix_list[i][j * 2], matrix_list[i][j * 2 + 1]);
            }

        }

        //リストをソート
        CP_Row_list.sort(compareFunction);


        if(DEBUG){
            //もう表示したか？
            var test_list = [];

            console.log("angle: "+CP_angle / Math.PI * 180);
        /*
        //評価値を再計算し、表示する
        for (var i = 0; i < matrix_list.length; i++) {
            for (var j = 0; j < 4; j++) {
                var row_value;

                row_value = self_weight * matrix_list[i][j * 2 + 1] + other_weight * matrix_list[i][j * 2];

                var index_row = CP_Row_list.indexOf(row_value);
                var CP_Row_list_harf = (CP_Row_list.length - 1) / 2;

                var words;
                
                //低評価
                if (index_row < CP_Row_list_harf) {
                    words = "bad";
                //高評価
                } else if (index_row >= CP_Row_list_harf) {
                    words = "good";
                //可不可なし
                } else {
                    words = "neutral";
                }

                var coiiii = matrix_list[i][j * 2] * 10 + matrix_list[i][j * 2 + 1];

                if (!(test_list.includes(coiiii))) {
                    test_list.push(coiiii);

                    console.log("CPs :"+matrix_list[i][j * 2 + 1]+", PLs :"+matrix_list[i][j * 2]+" == "+words);
                }

                //console.log("CPs :"+matrix_list[i][j * 2 + 1]+", PLs :"+matrix_list[i][j * 2]+" == "+words);
            }
        }*/

            //無理やり表示させるか
            //この角度の場合の評価表を、Excelに書いたように表示させる
            var excel_list = [
                [2,2,0,1,1,0,1,1,"sh1","SH"],
                [3,3,0,1,1,0,1,1,"sh2","SH"],
                [3,3,0,2,2,0,1,1,"sh3","SH"],
                [3,3,0,2,2,0,2,2,"sh4","SH"],
                [3,3,1,2,2,1,2,2,"sh5","SH"],
                [2,2,0,3,3,0,1,1,"pd_","PD"]];

            function Round_Size(value_e , round_SIZE=2){
                return Math.round(value_e * (10 ** round_SIZE)) / (10 ** round_SIZE);

            }

            var hmoo_list = [];

            for(var i=0;i<excel_list.length;i++){
                var orien_words = String(CP_angle / Math.PI * 180) + " & "
                 + String(Round_Size(self_weight)) + " & "
                 + String(Round_Size(other_weight)) + " & ";
                console.log(excel_list[i][8]+" list:");

                var CC_ec_list = [];
                for(var j=0;j<4;j++){
                    //console.log("prin"+i);

                    var row_value;

                    row_value = self_weight * excel_list[i][j * 2] + other_weight * excel_list[i][j * 2 + 1];
                    //console.log(row_value);
                    CC_ec_list = CC_ec_list.concat([[row_value]]);

                    orien_words += String(Round_Size(row_value)) + " & ";

                    var index_row = CP_Row_list.indexOf(row_value);
                    var CP_Row_list_harf = (CP_Row_list.length - 1) / 2;

                    var words;
                
                    //低評価
                    if (index_row < CP_Row_list_harf) {
                        words = "bad";
                    //高評価
                    } else if (index_row >= CP_Row_list_harf) {
                        words = "good";
                    //可不可なし
                    } else {
                        words = "neutral";
                    }

                    //var coiiii = matrix_list[i][j * 2] * 10 + matrix_list[i][j * 2 + 1];

                    //if (!(test_list.includes(coiiii))) {
                    //    test_list.push(coiiii);

                        console.log("CPs :"+excel_list[i][j * 2]+", PLs :"+excel_list[i][j * 2 + 1]+" == "+words);
                        console.log(row_value);
                    //}
                }

                var C_epu = CC_ec_list[0]/2+CC_ec_list[1]/2;
                var D_epu = CC_ec_list[2]/2+CC_ec_list[3]/2;

                orien_words += String(Round_Size(C_epu)) + " & ";
                orien_words += String(Round_Size(D_epu)) + " & ";


                var C_sname;
                var D_sname;

                if(excel_list[i][9] == "SH"){
                    C_sname = "S";
                    D_sname = "H";

                }else if(excel_list[i][9] == "PD"){
                    C_sname = "C";
                    D_sname = "D";

                }else{
                    C_sname = "C";
                    D_sname = "D";
                }

                if(C_epu - D_epu >= 0){
                    //orien_words += "C";
                    orien_words += C_sname;

                }else{
                    //orien_words += "D";
                    orien_words += D_sname;
                }

                console.log(orien_words);
                console.log(CC_ec_list);

                hmoo_list = hmoo_list.concat([orien_words]);


            }
            for(var i=0;i<hmoo_list.length;i++){
                console.log(hmoo_list[i]);
            }

        }
        

        CP_Row_list.sort(compareFunction);

        //評価値はマトリックスに依存するので、結構少なくなる
        if (DEBUG) console.log("CP row List : ");
        if (DEBUG) console.log(CP_Row_list);
        if (DEBUG){
            var ppp_list = [];
            for(var i=0;i<CP_Row_list.length;i++){
                ppp_list = ppp_list.concat([Round_Size(CP_Row_list[i])]);
            }
            console.log(ppp_list);
        }


        return matrix_list;

    }

    //数値を初期化
    function resetMatrixValue() {
        //現在のマトリックス
        choice_matrix = matrix_list[round];
        //マトリックスに配置されている数値、ペイオフ値
        a = choice_matrix[0];
        b = choice_matrix[1];
        c = choice_matrix[2];
        d = choice_matrix[3];
        e = choice_matrix[4];
        f = choice_matrix[5];
        g = choice_matrix[6];
        h = choice_matrix[7];

    }
}

//得点、スコア
var cpu_score = 0;
var player_score = 0;

//モノトーン
var black_color = "rgba(0,0,0,0.8)";
var white_color = "rgba(250,250,250,1.0)";
var gray_color = "rgba(100,100,100,0.8)";

//色
var cpu_color = "rgba(100,200,200,0.8)";
var player_color = "rgba(200,200,100,0.8)";

cpu_color = white_color;
player_color = white_color;


// 保存プロパティ //
{
    //プレイヤーの手のリスト
    var PLAYER_LIST = [];
    //出力用
    var PLAYER_LIST_to_QUAL = "";

    //CPの手のリスト
    var CP_LIST = [];
    //出力用
    var CP_LIST_to_QUAL = "";
    //CPの重み
    var CP_SELF_WEIGHT_to_QUAL;
    var CP_OTHER_WEIGHT_to_QUAL;

    //マトリックスリスト
    var MATRIX_LIST = [];
    //出力用
    var MATRIX_LIST_to_QUAL = "";

    //反転か同化のリスト
    //var MATRIX_REVERSED_LIST = [];
    //出力用
    var MATRIX_REVERSED_LIST_to_QUAL = "";

    //プレイヤーが得た得点
    var PLAYER_SCORE = 0;

    //表情変化の有り無し
    //var FACE_MOTION_FLAG_to_QUAL;
    //最後のPDの種類（Normal or Reversed
    //var FINAL_PD_CHANGED_FLAG_to_QUAL;


}

//出力データの表示
function openResult() {

    for (var i = 0; i < PLAYER_LIST.length; i++) {
        PLAYER_LIST_to_QUAL += String(PLAYER_LIST[i]);
    }

    for (var i = 0; i < CP_LIST.length; i++) {
        CP_LIST_to_QUAL += String(CP_LIST[i]);
    }

    MATRIX_LIST = matrix_list;
    for (var i = 0; i < MATRIX_LIST.length; i++) {
        for (var j = 0; j < MATRIX_LIST[i].length-1; j++) {
            MATRIX_LIST_to_QUAL += String(MATRIX_LIST[i][j]);
        }
        MATRIX_LIST_to_QUAL += " , ";

        //リストの最後がtrueならそれを入れる
        //falseならそれを入れる
        //if([MATRIX_LIST[i][MATRIX_LIST[i].length-1]]){
        MATRIX_REVERSED_LIST_to_QUAL += String(MATRIX_LIST[i][MATRIX_LIST[i].length-1])+" , ";
    }

    CP_SELF_WEIGHT_to_QUAL = self_weight;
    CP_OTHER_WEIGHT_to_QUAL = other_weight;

    if (DEBUG) {
        console.log("ゲーム情報: " + MATRIX_LIST);
        console.log("反転 情報: "+ MATRIX_REVERSED_LIST_to_QUAL);
        console.log(PLAYER_NAME + "の選んだ手: " + PLAYER_LIST);
        console.log(CP_NAME + "の選んだ手: " + CP_LIST);

        console.log("to Qualtrics Dates: ");
        console.log("player code : " + PLAYER_LIST_to_QUAL);
        console.log("cp code : " + CP_LIST_to_QUAL);
        console.log("matrix code : " + MATRIX_LIST_to_QUAL);
        console.log("position code: "+ MATRIX_REVERSED_LIST_to_QUAL);

        console.log("PLAYER SCORE : " + PLAYER_SCORE);
        console.log()
    }
}



//クオルトリクスゾーン

//シングルクオーテーション＋jQueryで参照可能。
//追加も同様に可能だが、いずれも次のページへ行かないと反映されない。
//console.log("test : LOG_change : "+ '${e://Field/LOG_change}');

//反映方法。
//こちらが上記で書かれた反映されないもの。
//キー、入力値。
//Qualtrics.SurveyEngine.setEmbeddedData("LOG_stat",44);

//クオルトリクスのデータ用のプロパティ変数
{
    //クオルトリクスの角度
    var QUAL_angle = 0;

    //表情変化有りか、無しかのフラグ
    var QUAL_faceMotion_flag = true;

    //最後の囚人のジレンマをCD入れ替えかのフラグ
    var QUAL_PD_change_flag = true;



    //デフォルトの表情
    var QUAL_face_default = "https://rc1userv5pwvgnvtxbwj.au1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_9BSZtkPw37qroRE";
    var default_face_f = true;
    //クオルトリクスから受け取る表情データを入れるリスト
    var QUAL_face_list = [];
    var face_list_flag = [];

    if(!qualtlics_MODE){
        QUAL_face_list.push(["https://rc1userv5pwvgnvtxbwj.au1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_1SIRolaixTjx3mu"]);
        face_list_flag.push([false]);
        QUAL_face_list.push(["https://rc1userv5pwvgnvtxbwj.au1.qualtrics.com/ControlPanel/Graphic.php?IM=IM_b89sEu4hhAIGcpE"]);
        face_list_flag.push([false]);
    }

    //フラグの初期化
    function resetFaceFlags() {
        default_face_f = false;
        for (var i = 0; i < face_list_flag.length; i++) {
            face_list_flag[i] = false;
        }
    }


}

//クオルトリクスの変数
/*
//もらう側
angle : SVO角度
faceMotion_flag : 表情変化するか
PD_change_flag : 最後のジレンマは入れ替えるか

face_pettern_default : デフォルト表情
face_pettern_(Number) : 表情差分、小さい程低評価



//送る側
PLAYER_LIST : プレイヤーの選択した手
CP_LIST : CPの選択した手
MATRIX_LIST : 行われたゲームの順番
CP_SELF_WEIGHT : CPにとって、CPに対する重み
CP_OTHER_WEIGHT : CPにとって、プレイヤーに対する重み

*/

//クオルトリクスの初期化、変数とか
function initQualtrics(that) {
    //Qualtrics.SurveyEngine.disableNextButton();
    //Qualtrics.SurveyEngine.hideNextButton();

    that.disableNextButton();
    that.hideNextButton();

    QUAL_angle = '${e://Field/angle}';

    if ('${e://Field/faceMotion_flag}' == "true") {
        QUAL_faceMotion_flag = true;
    } else {
        QUAL_faceMotion_flag = false;
    }
    if (DEBUG) {
        QUAL_faceMotion_flag = true;
    }

    if ('${e://Field/PD_change_flag}' == "false") {
        QUAL_PD_change_flag = false;
    } else {
        QUAL_PD_change_flag = true;
    }


    QUAL_face_default = '${e://Field/face_pattern_default}'

    function QualFacePush(singles, singles_flag = false) {
        QUAL_face_list.push([singles]);
        face_list_flag.push([singles_flag]);
    }

    //QUAL_face_list = [];
    //face_list_flag = [];
    //表情差分の数だけ実行、小さい数字ほど低評価
    QualFacePush('${e://Field/face_pattern_0}');
    QualFacePush('${e://Field/face_pattern_1}');


}

//クオルトリクスのプロパティ変数に値を設定する関数
function setQualtricsProperties(that) {

    Qualtrics.SurveyEngine.setEmbeddedData("PLAYER_LIST", PLAYER_LIST_to_QUAL);
    Qualtrics.SurveyEngine.setEmbeddedData("CP_LIST", CP_LIST_to_QUAL);
    Qualtrics.SurveyEngine.setEmbeddedData("MATRIX_LIST", MATRIX_LIST_to_QUAL);
    Qualtrics.SurveyEngine.setEmbeddedData("POSITION_LIST", MATRIX_REVERSED_LIST_to_QUAL);
    Qualtrics.SurveyEngine.setEmbeddedData("CP_SELF_WEIGHT", CP_SELF_WEIGHT_to_QUAL);
    Qualtrics.SurveyEngine.setEmbeddedData("CP_OTHER_WEIGHT", CP_OTHER_WEIGHT_to_QUAL);
    Qualtrics.SurveyEngine.setEmbeddedData("PLAYER_SCORE", PLAYER_SCORE);

}

//クオルトクスに反映する関数
//最後に実行される
function endAndNextQualtrics(that) {

    setQualtricsProperties(that);
    //Qualtrics.SurveyEngine.clickNextButton();
    that.clickNextButton();
}



// 関数ゾーン //

//ロード時に、initを実行
window.addEventListener("load", init);

//初期化関数、init、最初に1回実行される
function init(that = "") {

    //角度をセット
    SetRandomAngle();

    if(demonstration_MODE){
        setDemoPara();
    }

    //画像をプリロード
    imagePreLoad();
    //マトリックスをセット、長さも取得
    matrix_list = mat(4);
    if (DEBUG) console.log(matrix_list);
    list_length = matrix_list.length;
    resetMatrixValue();
    //キャンバス情報を取得、キャンバス扱いに
    const gameCanvas = /** @type {HTMLCanvasElement} */ (document.getElementById("myCanvasBottom"));
    //横、縦の大きさも取得
    canvasWidth = gameCanvas.width;
    canvasHeight = gameCanvas.height;
    //ステージを取得
    game_stage = new createjs.Stage("myCanvasBottom");

    //ゲームコントロールのclass
    var game = new GameControl(that);

    //準備ができたら思考開始
    AI_brain = new AgentBrain(self_weight, other_weight);
    AI_brain.think();


    //ウィンドウのタイミングに合わせる
    createjs.Ticker.timingMode = createjs.Ticker.RAF;

    // 自動的に画面更新させます。
    createjs.Ticker.addEventListener("tick", game_stage);

}

//画像をプリロードする
function imagePreLoad() {

    //画像のロード関数
    function imageLoad(Image, ImageSrc) {
        try {
            Image.src = ImageSrc;
            Image.onload = () => {
                console.log("load : complete  : " + String(ImageSrc));
            }
        } catch (e) {
            console.log(e);
        }

    }

    //imageLoad(deer_image,"./images/deer.png");
    //imageLoad(think_image,"./images/fukidashi02.png");
    //imageLoad(vote_image,"./images/fukidashi14.png");

}

// =================== 正規分布 連続 ===================
function xRandomNormal(average, deviation) {
    var z01 = 0;                  // 標準正規分布（０，１）に従う乱数
    for (var i = 1; i <= 12; i++) {   // 中心極限定理により１２個の一様乱数は正規分布になる
        z01 = z01 + Math.random();
    }
    z01 = z01 - 6;
    return (average + z01) + (deviation * z01);
}

// =================== 正規分布（上下限） 連続 ===================
// 極端な値にならないように、最小値と最大値を設ける
// 通常の正規分布を行い、範囲を逸脱したときには、再度計算を行う
function xRandomNormalMinmax(xmin, xmax, average, deviation) {
    var ok = 0;       // 範囲内なら１、範囲外なら０
    while (ok == 0) {
        var z01 = 0;                  // 標準正規分布（０，１）に従う乱数
        for (var i = 1; i <= 12; i++) {   // 中心極限定理により１２個の一様乱数は正規分布になる
            z01 = z01 + Math.random();
        }
        z01 = z01 - 6;
        var x = (average + z01) + (deviation * z01);
        if ((x >= xmin) && (x <= xmax)) ok = 1;
    }
    return x;
}

// クラスゾーン //

//AgentBrainのプロパティ
{
    //思考中フラグ
    var agent_thinking_f = false;
    //選択フラグ、true:C  false:D
    var agent_C_choiced = false;
    //agentが結果を出したか
    var agent_choiced_f = false;


    //思考時間、秒数
    var agent_wait = 5;
}

//エージェントの思考のclass
class AgentBrain {

    constructor(self_W = self_weight, other_W = other_weight, wait_time = agent_wait) {
        //重み
        this.self_W = self_W;
        this.other_W = other_W;
        //待ち時間
        this.wait_time = wait_time;

        //console.log(createjs.Ticker.RAF);

        //思考開始
        //this.think(wait_time);

    }

    //思考関数
    think(wait = this.wait_time) {
        resetMatrixValue();

        agent_thinking_f = true;
        agent_choiced_f = false;
        if (DEBUG) console.log(choice_matrix);

        function resultCaluculation(other_W, self_W, a, b, c, d, e, f, g, h) {
            return ((a * other_W + b * self_W) / 2
                + (c * other_W + d * self_W) / 2)
                - ((e * other_W + f * self_W) / 2
                    + (g * other_W + h * self_W) / 2);
        }

        /*
        var result = ((a * this.other_W + b * this.self_W) / 2
            + (c * this.other_W + d * this.self_W) / 2)
            - ((e * this.other_W + f * this.self_W) / 2
                + (g * this.other_W + h * this.self_W) / 2);
        if(DEBUG)console.log("Caluculation result : " + result);
        */

        var result = resultCaluculation(this.other_W, this.self_W, a, b, c, d, e, f, g, h);
        if (DEBUG) console.log("Caluculation result : " + result);

        var stat_text = "def";
        var choice_text = "def";
        if (result > 0) {
            stat_text = "stat";
            choice_text = C_NAME;
            agent_C_choiced = true;

        } else if (result < 0) {
            stat_text = "stat";
            choice_text = D_NAME;
            agent_C_choiced = false;

        } else {
            stat_text = "rand";
            var cho_rand = xRandomNormal(0, 1);
            console.log("Random rate : " + cho_rand);
            //0の時はランダム
            if (cho_rand >= 0) {
                agent_C_choiced = true;
                choice_text = C_NAME;
            } else {
                agent_C_choiced = false;
                choice_text = D_NAME;
            }
        }

        if (DEBUG) console.log(stat_text + " : " + choice_text);

        //本番ラウンドなら再計算する
        if (round >= Round_toReal_Number) {
            if (DEBUG) console.log("RE calculation ... : ");

            //一番最初の本番ラウンドなら、裏切る
            //CPは自分の利益のみ考える
            if (round == Round_toReal_Number) {
                result = resultCaluculation(0, 1, a, b, c, d, e, f, g, h);

                if (result > 0) {
                    stat_text = "stat";
                    choice_text = C_NAME;
                    agent_C_choiced = true;

                } else if (result < 0) {
                    stat_text = "stat";
                    choice_text = D_NAME;
                    agent_C_choiced = false;

                } else {
                    stat_text = "rand";
                    var cho_rand = xRandomNormal(0, 1);
                    console.log("Random rate : " + cho_rand);
                    //0の時はランダム
                    if (cho_rand >= 0) {
                        agent_C_choiced = true;
                        choice_text = C_NAME;
                    } else {
                        agent_C_choiced = false;
                        choice_text = D_NAME;
                    }
                }

                stat_text = "first";

                //それ以降の本番の場合
            } else {
                stat_text = "over secondly";
                agent_C_choiced = C_button_flag;

                //前の回に、プレイヤーがCを選んだ場合
                if (agent_C_choiced) {
                    choice_text = C_NAME;

                    //前の回に、プレイヤーがDを選んだ場合
                } else {
                    choice_text = D_NAME;

                }
            }

            if (DEBUG) console.log(stat_text + " : " + choice_text);

        }

        //エージェントはCを選ぶ
        if (agent_C_choiced) {
            CP_CHOICE = C_NAME;
            CP_LIST.push([C_save_NAME]);

            //エージェントはDを選ぶ
        } else {
            CP_CHOICE = D_NAME;
            CP_LIST.push([D_save_NAME]);

        }

        //乱数時間
        var random = xRandomNormal(wait, 0.5);
        var waiting_time = random;
        createjs.Ticker.addEventListener("tick", thinking);
        function thinking() {
            waiting_time -= 1 / 60;
            if (waiting_time < 0) {
                createjs.Ticker.removeEventListener("tick", thinking);
                if (DEBUG) console.log("thinking over: " + random);
                agent_thinking_f = false;

            }
        }
    }

}

var AI_brain;// = new AgentBrain();

//Agentの見た目class
class AgentLooks extends createjs.Container {

    constructor(bace_ID = "member1", think_ID = "thinking", C_ID = "C_choice", D_ID = "D_choice") {
        super();

        var agent_look_default = document.getElementById(bace_ID);
        //agent_look_default.src = "./images/hiyori_happy3_0.gif";

        var agent_look_think = document.getElementById(think_ID);
        agent_look_think.style.visibility = "hidden";
        var agent_look_C_choice = document.getElementById(C_ID);
        agent_look_C_choice.style.visibility = "hidden";
        var agent_look_D_choice = document.getElementById(D_ID);
        agent_look_D_choice.style.visibility = "hidden";

        //見えなくするならtrue
        function faceHiddenChange(name, flag = true) {
            if (flag) {
                name.style.visibility = "hidden";
            } else {
                name.style.visibility = "visible";
            }
        }

        function allHiddens(def = true, think = true, C_cho = true, D_cho = true) {
            faceHiddenChange(agent_look_default, def);
            faceHiddenChange(agent_look_think, think);
            faceHiddenChange(agent_look_C_choice, C_cho);
            faceHiddenChange(agent_look_D_choice, D_cho);

        }

        //表情画像を変化、デフォルトでは画像は1つの要素を固定して変化させる
        function faceImageChange(name_source, name = agent_look_default) {
            name.src = name_source;

        }


        game_stage.addChild(this);

        createjs.Ticker.addEventListener("tick", watchDog_agentLooks);

        function watchDog_agentLooks() {

            //標準的なHTMLの場合
            if (!qualtlics_MODE) {
                //表情を変える場合
                if (QUAL_faceMotion_flag) {

                    //通常の表情
                    if (agent_thinking_f) {
                        if (!default_face_f) {
                            resetFaceFlags();
                            default_face_f = true;
                            faceImageChange(QUAL_face_default);

                            //allHiddens();
                            //faceHiddenChange(agent_look_default, false);
                        }

                    }
                    /*else{
                        faceImageChange(QUAL_face_default);
                    }*/

                    //選択後の表情
                    if (agent_choiced_f) {
                        resetFaceFlags();
                        //評価値を計算
                        var row_value = self_weight * CP_GET + other_weight * PLAYER_GET;

                        var index_row = CP_Row_list.indexOf(row_value);
                        var CP_Row_list_harf = (CP_Row_list.length - 1) / 2;


                        //評価値に応じた表情に変更

                        //低評価
                        if (index_row < CP_Row_list_harf) {
                            if (!face_list_flag[0]) {
                                face_list_flag[0] = true;
                                faceImageChange(QUAL_face_list[0]);
                                //allHiddens();
                                //faceHiddenChange(agent_look_C_choice, false);
                            }
                            //高評価
                        } else if (index_row >= CP_Row_list_harf) {
                            if (!face_list_flag[1]) {
                                face_list_flag[1] = true;
                                faceImageChange(QUAL_face_list[1]);
                                //allHiddens();
                                //faceHiddenChange(agent_look_D_choice, false);
                            }
                            //可不可なし
                        } else {
                            if (!default_face_f) {
                                default_face_f = true;
                                faceImageChange(QUAL_face_default);
                                //allHiddens();
                                //faceHiddenChange(agent_look_default, false);
                            }
                        }

                    }



                    //表情を変えない場合、そのまま
                } else {
                    if (DEBUG) console.log("Motion off :");
                    createjs.Ticker.removeEventListener("tick", watchDog_agentLooks);

                }

                /*
                allHiddens();
                //agentが考え中か
                if (agent_thinking_f) {
                    faceHiddenChange(agent_look_default, false)
    
                } else {
                    faceHiddenChange(agent_look_default, false)
                }
    
                //agentが結果を出したか
                if (agent_choiced_f) {
    
                    if (agent_C_choiced) {
    
                        faceHiddenChange(agent_look_C_choice, false);
                    } else {
    
                        faceHiddenChange(agent_look_D_choice, false);
                    }
                }*/

                //クオルトリクスの場合
            } else {
                //表情を変える場合
                if (QUAL_faceMotion_flag) {

                    //通常の表情
                    if (agent_thinking_f) {
                        if (!default_face_f) {
                            resetFaceFlags();
                            default_face_f = true;
                            faceImageChange(QUAL_face_default);
                        }

                    }
                    /*else{
                        faceImageChange(QUAL_face_default);
                    }*/

                    //選択後の表情
                    if (agent_choiced_f) {
                        resetFaceFlags();
                        //評価値を計算
                        var row_value = self_weight * CP_GET + other_weight * PLAYER_GET;

                        var index_row = CP_Row_list.indexOf(row_value);
                        var CP_Row_list_harf = (CP_Row_list.length - 1) / 2;


                        //評価値に応じた表情に変更

                        //低評価
                        if (index_row < CP_Row_list_harf) {
                            if (!face_list_flag[0]) {
                                face_list_flag[0] = true;
                                faceImageChange(QUAL_face_list[0]);
                            }
                            //高評価
                        } else if (index_row >= CP_Row_list_harf) {
                            if (!face_list_flag[1]) {
                                face_list_flag[1] = true;
                                faceImageChange(QUAL_face_list[1]);
                            }
                            //可不可なし
                        } else {
                            if (!default_face_f) {
                                default_face_f = true;
                                faceImageChange(QUAL_face_default);
                            }
                        }

                    }



                    //表情を変えない場合、そのまま
                } else {
                    if (DEBUG) console.log("Motion off :");
                    createjs.Ticker.removeEventListener("tick", watchDog_agentLooks);

                }


            }


        }

    }
}

//プレイヤーの状態のプロパティ
{
    //選んだフラグ
    var player_choiced_f = false;

    //ボタンのフラグ、cpuと同じ
    var C_button_flag = false;
    //var D_button_flag = false;

    //ボタンを選択している状態のフラグ
    var C_button_ON_flag = false;
    var D_button_ON_flag = false;
}


//GameControlのプロパティ
{
    var button_C_fillColor = "rgba(255,100,100,1.0)";
    var button_D_fillColor = "rgba(100,100,255,1.0)";

    button_C_fillColor = black_color;
    button_D_fillColor = button_C_fillColor;

    var button_C_text_color = white_color;
    var button_D_text_color = button_C_text_color;

    var button_void_fillColor = gray_color;

    //マトリックスの位置
    var matrix_x = 500;
    var matrix_y = 200;

    //ディメロ版、位置
    var DMR_c_x;
    var DMR_d_x;
    var DMR_c_y;
    var DMR_d_y;

    //プレイヤーが考えていて、ヒントを表示するまでの時間
    var hint_delay_time = 5 * 60;

    //入れ替える速度
    //ヒントの入れ替え速度 ms
    var hint_change_rate = 1000;

}

//ゲームコントロールclass
//場所をコントロールする
class GameControl {

    constructor(that = "") {

        //エージェントの見た目class
        var agent_looks = new AgentLooks();
        agent_looks.x = 10;
        agent_looks.y = canvasHeight / 2 - 150;


        var height_y = canvasHeight * 0.52;;

        //ラウンドテキスト
        var round_Text = new RoundText();
        round_Text.x = canvasWidth * 0.4;
        round_Text.y = 100;

        //次のラウンドへ
        function nextRound() {
            //モーションを起動
            //マトリックスのモーション
            /*
            createjs.Tween.get(mate)
                .to({ x: canvasWidth * 1.5 }, 100)
                .to({ x: card_x, y: -100 }, 10)
                .to({ x: card_x, y: card_y , scaleX: 1.0 , scaleY: 1.0 }, 500);*/

            //ボタンを見えるようにする
            //C_button.visible = true;
            //D_button.visible = true;

            //マトリックスのCPUボタンを復活
            //mate.cpuButton_gray(true, true);

            round += 1;

            //11回目になるなら実行
            if (round == Round_toReal_Number) {
                text_window.setText(ToRealGame_TS_pack);

                createjs.Ticker.addEventListener("tick", watchDog_toRealRound);

                var toReal_time = 10 * 60;
                //時間経過までの監視
                function watchDog_toRealRound(){
                    toReal_time -= 1;
                    if(toReal_time < 0){
                        createjs.Ticker.removeEventListener("tick", watchDog_toRealRound);
                        changeGamePara();
                    }

                }

            } else {

                //最終回なら実行
                if (round >= list_length) {
                    round = 0;

                    openResult();

                    //クオルトリクスモードなら実行
                    if (qualtlics_MODE || DEBUG || demonstration_MODE) {
                        text_window.setText(End_TS_pack);

                        C_button.visible = false;
                        D_button.visible = false;


                        if (qualtlics_MODE) endAndNextQualtrics(that);

                        //HTMLなら不実行
                    } else {
                        changeGamePara();
                    }



                    //最終回でないなら実行
                } else {
                    changeGamePara();
                }

            }


            //更新用の関数
            function changeGamePara() {
                var timing_update = DMR_cld_timing / 1000 * 60;

                //一時的に姿を消す
                mate_DMR.moveFuncMatrixBox(false);

                mate_DMR.BoxVisibleNon();

                createjs.Ticker.addEventListener("tick",watchDog_update);
                function watchDog_update(){
                    timing_update -= 1;
                    if(timing_update<0){
                        createjs.Ticker.removeEventListener("tick",watchDog_update);
                        //ボタンを見えるようにする
                        C_button.visible = true;
                        D_button.visible = true;

                        //説明テキストに変更
                        text_window.setText(Init_TS_pack);

                        //数値を更新
                        resetMatrixValue();

                        //AIに思考させる
                        AI_brain.think();

                        //mate.setValue();
                        mate_DMR.moveFuncMatrixBox();

                        mate_DMR.setScore();
                        mate_DMR.setAlpha();
                        round_Text.setRound();

                        //プレイヤーの選択権を回復させる
                        player_choiced_f = false;
                    }

                }

                /*
                //ボタンを見えるようにする
                C_button.visible = true;
                D_button.visible = true;

                //説明テキストに変更
                text_window.setText(Init_TS_pack);

                //数値を更新
                resetMatrixValue();

                //AIに思考させる
                AI_brain.think();

                //mate.setValue();
                mate_DMR.moveFuncMatrixBox();

                mate_DMR.setScore();
                mate_DMR.setAlpha();
                mate_DMR.BoxVisibleNon();
                round_Text.setRound();

                //プレイヤーの選択権を回復させる
                player_choiced_f = false;*/
            }

            /*
            //ボタンを見えるようにする
            C_button.visible = true;
            D_button.visible = true;

            //説明テキストに変更
            text_window.setText(Init_TS_pack);

            //数値を更新
            resetMatrixValue();

            //AIに思考させる
            AI_brain.think();


            if (C_button_flag) {
                //mate.C_kirakira();
            }
            if (!C_button_flag) {
                //mate.D_kirakira();
            }

            //mate.setValue();
            mate_DMR.setScore();
            mate_DMR.setAlpha();
            mate_DMR.BoxVisibleNon();
            round_Text.setRound();

            //プレイヤーの選択権を回復させる
            player_choiced_f = false;
            */

        }

        //エージェントを監視する関数
        function checkingAgentThinking() {

            //エージェントが考えているか
            createjs.Ticker.addEventListener("tick", watchDog_agentThink);
            function watchDog_agentThink() {
                //エージェントが考えるのを終えたら
                if (!agent_thinking_f) {
                    createjs.Ticker.removeEventListener("tick", watchDog_agentThink);

                    //数秒の間を開ける
                    var connectTime = 1 * 60;
                    createjs.Ticker.addEventListener("tick", waitingConnect);

                    //モーションを起動
                    //マトリックスのモーション
                    /*
                    createjs.Tween.get(mate)
                        .to({ x: card_x, y: card_y, scaleX: 1.0, scaleY: 1.0 }, 2000);*/


                    function waitingConnect() {
                        connectTime -= 1;

                        if (connectTime < 0) {
                            createjs.Ticker.removeEventListener("tick", waitingConnect);


                            //agent_choiced_f = true;

                            //マトリックスの表示をエージェントに合わせる
                            //mate.cpu_kirakira(agent_C_choiced);
                            //mate.cpuButton_gray(agent_C_choiced);
                            mate_DMR.moveCPBox(agent_C_choiced);

                            //選択していないものは薄くする
                            var cc_alpha = DMR_alpha_non;
                            var cd_alpha = DMR_alpha_non;
                            var dc_alpha = DMR_alpha_non;
                            var dd_alpha = DMR_alpha_non;

                            //手に合わせて、表示と得点を設定
                            if (agent_C_choiced) {
                                if (C_button_flag) {
                                    //CCの場合
                                    cc_alpha = DMR_alpha_choiced;

                                    PLAYER_GET = a;
                                    CP_GET = b;
                                } else {
                                    //CDの場合
                                    cd_alpha = DMR_alpha_choiced;

                                    PLAYER_GET = c;
                                    CP_GET = d;
                                }
                            } else {
                                if (C_button_flag) {
                                    //DCの場合
                                    dc_alpha = DMR_alpha_choiced;

                                    PLAYER_GET = e;
                                    CP_GET = f;
                                } else {
                                    //DDの場合
                                    dd_alpha = DMR_alpha_choiced;

                                    PLAYER_GET = g;
                                    CP_GET = h;
                                }
                            }

                            if (round >= Round_toReal_Number) {
                                PLAYER_SCORE += PLAYER_GET;
                                if (DEBUG) console.log("Player score : " + PLAYER_SCORE);
                            }
                            player_score += PLAYER_GET;
                            cpu_score += CP_GET;
                            if (DEBUG) {
                                console.log("player_false score : " + player_score);
                                console.log("cpu_false score : " + cpu_score);
                            }

                            mate_DMR.setAlpha(cc_alpha, cd_alpha, dc_alpha, dd_alpha);



                            //説明テキストの表示、制御
                            //Ret.switchText();
                            //Ret.visible = true;
                            //Ret.movingThis(true);

                            //説明テキストの変更
                            //まず数値セット
                            InitAllTS();

                            //テキスト反映
                            if(round < list_length-1){
                                text_window.setText([Result_TS, Result_TS_value]);

                            //もし最終ラウンドなら実行
                            }else{
                                text_window.setText([Result_charset.concat([""]).concat(Result_charset).concat(["次へ進んでください。"]), Result_TS_value]);
                            }

                            createjs.Ticker.addEventListener("tick", resultOpen);
                            //結果を表示する関数
                            var result_time = 2 * 60;
                            function resultOpen() {
                                result_time -= 1;
                                if (result_time < 0) {

                                    createjs.Ticker.removeEventListener("tick", resultOpen);

                                    agent_choiced_f = true;
                                    //next_button.visible = true;
                                    createjs.Tween.get(next_button)
                                        .to({}, 500)
                                        .to({ visible: true }, 10);


                                    //計算結果表示
                                    var row_value = self_weight * CP_GET + other_weight * PLAYER_GET;
                                    if (DEBUG){
                                        console.log("row value for CP : " + row_value);

                                        var index_row = CP_Row_list.indexOf(row_value);
                                        var CP_Row_list_harf = (CP_Row_list.length - 1) / 2;
                
                
                                        //評価値に応じた表情に変更
                
                                        //低評価
                                        if (index_row < CP_Row_list_harf) {
                                            console.log("bad");
                                            //高評価
                                        } else if (index_row >= CP_Row_list_harf) {
                                            console.log("good");
                                            //可不可なし
                                        } else {
                                            console.log("neutral");
                                        }

                                    }
                                }

                            }
                        }
                    }

                }

            }

        }


        //選ばなかった場合のCボタンのclass
        var C_button_void = new ChoiceButton(C_NAME, button_C_text_color, button_void_fillColor, false);
        C_button_void.y = canvasHeight - button_hei * 0.7;

        //Cのボタンclass
        var C_button = new ChoiceButton(C_NAME, button_C_text_color, button_C_fillColor);
        C_button.x = button_wid * 0.75;
        C_button.y = canvasHeight - button_hei * 0.7;

        //Cボタンクリックとフラグを関連付ける
        C_button.addEventListener("click", function () {
            //プレイヤーが選んでいないなら
            if (!player_choiced_f) {
                //DMRマトリックスの箱を表示
                mate_DMR.movePlayerBox(true);

                player_choiced_f = true;

                C_button_flag = true;
                if (DEBUG) console.log(C_button_flag);

                PLAYER_CHOICE = C_NAME;
                PLAYER_LIST.push([C_save_NAME]);

                D_button.visible = false;

                mate_DMR.setAlpha(DMR_alpha_choiced, DMR_alpha_non, DMR_alpha_choiced, DMR_alpha_non);

                if (agent_thinking_f) text_window.setText(Wait_TS_pack);

                //player_score += a;
                //cpu_score += b;
                checkingAgentThinking();
            }

        });
        //Cボタンのマウスオーバー
        C_button.addEventListener("mouseover", function () {
            //プレイヤーが選んでないなら
            if (!player_choiced_f) {

                //mate.C_kirakira();

                //DMRマトリックスの箱を表示
                mate_DMR.movePlayerBox(true);

                //setReward();

                //マトリックスとカードの位置を入れ替える
                var this_count = 10 * 30;

                //選びなおされた、もしくは最初に選んだら実行
                if (!C_button_ON_flag) {

                    //モーションを起動
                    //マトリックスのモーション
                    //createjs.Tween.get(mate)
                    //    .to({ x: card_x, y: card_y , scaleX: 1.0 , scaleY: 1.0 }, 10);

                    C_button_ON_flag = true;
                    D_button_ON_flag = false;

                    //createjs.Ticker.addEventListener("tick", changePlace);
                }

                function changePlace() {
                    if (C_button_ON_flag) this_count -= 1;
                    if (this_count < 0) {
                        createjs.Ticker.removeEventListener("tick", changePlace);

                        //モーションを起動
                        //マトリックスのモーション
                        //createjs.Tween.get(mate)
                        //    .to({ x: matrix_x, y: matrix_y, scaleX: 1.0 / matrix_scale, scaleY: 1.0 / matrix_scale }, hint_change_rate, createjs.Ease.cubicIn);

                    }
                    if (player_choiced_f || !C_button_ON_flag) {
                        createjs.Ticker.removeEventListener("tick", changePlace);
                    }
                }

            }

        });

        //選ばなかった場合のCボタンのclass
        var D_button_void = new ChoiceButton(D_NAME, button_D_text_color, button_void_fillColor, false);
        D_button_void.y = C_button.y;

        //Dのボタンclass
        var D_button = new ChoiceButton(D_NAME, button_D_text_color, button_D_fillColor);
        D_button.x = C_button.x + button_wid * 1.5;
        D_button.y = C_button.y;

        //Dボタンクリックとフラグを関連付ける
        D_button.addEventListener("click", function () {
            //プレイヤーが選んでいないなら
            if (!player_choiced_f) {
                //DMRマトリックスの箱を表示
                mate_DMR.movePlayerBox(false);

                player_choiced_f = true;

                C_button_flag = false;
                if (DEBUG) console.log(C_button_flag);

                PLAYER_CHOICE = D_NAME;
                PLAYER_LIST.push([D_save_NAME]);

                C_button.visible = false;

                mate_DMR.setAlpha(DMR_alpha_non, DMR_alpha_choiced, DMR_alpha_non, DMR_alpha_choiced);

                if (agent_thinking_f) text_window.setText(Wait_TS_pack);

                //player_score += c;
                //cpu_score += d;
                checkingAgentThinking();
            }

        });
        //Dボタンのマウスオーバー
        D_button.addEventListener("mouseover", function () {
            if (!player_choiced_f) {

                //mate.D_kirakira();

                //DMRマトリックスの箱を表示
                mate_DMR.movePlayerBox(false);

                //マトリックスとカードの位置を入れ替える
                var this_count = 10 * 30;

                //選びなおされた、もしくは最初に選んだら実行
                if (!D_button_ON_flag) {

                    //マトリックスのモーション
                    //createjs.Tween.get(mate)
                    //    .to({ x: card_x, y: card_y , scaleX: 1.0 , scaleY: 1.0 }, 10);

                    D_button_ON_flag = true;
                    C_button_ON_flag = false;

                    //createjs.Ticker.addEventListener("tick", changePlace);
                }

                function changePlace() {
                    if (D_button_ON_flag) this_count -= 1;
                    if (this_count < 0) {
                        createjs.Ticker.removeEventListener("tick", changePlace);

                        //モーションを起動
                        //マトリックスのモーション
                        //createjs.Tween.get(mate)
                        //    .to({ x: matrix_x, y: matrix_y, scaleX: 1.0 / matrix_scale, scaleY: 1.0 / matrix_scale }, hint_change_rate, createjs.Ease.cubicIn);

                    }
                    if (player_choiced_f || !D_button_ON_flag) {
                        createjs.Ticker.removeEventListener("tick", changePlace);
                    }
                }
            }

        });

        //次のラウンドへ行くボタン
        var next_button = new ChoiceButton(NEXT_NAME, "black", "white");
        next_button.x = D_button.x + button_wid * 1.5;
        next_button.y = D_button.y;
        next_button.visible = false;
        next_button.on("click", function () {
            //自分を見えなくする
            next_button.visible = false;
            //説明テキストを非表示に
            //Ret.visible = false;
            //Ret.movingThis(false);

            //説明テキストに変更
            //text_window.setText(Init_TS_pack);


            //次のラウンドへ

            //mate.stop_kirakira();

            nextRound();
        });

        //ステージのマウスオーバーをオンにする
        game_stage.enableMouseOver();

        //マトリックス
        //var mate = new MatrixBox();
        //mate.x = matrix_x;
        //mate.y = matrix_y;
        //mate.setValue();

        //ディメロ版
        var mate_DMR = new MatrixDMR();
        mate_DMR.x = canvasWidth * 0.65;
        mate_DMR.y = canvasHeight * 0.4;

        DMR_c_x = canvasWidth * 0.5;
        DMR_c_y = canvasHeight * 0.3;
        DMR_d_x = DMR_c_x + DMR_cld_wid + DMR_cld_spa;
        DMR_d_y = DMR_c_y + DMR_cld_hei + DMR_cld_spa;

        C_button.x = mate_DMR.x - (DMR_cld_wid + DMR_cld_spa) / 2;
        C_button_void.x = C_button.x;
        D_button.x = mate_DMR.x + (DMR_cld_wid + DMR_cld_spa) / 2;
        D_button_void.x = D_button.x;
        next_button.x = D_button.x + button_wid * 1.1;


        //テキストウィンドウ
        var text_window = new TextWindow();
        text_window.x = mate_DMR.x;
        text_window.y = canvasHeight * 0.7;
        text_window.setText(Init_TS_pack);


        
        if(!demonstration_MODE){
            Demo_TS_value = [CP_angle / Math.PI * 180, String(QUAL_faceMotion_flag), String(QUAL_PD_change_flag)];
            Demo_TS_pack =
            [[Ce_Value ,": SVO",  Ce_ln, Ce_Str , ": emotion expression", Ce_ln, Ce_Str, ": position change"]
                , Demo_TS_value];
        }

        //デモモード時、どのパラメータか表示
        if(demonstration_MODE && DEBUG){
            var demo_textWindow = new TextWindow(tW_wid/2,tW_hei*0.8,tW_text_font,"rgba(250,200,200,1.0)","rgba(250,100,100,1.0)",1,true);
            demo_textWindow.setText(Demo_TS_pack);
            demo_textWindow.x = tW_wid/4;
            demo_textWindow.y = canvasHeight-tW_hei/2;
            //demo_textWindow.setText(Demo_TS_pack);
        }

    }

}


//表示するテキスト
{
    //記号
    //数値のコード、数値を値文に追加
    var Ce_Value = "value_set";
    //文字のコード、文字を値文に追加
    var Ce_Str = "string_set";
    //改行のコード
    var Ce_ln = "ln_set";
    var ln_words = "";

    //基本的なテキストセット
    //ドットレングスで長さを取得し、テキスト列を作成
    //作成したテキスト列もレングスで獲得できる
    //リストは、構造文、値文の順
    //TS=TextSource
    var Test_TS_value = ["tes", 55];
    var Test_TS_pack = [["あなたは、", Ce_Str, "を選びました。", Ce_Value, "点を獲得しました。"], Test_TS_value];

    //console.log(YouGot_TS);

    //全角、半角を出す関数、全角は2、半角は1
    function GetBiteWord(word = "1") {
        var chr = word;
        if ((chr >= 0x00 && chr < 0x81) ||
            (chr === 0xf8f0) ||
            (chr >= 0xff61 && chr < 0xffa0) ||
            (chr >= 0xf8f1 && chr < 0xf8f4)) {
            //半角文字は1
            return 1;
        } else {
            //それ以外の文字は2
            return 2;
        }
    };

    //テキストを作って、リスト化。すべてString
    function MakeTerm(text_list = Test_TS_pack) {
        //入れるようのテキスト
        var text = [""];
        //改行数
        var text_ln = 0;
        //テキストの長さ、0になる、limitで繰り返す
        var text_length = 0;
        //今の値文の参照インデックス値
        var index = 0;

        //一字ずつ抜き出して、入れていく関数
        function PushWordOrLn(words = "123あいう") {
            for (var i = 0; i < words.length; i++) {
                //現段階の文字数を+する
                text_length += GetBiteWord(words[i]);
                if (text_length >= tW_text_limit - 3) {
                    text_length = 0;
                    text_ln += 1;
                    text.push([""]);
                }
                text[text_ln] += words[i];

            }

        };

        //構造文を引き出して、追加していく
        for (var i = 0; i < text_list[0].length; i++) {
            //コードチェック
            var check_Ce = text_list[0][i];

            //数字なら
            if (check_Ce == Ce_Value) {
                //text[text_ln] += String(text_list[1][index]);
                PushWordOrLn(String(text_list[1][index]));
                index += 1;

                //文字なら
            } else if (check_Ce == Ce_Str) {
                //text[text_ln] += text_list[1][index];
                PushWordOrLn(text_list[1][index]);
                index += 1;

                //改行なら
            } else if (check_Ce == Ce_ln) {
                text[text_ln] += ln_words;
                text_ln += 1;
                text.push([""]);
                text_length = 0;

                //それ以外なら、リストをそのまま代入
            } else {
                //text[text_ln] += text_list[0][i];
                PushWordOrLn(text_list[0][i]);
            }
        }

        if (text.length < 3) {
            text.push([" "]);
            text.push([" "]);
        }

        return text;
    };

    var test_text = MakeTerm([Test_TS_pack, Test_TS_value]);
    test_text = MakeTerm();
    //console.log(test_text);


    //統合する場合は、TS_pack とすること
    //統合の場合、これで関数実行できるので、定義したら変えないこと

    //初期のワード
    var Init_TS_value = [C_NAME, D_NAME, CP_NAME];
    var Init_TS_pack =
        [[Ce_Str, " か ", Ce_Str, " を選んでください。", Ce_Str, "も選びます。"]
            , Init_TS_value];

    //選ばれた時に表示するワード(待機中)
    var Wait_TS_value = [CP_NAME];
    var Wait_TS_pack = [[Ce_Str, "が選ぶのをお待ちください..."], Wait_TS_value];

    //結果表示のワード、これは統合しない
    var Result_charset = [Ce_Str, "は", Ce_Str, "を選び、", Ce_Value, "点を獲得しました。"];
    var Result_TS_value = [];
    var Result_TS = Result_charset.concat([""]).concat(Result_charset).concat(["次のゲームに進んでください。"]);
    //console.log(Result_TS);

    //終わりのワード、最後に表示されたままになる
    var End_TS_pack = [["ゲームはこれで終わりです。そのままお待ちください..."], [null]];


    //10回目から11回目に進む前のワード、秒数で表示を消す
    var ToRealGame_TS_value = [Round_toReal_Number,Round_toReal_Number+1];
    var ToRealGame_TS_pack = [[Ce_Value,"回目のゲームが終了しました。ひよりの性格がわかりましたか？次の",Ce_Value,"回目からが本番のゲームです。しばらくお待ちください..."], ToRealGame_TS_value];

    //デモゲームのワード
    var Demo_TS_value = [demo_svo_angle, String(demo_emotion), String(demo_position_change)];
    var Demo_TS_pack =
        [[Ce_Value ,": SVO",  Ce_ln, Ce_Str , ": emotion expression", Ce_ln, Ce_Str, ": position change"]
            , Demo_TS_value];

    //ワードの初期化、または再セット
    function InitAllTS() {
        Result_TS_value = [PLAYER_NAME, PLAYER_CHOICE, PLAYER_GET, CP_NAME, CP_CHOICE, CP_GET];

    }

    InitAllTS();

}

//おもちゃテキスト
{
    //List、順番に実行していく
    var Oa_TS_list = [
        [
            ["ループを確認してください。", "では次の行です。"],
            [null]
        ],
        [
            ["事項は次の通りです。"],
            [null]
        ],
        [
            ["ボタンを押しても反応しないのでご注意ください。"],
            [null]
        ],
        [
            ["このテキストは、試しに表示されているため、文字数制限に引っかかっているかもしれません。また、ひよりちゃんも変化しません。"],
            [null]
        ],
        [
            ["テスト行", Ce_ln, "テスト2行目"],
            [null]
        ],
        [
            ["何回ループしてもいいんですけど、試しにこのパックにはいいものを入れているので、テストしてみてくださいね。"],
            [null]
        ],
        [
            ["実装は完了です。テストをします。どうぞ。"],
            [null]
        ],
        [
            [Ce_Str, Ce_Value, "+", Ce_Value, "=", Ce_Value, "。どうですか。ちゃんと計算結果が表示されていますか？"],
            ["「テストケース：かっこまでがコードです」", 1, 2, 1 + 2]
        ],
        [
            ["ちゃんと表示されたのならOKです。お疲れさまでした。"],
            [null]
        ]

    ];
}


//TextWindowのプロパティ
{
    var tW_wid = 450;
    var tW_hei = 100;

    var tW_roundSize = tW_hei * 0.1;

    var tW_strokeSize = 5;

    var tW_backFillColor = "rgba(150,150,150,0.4)";
    var tW_frameStrokeColor = "rgba(50,50,50,0.8)";

    //テキストそのもののプロパティ
    var tW_text_defaultText = "これは初期テキストです:This is default words.";

    //テキストサイズ
    var tW_text_fontSize = tW_hei * 0.17;
    var tW_text_fontName = " sans-serif";
    var tW_text_font = String(tW_text_fontSize) + "px " + tW_text_fontName;

    var tW_text_textColor = "black";
    var tW_text_textAlign = "left";
    var tW_text_textBaseline = "middle";

    //限界テキスト数
    var tW_text_limit = Math.floor(tW_wid / tW_text_fontSize) * 2;
    tW_text_defaultText += tW_text_limit + " limit";


    //テキスト表示を切り替えるためのフラグ
    //今は使用中
    var tW_nowPrinting_f = false;

    //テキスト表示スピード
    var tW_speedRate = 2;

    //テキストは一括で表示するか
    var tW_wordsPacking_f = false;

}

//テキストウィンドウのclass
class TextWindow extends createjs.Container {

    constructor(wid=tW_wid,hei=tW_hei,font=tW_text_font,fillColor=tW_backFillColor,frameColor=tW_frameStrokeColor,speedRate=tW_speedRate,wordsPacking_f=tW_wordsPacking_f) {
        super();

        game_stage.addChild(this);

        //今は使用中
        var nowPrinting_f = false;
        this.nowPrinting_f = nowPrinting_f;

        this.speedRate = speedRate;
        this.wordsPacking_f = wordsPacking_f;

        //テキストの背景
        var textWindow_back = new createjs.Shape();
        this.addChild(textWindow_back);
        textWindow_back.graphics
            .setStrokeStyle(0)
            .beginFill(fillColor)
            .drawRoundRect(-wid / 2, -hei / 2, wid, hei, tW_roundSize);

        //テキストの枠
        var textWindow_frame = new createjs.Shape();
        this.addChild(textWindow_frame);
        textWindow_frame.graphics
            .setStrokeStyle(tW_strokeSize)
            .beginStroke(frameColor)
            .drawRoundRect(-wid / 2, -hei / 2, wid, hei, tW_roundSize);


        //テキスト1行目
        var text_term_1 = new createjs.Text();
        this.addChild(text_term_1);
        text_term_1.text = tW_text_defaultText;
        text_term_1.font = font;
        text_term_1.color = tW_text_textColor;
        text_term_1.textAlign = tW_text_textAlign;
        text_term_1.textBaseline = tW_text_textBaseline;
        text_term_1.x = -(wid) / 2 + 10;
        text_term_1.y = -(hei) / 4;
        this.text_term_1 = text_term_1;
        //テキスト2行目
        var text_term_2 = new createjs.Text();
        this.addChild(text_term_2);
        text_term_2.text = tW_text_defaultText;
        text_term_2.font = font;
        text_term_2.color = tW_text_textColor;
        text_term_2.textAlign = tW_text_textAlign;
        text_term_2.textBaseline = tW_text_textBaseline;
        text_term_2.x = text_term_1.x;
        text_term_2.y = 0;
        this.text_term_2 = text_term_2;
        //テキスト3行目
        var text_term_3 = new createjs.Text();
        this.addChild(text_term_3);
        text_term_3.text = tW_text_defaultText;
        text_term_3.font = font;
        text_term_3.color = tW_text_textColor;
        text_term_3.textAlign = tW_text_textAlign;
        text_term_3.textBaseline = tW_text_textBaseline;
        text_term_3.x = text_term_1.x;
        text_term_3.y = -text_term_1.y;
        this.text_term_3 = text_term_3;


    }

    //テキストを表示
    setText(term_list = Test_TS_pack) {
        //console.log(term_list);

        var term = MakeTerm(term_list);

        //console.log(term);

        //var nowPrinting_f = this.nowPrinting_f;
        var speedRate = this.speedRate;
        var wordsPacking_f = this.wordsPacking_f;


        if (wordsPacking_f) {
            this.text_term_1.text = term[0];
            this.text_term_2.text = term[1];
            this.text_term_3.text = term[2];
        } else {
            //他のが終わったか待つ
            createjs.Ticker.addEventListener("tick", WatchDog_endPrinting);
        }

        function WatchDog_endPrinting() {
            if (!tW_nowPrinting_f) {
                createjs.Ticker.removeEventListener("tick", WatchDog_endPrinting);
                tW_nowPrinting_f = true;

                term1.text = "";
                term2.text = "";
                term3.text = "";

                //描画開始
                createjs.Ticker.addEventListener("tick", AddTerm);
            }
        };

        var index = 0;
        var now_index = 0;

        var term1 = this.text_term_1;
        var term1_words = "";
        var term1_size = term[0].length;

        var term2 = this.text_term_2;
        var term2_words = "";
        var term2_size = term[1].length;

        var term3 = this.text_term_3;
        var term3_words = "";
        var term3_size = term[2].length;

        var stack_speed = 0;

        function AddTerm() {
            stack_speed += 1;
            if (stack_speed > speedRate) {
                stack_speed = 0;

                if (index == 0) {
                    if (term1_words.length >= term1_size) {
                        index += 1;
                        now_index = 0;
                    } else {
                        term1.text += term[0][now_index];
                        term1_words += term[0][now_index];
                        now_index += 1;
                    }

                } else if (index == 1) {
                    if (term2_words.length >= term2_size) {
                        index += 1;
                        now_index = 0;
                    } else {
                        term2.text += term[1][now_index];
                        term2_words += term[1][now_index];
                        now_index += 1;
                    }

                } else if (index == 2) {
                    if (term3_words.length >= term3_size) {
                        index = 0;
                        now_index = 0;

                        createjs.Ticker.removeEventListener("tick", AddTerm);
                        tW_nowPrinting_f = false;

                    } else {
                        term3.text += term[2][now_index];
                        term3_words += term[2][now_index];
                        now_index += 1;
                    }

                }

                //if(DEBUG)console.log("n");
            }

        }

    }
}


//ラウンド表示のプロパティ
{
    var rt_main_size = 50;
    var rt_sub_size = rt_main_size * 0.4;

    var rt_text_color = "red";
    rt_text_color = black_color;

    var rt_text_checkList = ["st", "nd", "rd", "th"];
}

//ラウンド表示
class RoundText extends createjs.Container {

    constructor() {
        super();

        game_stage.addChild(this);

        //テキスト
        var text = new createjs.Text();
        text.text = String(round + 1);
        text.font = String(rt_main_size) + "px fantasy";
        text.color = rt_text_color;
        text.textAlign = "center";
        text.textBaseline = "bottom";
        this.addChild(text);
        this.text = text;

        //第、みたいな
        var text_sub = new createjs.Text();
        text_sub.text = rt_text_checkList[0];
        text_sub.font = String(rt_sub_size) + "px fantasy";
        text_sub.color = rt_text_color;
        text_sub.textAlign = "center";
        text_sub.textBaseline = "bottom";
        this.addChild(text_sub);
        text_sub.x = rt_sub_size * 2;
        this.text_sub = text_sub;

    }

    setRound() {
        this.text.text = String(round + 1);
        this.text_sub.text = this.textCheck(round + 1);
    }

    textCheck(value) {
        var tex = "??";
        if (value <= rt_text_checkList.length) {
            tex = rt_text_checkList[value - 1];
        } else {
            tex = rt_text_checkList[rt_text_checkList.length - 1];
        }
        return tex;

    }
}


//MatrixDMRのプロパティ
{
    //箱同士の間隔
    var DMR_mate_spa = 30;

    //マトリックスの大きさ
    var DMR_mate_wid = 200 + DMR_mate_spa;
    var DMR_mate_hei = 100 + DMR_mate_spa;

    //選択状態のアルファ値
    var DMR_alpha_choiced = 1.2;
    var DMR_alpha_non = 0.7;


    //選んだ箱に関すること
    var DMR_choice_strokeColor = "rgba(100,100,100,0.5)";
    var DMR_choice_fillColor = "rgba(100,100,100,0.0)";
    var DMR_choice_strokeSize = 5;

    //結果の箱の表示に関すること
    var DMR_result_choice_strokeColor = "rgba(10,10,10,1.0)";
    var DMR_result_choice_fillColor = "rgba(100,100,100,0.0)";
    var DMR_result_choice_strokeSize = 5;

    var DMR_choice_player_wid = DMR_mate_wid * 0.5 + DMR_choice_strokeSize;
    var DMR_choice_player_hei = DMR_mate_hei * 1.7;

    var DMR_choice_CP_wid = DMR_mate_wid * 1.6;
    var DMR_choice_CP_hei = DMR_mate_hei * 0.5 + DMR_choice_strokeSize;

}

//ディメロ版マトリックスのclass
class MatrixDMR extends createjs.Container {

    constructor() {
        super();

        game_stage.addChild(this);

        //cc箱
        var DMR_cc = new DMRChildBox(true, true);
        this.DMR_cc = DMR_cc;
        this.addChild(DMR_cc);
        DMR_cc.x = -(DMR_cld_wid + DMR_cld_spa) / 2;
        DMR_cc.y = -(DMR_cld_hei + DMR_cld_spa) / 2;

        //cd箱
        var DMR_cd = new DMRChildBox(true, false);
        this.DMR_cd = DMR_cd;
        this.addChild(DMR_cd);
        DMR_cd.x = -DMR_cc.x;
        DMR_cd.y = DMR_cc.y;

        //dc箱
        var DMR_dc = new DMRChildBox(false, true);
        this.DMR_dc = DMR_dc;
        this.addChild(DMR_dc);
        DMR_dc.x = DMR_cc.x;
        DMR_dc.y = -DMR_cc.y;

        //dd箱
        var DMR_dd = new DMRChildBox(false, false);
        this.DMR_dd = DMR_dd;
        this.addChild(DMR_dd);
        DMR_dd.x = -DMR_cc.x;
        DMR_dd.y = -DMR_cc.y;

        //自分の名前
        var text_player = new createjs.Text();
        this.addChild(text_player);
        text_player.text = PLAYER_NAME;
        text_player.font = DMR_cld_text_choice_font;
        text_player.color = DMR_cld_text_choice_fillColor;
        text_player.textAlign = DMR_cld_choice_textAlign;
        text_player.textBaseline = DMR_cld_choice_textBaseline;
        text_player.y = -(DMR_cld_hei + DMR_cld_pop_spa) * 2;

        //相手の名前
        var text_CP = new createjs.Text();
        this.addChild(text_CP);
        text_CP.text = CP_NAME;
        text_CP.font = DMR_cld_text_choice_font;
        text_CP.color = DMR_cld_text_choice_fillColor;
        text_CP.textAlign = DMR_cld_choice_textAlign;
        text_CP.textBaseline = DMR_cld_choice_textBaseline;
        text_CP.x = -(DMR_cld_wid + DMR_cld_pop_spa) * 2;

        //自分の選んだ箱
        var player_choiced_box = new createjs.Shape();
        this.addChild(player_choiced_box);
        player_choiced_box.graphics
            .setStrokeStyle(DMR_choice_strokeSize)
            .beginStroke(DMR_choice_strokeColor)
            .beginFill(DMR_choice_fillColor)
            .drawRect(-DMR_choice_player_wid / 2, -DMR_choice_player_hei / 2, DMR_choice_player_wid, DMR_choice_player_hei);
        this.player_choiced_box = player_choiced_box;
        player_choiced_box.y = DMR_cc.y + DMR_choice_player_hei * 0.05;
        //player_choiced_box.visible = false;

        //相手の選んだ箱
        var CP_choiced_box = new createjs.Shape();
        this.addChild(CP_choiced_box);
        CP_choiced_box.graphics
            .setStrokeStyle(DMR_choice_strokeSize)
            .beginStroke(DMR_choice_strokeColor)
            .beginFill(DMR_choice_fillColor)
            .drawRect(-DMR_choice_CP_wid / 2, -DMR_choice_CP_hei / 2, DMR_choice_CP_wid, DMR_choice_CP_hei);
        this.CP_choiced_box = CP_choiced_box;
        CP_choiced_box.x = DMR_cc.x + DMR_choice_CP_wid * 0.05;
        //CP_choiced_box.visible = false;

        //結果としてなった箱
        var result_choiced_box = new createjs.Shape();
        this.addChild(result_choiced_box);
        result_choiced_box.graphics
            .setStrokeStyle(DMR_result_choice_strokeSize)
            .beginStroke(DMR_result_choice_strokeColor)
            .beginFill(DMR_result_choice_fillColor)
            .drawRect(-DMR_choice_player_wid / 2, -DMR_choice_CP_hei / 2, DMR_choice_player_wid, DMR_choice_CP_hei);
        this.result_choiced_box = result_choiced_box;
        result_choiced_box.x = DMR_cc.x;
        result_choiced_box.y = DMR_cc.y;
        //CP_choiced_box.visible = false;

        this.setScore();
        this.setAlpha();

        this.movePlayerBox();
        this.moveCPBox();
        this.BoxVisibleNon();

        //this.moveFuncMatrixBox();

    }

    //マトリックスを消す、または出す
    moveFuncMatrixBox(toVisibling_f=true){
        this.DMR_cc.moveFuncThis(toVisibling_f);
        this.DMR_cd.moveFuncThis(toVisibling_f);
        this.DMR_dc.moveFuncThis(toVisibling_f);
        this.DMR_dd.moveFuncThis(toVisibling_f);

    }

    //箱の表示を非表示に
    BoxVisibleNon() {
        this.player_choiced_box.visible = false;
        this.CP_choiced_box.visible = false;
        this.result_choiced_box.visible = false;
    }

    //自分が選ぶ方に箱を移動
    movePlayerBox(left_f = true) {
        this.player_choiced_box.visible = true;
        if (left_f) {
            this.player_choiced_box.x = this.DMR_cc.x;
        } else {
            this.player_choiced_box.x = -this.DMR_cc.x;
        }

        this.result_choiced_box.x = this.player_choiced_box.x;

    }

    //相手が選ぶ方に箱を移動
    moveCPBox(over_f = true) {
        this.CP_choiced_box.visible = true;
        if (over_f) {
            this.CP_choiced_box.y = this.DMR_cc.y;
        } else {
            this.CP_choiced_box.y = -this.DMR_cc.y;
        }

        this.result_choiced_box.visible = true;
        this.result_choiced_box.y = this.CP_choiced_box.y;

    }

    //報酬の箱の協調
    setAlpha(cc_a = 1.0, cd_a = 1.0, dc_a = 1.0, dd_a = 1.0) {
        this.DMR_cc.alpha = cc_a;
        this.DMR_cd.alpha = cd_a;
        this.DMR_dc.alpha = dc_a;
        this.DMR_dd.alpha = dd_a;
    }

    //スコアのセット
    setScore() {
        /*
        this.DMR_cc.setScore(a,b);
        this.DMR_cd.setScore(c,d);
        this.DMR_dc.setScore(e,f);
        this.DMR_dd.setScore(g,h);*/

        //サーチした方が能動的
        this.DMR_cc.setScore();
        this.DMR_cd.setScore();
        this.DMR_dc.setScore();
        this.DMR_dd.setScore();
    }

}

//DMRChildBoxのプロパティ
{
    //箱のサイズ、きっちりサイズなので、あとで隙間を作ること
    var DMR_cld_wid = DMR_mate_wid / 2;
    var DMR_cld_hei = DMR_mate_hei / 2;

    //隙間
    var DMR_cld_spa = DMR_mate_spa / 2;

    //報酬の箱
    var DMR_cld_mainBox_fillColor = "gray";

    //テキスト、箱の中
    var DMR_cld_text_fontSize = DMR_cld_hei * 0.22;
    var DMR_cld_text_textFont = " sans-serif";
    var DMR_cld_text_font = String(DMR_cld_text_fontSize) + "px " + DMR_cld_text_textFont;

    //テキスト、報酬用のフォント
    var DMR_cld_text_fontSize_reward = DMR_cld_hei * 0.40;
    var DMR_cld_text_textFont_reward = " cursive";
    var DMR_cld_text_font_reward = String(DMR_cld_text_fontSize_reward) + "px " + DMR_cld_text_textFont_reward;


    var DMR_cld_text_fillColor = "white";
    var DMR_cld_textAlign = "center";
    var DMR_cld_textBaseline = "middle";

    //テキスト、選択肢の名前
    var DMR_cld_text_choice_fontSize = DMR_cld_hei * 0.4;
    var DMR_cld_text_choice_textFont = " sans-serif";
    var DMR_cld_text_choice_font = String(DMR_cld_text_choice_fontSize) + "px " + DMR_cld_text_choice_textFont;

    var DMR_cld_text_choice_fillColor = "black";
    var DMR_cld_choice_textAlign = "center";
    var DMR_cld_choice_textBaseline = "middle";

    //プレイヤーテキスト
    var DMR_cld_playerText = PLAYER_NAME + " : ";
    var DMR_cld_Text_x = -DMR_cld_text_fontSize * 1;
    var DMR_cld_Text_playerText_y = -DMR_cld_text_fontSize * 1;
    //相手テキスト
    var DMR_cld_CPText = CP_NAME + " : ";
    var DMR_cld_Text_CPText_y = -DMR_cld_Text_playerText_y;

    //報酬のテキストの位置
    var DMR_cld_RewardText_x = DMR_cld_wid / 2 - DMR_cld_text_fontSize * 1.1;
    var DMR_cld_RewardText_y = DMR_cld_Text_playerText_y;

    //解説吹き出し
    var DMR_cld_pop_spa = 20;
    var DMR_cld_pop_wid = DMR_cld_wid * 0.8;
    var DMR_cld_pop_hei = DMR_cld_hei * 0.8;
    var DMR_cld_pop_star_r_size = 10;
    var DMR_cld_pop_strokeColor = "rgba(255,255,255,0.0)";
    var DMR_cld_pop_fillColor = "rgba(100,100,100,0.7)";

    var DMR_cld_pop_text_fontSize = DMR_cld_pop_hei * 0.2;
    var DMR_cld_pop_text_textFont = " sans-serif";
    var DMR_cld_pop_text_font = String(DMR_cld_pop_text_fontSize) + "px " + DMR_cld_pop_text_textFont;

    var DMR_cld_pop_text_main_fontSize = DMR_cld_pop_hei * 0.5;
    var DMR_cld_pop_text_main_textFont = " sans-serif";
    var DMR_cld_pop_text_main_font = String(DMR_cld_pop_text_main_fontSize) + "px " + DMR_cld_pop_text_main_textFont;

    var DMR_cld_pop_textAlign = "center";
    var DMR_cld_pop_textBaseline = "middle";

    var DMR_cld_pop_text_player = "You will get";
    var DMR_cld_pop_text_CP = "CP will get";

    /*
    DMR_cld_pop_text_player = "あなたが得られるのは";
    DMR_cld_pop_text_fontSize = DMR_cld_pop_hei * 0.12;
    DMR_cld_pop_text_font = String(DMR_cld_pop_text_fontSize)+ "px " + DMR_cld_pop_text_textFont;
    */

    var DMR_cld_pop_text_fillColor = "white";

    var DMR_cld_pop_Text_y = -DMR_cld_pop_text_fontSize * 1.5;


    //もし、の箱
    var DMR_cld_if_strokeColor = "white";
    var DMR_cld_if_fillColor = "rgba(20,20,25,0.8)";

    var DMR_cld_if_text_fillColor = "white";

    var DMR_cld_if_text = "I f";
    var DMR_cld_if_text_fontSize = DMR_cld_pop_hei * 0.3;
    var DMR_cld_if_text_textFont = " sans-serif";
    var DMR_cld_if_text_font = String(DMR_cld_if_text_fontSize) + "px " + DMR_cld_if_text_textFont;

    var DMR_cld_if_text_choise_fontSize = DMR_cld_pop_hei * 0.15;
    var DMR_cld_if_text_choise_textFont = " sans-serif";
    var DMR_cld_if_text_choise_font = String(DMR_cld_if_text_choise_fontSize) + "px " + DMR_cld_if_text_choise_textFont;


    //消える、現れるの移動量と透明度
    var DMR_cld_move_d = 10;
    var DMR_cld_alpha = 0.0;

    //消える、現れるタイミング
    var DMR_cld_timing = 500;

}

//ディメロ版、子供の箱
//上側なのか、左側なのか、のフラグを与える。デフォは左上
class DMRChildBox extends createjs.Container {

    constructor(over_f = true, left_f = true) {
        super();

        this.over_f = over_f;
        this.left_f = left_f;

        //実際の箱のコンテナ
        var box_container = new createjs.Container();
        this.addChild(box_container);
        this.box_container = box_container;

        //プレイヤーと相手の箱を入れる箱、隙間を開ける、灰色
        var main_box = new createjs.Shape();
        box_container.addChild(main_box);
        main_box.graphics
            .setStrokeStyle(0)
            .beginFill(DMR_cld_mainBox_fillColor)
            .drawRoundRect(-DMR_cld_wid / 2, -DMR_cld_hei / 2, DMR_cld_wid, DMR_cld_hei, 10);

        //マウスオーバー
        /*
        main_box.addEventListener("mouseover",function(){
            popUp_player_container.visible = true;
            popUp_CP_container.visible = true;
            if_container.visible = true;
        });
        //マウスアウト
        main_box.addEventListener("mouseout",function(){
            popUp_player_container.visible = false;
            popUp_CP_container.visible = false;
            if_container.visible = false;
        });*/

        //プレイヤーの箱、文字だけ
        var text_player = new createjs.Text();
        box_container.addChild(text_player);
        text_player.text = DMR_cld_playerText;
        text_player.font = DMR_cld_text_font;
        text_player.color = DMR_cld_text_fillColor;
        text_player.textAlign = DMR_cld_textAlign;
        text_player.textBaseline = DMR_cld_textBaseline;
        text_player.x = DMR_cld_Text_x;
        text_player.y = DMR_cld_Text_playerText_y;

        //プレイヤーの報酬、テキスト
        var text_playerReward = new createjs.Text();
        box_container.addChild(text_playerReward);
        text_playerReward.text = "999";
        text_playerReward.font = DMR_cld_text_font_reward;
        text_playerReward.color = DMR_cld_text_fillColor;
        text_playerReward.textAlign = DMR_cld_textAlign;
        text_playerReward.textBaseline = DMR_cld_textBaseline;
        text_playerReward.x = DMR_cld_RewardText_x;
        text_playerReward.y = DMR_cld_RewardText_y;
        this.text_playerReward = text_playerReward;

        //相手の箱、文字だけ
        var text_CP = new createjs.Text();
        box_container.addChild(text_CP);
        text_CP.text = DMR_cld_CPText;
        text_CP.font = DMR_cld_text_font;
        text_CP.color = DMR_cld_text_fillColor;
        text_CP.textAlign = DMR_cld_textAlign;
        text_CP.textBaseline = DMR_cld_textBaseline;
        text_CP.x = DMR_cld_Text_x;
        text_CP.y = DMR_cld_Text_CPText_y;

        //相手の報酬、テキスト
        var text_CPReward = new createjs.Text();
        box_container.addChild(text_CPReward);
        text_CPReward.text = "0";
        text_CPReward.font = DMR_cld_text_font_reward;
        text_CPReward.color = DMR_cld_text_fillColor;
        text_CPReward.textAlign = DMR_cld_textAlign;
        text_CPReward.textBaseline = DMR_cld_textBaseline;
        text_CPReward.x = DMR_cld_RewardText_x;
        text_CPReward.y = -DMR_cld_RewardText_y;
        this.text_CPReward = text_CPReward;


        //箱の位置に応じて、選択肢の名前を表示

        //上の箱の場合
        var text_name_over = new createjs.Text();
        this.addChild(text_name_over);
        if (over_f && left_f) {
            text_name_over.text = C_NAME;
        } else if (over_f && !left_f) {
            text_name_over.text = D_NAME;
        } else {
            text_name_over.text = "";
        }
        text_name_over.font = DMR_cld_text_choice_font;
        text_name_over.color = DMR_cld_text_choice_fillColor;
        text_name_over.textAlign = DMR_cld_choice_textAlign;
        text_name_over.textBaseline = DMR_cld_choice_textBaseline;
        text_name_over.y = -(DMR_cld_hei + DMR_cld_pop_spa);

        //左の箱の場合
        var text_name_left = new createjs.Text();
        this.addChild(text_name_left);
        if (left_f && over_f) {
            text_name_left.text = C_NAME;
        } else if (left_f && !over_f) {
            text_name_left.text = D_NAME;
        } else {
            text_name_left.text = "";
        }
        text_name_left.font = DMR_cld_text_choice_font;
        text_name_left.color = DMR_cld_text_choice_fillColor;
        text_name_left.textAlign = DMR_cld_choice_textAlign;
        text_name_left.textBaseline = DMR_cld_choice_textBaseline;
        text_name_left.x = -(DMR_cld_wid + DMR_cld_pop_spa);


        //プレイヤーの得られる解説
        var popUp_player_container = new createjs.Container();
        popUp_player_container.visible = false;
        this.popUp_player_container = popUp_player_container;
        this.addChild(popUp_player_container);
        popUp_player_container.y = (DMR_cld_hei + DMR_cld_pop_spa);
        //吹き出し
        var popUp_player = new createjs.Shape();
        popUp_player_container.addChild(popUp_player);
        popUp_player.graphics
            .setStrokeStyle(1)
            .beginStroke(DMR_cld_pop_strokeColor)
            .beginFill(DMR_cld_pop_fillColor)
            .drawRoundRect(-DMR_cld_pop_wid / 2, -DMR_cld_pop_hei / 2, DMR_cld_pop_wid, DMR_cld_pop_hei, 10);
        //矢印
        var popUp_player_allow = new createjs.Shape();
        popUp_player_container.addChild(popUp_player_allow);
        popUp_player_allow.graphics
            .setStrokeStyle(1)
            .beginStroke(DMR_cld_pop_strokeColor)
            .beginFill(DMR_cld_pop_fillColor)
            .drawPolyStar(0, 0, DMR_cld_pop_star_r_size, 3, 0, -90);
        popUp_player_allow.y = - (DMR_cld_pop_hei / 2 + DMR_cld_pop_star_r_size);
        if (over_f) {
            popUp_player_allow.rotation += 180;
            popUp_player_allow.y = -popUp_player_allow.y;

            popUp_player_container.y = -popUp_player_container.y;
        }

        //プレイヤーの得られる解説テキスト
        var text_popUp_player = new createjs.Text();
        popUp_player_container.addChild(text_popUp_player);
        text_popUp_player.text = DMR_cld_pop_text_player;
        text_popUp_player.font = DMR_cld_pop_text_font;
        text_popUp_player.color = DMR_cld_pop_text_fillColor;
        text_popUp_player.textAlign = DMR_cld_pop_textAlign;
        text_popUp_player.textBaseline = DMR_cld_pop_textBaseline;
        text_popUp_player.y = DMR_cld_pop_Text_y

        //プレイヤーの得られる解説の報酬のテキスト、変動する
        var text_popUp_playerReward = new createjs.Text();
        popUp_player_container.addChild(text_popUp_playerReward);
        text_popUp_playerReward.text = "999";
        text_popUp_playerReward.font = DMR_cld_pop_text_main_font;
        text_popUp_playerReward.color = DMR_cld_pop_text_fillColor;
        text_popUp_playerReward.textAlign = DMR_cld_pop_textAlign;
        text_popUp_playerReward.textBaseline = DMR_cld_pop_textBaseline;
        text_popUp_playerReward.y = -DMR_cld_pop_Text_y - 10;
        this.text_popUp_playerReward = text_popUp_playerReward;

        //モーション設定
        createjs.Tween.get(popUp_player_container, { loop: true })
            .to({ scaleX: 1.1, scaleY: 1.1 }, 2000)
            .wait(2000)
            .to({ scaleX: 1.0, scaleY: 1.0 }, 1000);

        //相手の得られる解説
        var popUp_CP_container = new createjs.Container();
        popUp_CP_container.visible = false;
        this.popUp_CP_container = popUp_CP_container;
        this.addChild(popUp_CP_container);
        popUp_CP_container.x = (DMR_cld_wid + DMR_cld_pop_spa);
        //吹き出し
        var popUp_CP = new createjs.Shape();
        popUp_CP_container.addChild(popUp_CP);
        popUp_CP.graphics
            .setStrokeStyle(1)
            .beginStroke(DMR_cld_pop_strokeColor)
            .beginFill(DMR_cld_pop_fillColor)
            .drawRoundRect(-DMR_cld_pop_wid / 2, -DMR_cld_pop_hei / 2, DMR_cld_pop_wid, DMR_cld_pop_hei, 10);
        //矢印
        var popUp_CP_allow = new createjs.Shape();
        popUp_CP_container.addChild(popUp_CP_allow);
        popUp_CP_allow.graphics
            .setStrokeStyle(1)
            .beginStroke(DMR_cld_pop_strokeColor)
            .beginFill(DMR_cld_pop_fillColor)
            .drawPolyStar(0, 0, DMR_cld_pop_star_r_size, 3, 0, 180);
        popUp_CP_allow.x = - (DMR_cld_pop_wid / 2 + DMR_cld_pop_star_r_size);
        if (left_f) {
            popUp_CP_allow.rotation += 180;
            popUp_CP_allow.x = -popUp_CP_allow.x;

            popUp_CP_container.x = -popUp_CP_container.x;
        }

        //相手の得られる解説テキスト
        var text_popUp_CP = new createjs.Text();
        popUp_CP_container.addChild(text_popUp_CP);
        text_popUp_CP.text = DMR_cld_pop_text_CP;
        text_popUp_CP.font = DMR_cld_pop_text_font;
        text_popUp_CP.color = DMR_cld_pop_text_fillColor;
        text_popUp_CP.textAlign = DMR_cld_pop_textAlign;
        text_popUp_CP.textBaseline = DMR_cld_pop_textBaseline;
        text_popUp_CP.y = DMR_cld_pop_Text_y

        //相手の得られる解説の報酬のテキスト、変動する
        var text_popUp_CPReward = new createjs.Text();
        popUp_CP_container.addChild(text_popUp_CPReward);
        text_popUp_CPReward.text = "0";
        text_popUp_CPReward.font = DMR_cld_pop_text_main_font;
        text_popUp_CPReward.color = DMR_cld_pop_text_fillColor;
        text_popUp_CPReward.textAlign = DMR_cld_pop_textAlign;
        text_popUp_CPReward.textBaseline = DMR_cld_pop_textBaseline;
        text_popUp_CPReward.y = -DMR_cld_pop_Text_y - 10;
        this.text_popUp_CPReward = text_popUp_CPReward;

        //モーション設定
        /*
        createjs.Tween.get(popUp_CP_container, {loop: true})
            .to({ scaleX: 1.1, scaleY: 1.1 }, 2000)
            .wait(2000)
            .to({ scaleX: 1.0, scaleY: 1.0 }, 1000);*/


        //「もし、CCならば」の箱
        var if_container = new createjs.Container();
        if_container.visible = false;
        this.if_container = if_container;
        this.addChild(if_container);
        if_container.y = (DMR_cld_hei + DMR_cld_pop_spa);
        if (over_f) if_container.y = -if_container.y;
        if_container.x = (DMR_cld_wid + DMR_cld_pop_spa);
        if (left_f) if_container.x = -if_container.x;

        var if_box = new createjs.Shape();
        if_container.addChild(if_box);
        if_box.graphics
            .setStrokeStyle(2)
            .beginStroke(DMR_cld_if_strokeColor)
            .beginFill(DMR_cld_if_fillColor)
            .drawRoundRect(-DMR_cld_pop_wid / 2, -DMR_cld_pop_hei / 2, DMR_cld_pop_wid, DMR_cld_pop_hei, 0)

        //もしのテキスト
        var text_if = new createjs.Text();
        if_container.addChild(text_if);
        text_if.text = DMR_cld_if_text;
        text_if.font = DMR_cld_if_text_font;
        text_if.color = DMR_cld_text_fillColor;
        text_if.textAlign = DMR_cld_textAlign;
        text_if.textBaseline = DMR_cld_textBaseline;
        text_if.x = -DMR_cld_pop_wid / 4;
        text_if.y = -DMR_cld_pop_hei / 4;

        //選択肢の組み合わせ
        var text_if_choices = new createjs.Text();
        if_container.addChild(text_if_choices);
        text_if_choices.text = "def";
        text_if_choices.font = DMR_cld_if_text_choise_font;
        text_if_choices.color = DMR_cld_text_fillColor;
        text_if_choices.textAlign = DMR_cld_textAlign;
        text_if_choices.textBaseline = DMR_cld_textBaseline;
        text_if_choices.y = DMR_cld_pop_hei / 4;

        var ifTEXT = "";

        if (over_f) {
            ifTEXT += C_NAME;
        } else {
            ifTEXT += D_NAME;
        }
        ifTEXT += " , ";
        if (left_f) {
            ifTEXT += C_NAME;
        } else {
            ifTEXT += D_NAME;
        }

        text_if_choices.text = ifTEXT;

        //上記全てを包み込む箱

        //スコアセット
        this.setScore();

        //this.moveFuncThis();

    }

    //自分が消える、または現れる動き
    moveFuncThis(toVisibling_f=true){
        //初期のy座標
        var y_bace = this.box_container.y;
        //移動の上下および透明度
        var th_move_d = DMR_cld_move_d;
        var th_alpha = DMR_cld_alpha;

        if(toVisibling_f){
            th_move_d = th_move_d * (-1);
            th_alpha = 1.0;
        }
        //モーション設定
        createjs.Tween.get(this.box_container)
            .to({ y: y_bace+th_move_d, alpha: th_alpha }, DMR_cld_timing);


    }

    setScore(search_f = true, you = 0, pc = 0) {
        //スコア設定
        var player_score = 0;
        var PC_score = 0;
        if (search_f) {
            if (this.over_f) {
                if (this.left_f) {
                    player_score = a;
                    PC_score = b;
                } else {
                    player_score = c;
                    PC_score = d;
                }
            } else {
                if (this.left_f) {
                    player_score = e;
                    PC_score = f;
                } else {
                    player_score = g;
                    PC_score = h;
                }
            }
        } else {
            player_score = you;
            PC_score = pc;
        }
        this.text_playerReward.text = player_score;
        this.text_popUp_playerReward.text = player_score;
        this.text_CPReward.text = PC_score;
        this.text_popUp_CPReward.text = PC_score;
    }

}


//マトリックスのプロパティ
{
    //マトリックスの倍率、大きさ倍
    var matrix_scale = 3;
    var matrix_wid = 100 * matrix_scale;
    var matrix_hei = 60 * matrix_scale;

    var box_wid = matrix_wid / 2;
    var box_hei = matrix_hei / 4;

    //表示テキストのサイズ
    var matrix_fontSize = 10 * matrix_scale;

    //CPUのボタンのこと
    var cpu_btn_wid = 120;
    var cpu_btn_hei = matrix_hei / 2;

    //それぞれの名前
    var player_name_text = "You";
    var cpu_name_text = "CP ";
}

//マトリックスのclass
class MatrixBox extends createjs.Container {

    constructor(youColor = player_color, cpuColor = cpu_color) {
        super();

        game_stage.addChild(this);

        //マトリックス
        var matrix = new createjs.Shape();
        matrix.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .beginFill("gray")
            .drawRect(0, -matrix_hei / 2, matrix_wid, matrix_hei);
        //this.addChild(matrix);


        //キラキラ
        function kirakira(box) {
            var rate = 1 / 60 * 0.5;
            //(max-min)+min
            box.alpha = Math.random() * (1.2 - 0.8) + 0.8;
            //console.log(button.alpha);
            createjs.Ticker.addEventListener("tick", function () {
                box.alpha += rate;
                if (box.alpha >= 1.5 || box.alpha <= 0.5) {
                    rate *= -1;
                    box.alpha += rate;
                }
            });
        }

        //プレイヤーの箱、選んでいるならキラキラ
        var you_C_box = new createjs.Shape();
        you_C_box.graphics
            .setStrokeStyle(0)
            .beginFill(button_C_fillColor)
            .drawRect(-matrix_wid / 2, -matrix_hei / 2, matrix_wid / 2, matrix_hei);
        this.addChild(you_C_box);
        you_C_box.visible = false;
        kirakira(you_C_box);
        this.you_C_box = you_C_box;

        var you_D_box = new createjs.Shape();
        you_D_box.graphics
            .setStrokeStyle(0)
            .beginFill(button_D_fillColor)
            .drawRect(0, -matrix_hei / 2, matrix_wid / 2, matrix_hei);
        this.addChild(you_D_box);
        you_D_box.visible = false;
        kirakira(you_D_box);
        this.you_D_box = you_D_box;


        //相手の箱、
        var cpu_C_box = new createjs.Shape();
        cpu_C_box.graphics
            .setStrokeStyle(0)
            .beginFill(button_C_fillColor)
            .drawRect(-matrix_wid / 2, -matrix_hei / 2, matrix_wid, matrix_hei / 2);
        this.addChild(cpu_C_box);
        cpu_C_box.visible = false;
        //kirakira(cpu_C_box);
        this.cpu_C_box = cpu_C_box;

        var cpu_D_box = new createjs.Shape();
        cpu_D_box.graphics
            .setStrokeStyle(0)
            .beginFill(button_D_fillColor)
            .drawRect(-matrix_wid / 2, 0, matrix_wid, matrix_hei / 2);
        this.addChild(cpu_D_box);
        cpu_D_box.visible = false;
        //kirakira(cpu_D_box);
        this.cpu_D_box = cpu_D_box;


        //選んでない方を白くする箱を返す
        function makeWhiteBox(x, y, wid, hei) {
            var white_box = new createjs.Shape();
            white_box.graphics
                .setStrokeStyle(0)
                .beginFill("rgba(255,255,255,1.0)")
                .drawRect(x, y, wid, hei);
            white_box.visible = false;

            return white_box;

        }

        var you_C_white_box = makeWhiteBox(0, -matrix_hei / 2, matrix_wid / 2, matrix_hei);
        this.addChild(you_C_white_box);
        this.you_C_white_box = you_C_white_box;

        var you_D_white_box = makeWhiteBox(-matrix_wid / 2, -matrix_hei / 2, matrix_wid / 2, matrix_hei);
        this.addChild(you_D_white_box);
        this.you_D_white_box = you_D_white_box;

        var cpu_C_white_box = makeWhiteBox(-matrix_wid / 2, 0, matrix_wid, matrix_hei / 2);
        this.addChild(cpu_C_white_box);
        this.cpu_C_white_box = cpu_C_white_box;

        var cpu_D_white_box = makeWhiteBox(-matrix_wid / 2, -matrix_hei / 2, matrix_wid, matrix_hei / 2);
        this.addChild(cpu_D_white_box);
        this.cpu_D_white_box = cpu_D_white_box;


        var x_e = 0;
        var y_e = 0;

        for (var i = 0; i < 2; i++) {
            for (var j = 0; j < 2; j++) {
                var bod = new createjs.Shape();
                bod.graphics
                    .setStrokeStyle(1 * matrix_scale)
                    .beginStroke("gray")
                    .drawRect(x_e - matrix_wid / 2, y_e - matrix_hei / 2, matrix_wid / 2, matrix_hei / 2);
                this.addChild(bod);

                x_e += matrix_wid / 2;

            }
            x_e = 0;
            y_e = matrix_hei / 2;
        }

        x_e = 0;
        y_e = 0;

        function makeBox(x_e, y_e, color, who) {
            var box = new BoxRewards(color, who);
            box.x = x_e - matrix_wid / 2;
            box.y = y_e - matrix_hei / 2;
            return box;

        }

        //上側
        var box_0 = makeBox(x_e, y_e, youColor, player_name_text);
        y_e += box_hei;
        this.addChild(box_0);
        this.box_0 = box_0;

        var box_1 = makeBox(x_e, y_e, cpuColor, cpu_name_text);
        x_e += box_wid;
        y_e = 0;
        this.addChild(box_1);
        this.box_1 = box_1;

        var box_2 = makeBox(x_e, y_e, youColor, player_name_text);
        y_e += box_hei;
        this.addChild(box_2);
        this.box_2 = box_2;

        var box_3 = makeBox(x_e, y_e, cpuColor, cpu_name_text);
        x_e += box_wid;
        y_e = 0;
        this.addChild(box_3);
        this.box_3 = box_3;


        //相手が選んだボタンの表示
        function cpuButton(plusText = "def", textColor = "white", fillColor = button_fill_color) {
            //格納する箱
            var obj = new createjs.Container();
            //背景の座布団
            var bg = new createjs.Shape();
            bg.graphics
                .setStrokeStyle(1)
                .beginStroke("black")
                .beginFill(fillColor)
                .drawRoundRect(-cpu_btn_wid / 2, -cpu_btn_hei / 2 * 0.8, cpu_btn_wid, cpu_btn_hei * 0.8, 10);
            obj.addChild(bg);
            //テキスト
            var text = new createjs.Text();
            text.text = plusText;
            var fontSize = box_hei * 0.5;
            text.font = String(fontSize) + "px sans-serif";
            text.color = textColor;
            text.textAlign = "center";
            text.textBaseline = "bottom";
            text.y = fontSize / 2;
            obj.addChild(text);

            return obj;

        }

        //相手側のテキスト、と示す
        var text_couterpart = new createjs.Text();
        text_couterpart.text = "counterpart";
        text_couterpart.font = String(matrix_fontSize) + "px sans-serif";
        text_couterpart.color = "black";
        text_couterpart.textAlign = "center";
        text_couterpart.textBaseline = "bottom";
        text_couterpart.x = x_e + 10 + box_wid / 2 - matrix_wid / 2;
        text_couterpart.y = -20 - matrix_hei / 2;
        //this.addChild(text_couterpart);

        //相手の選んだボタンC、アクティブの時
        var cpu_button_C_active = cpuButton(C_NAME, "white", button_C_fillColor);
        this.addChild(cpu_button_C_active);
        cpu_button_C_active.x = x_e + 10 + cpu_btn_wid / 2 - matrix_wid / 2;
        cpu_button_C_active.y = cpu_btn_hei / 2 - matrix_hei / 2;
        //選ばれなかった場合
        var cpu_button_C_non = cpuButton(C_NAME, "gray", "white");
        this.addChild(cpu_button_C_non);
        cpu_button_C_non.x = cpu_button_C_active.x;
        cpu_button_C_non.y = cpu_button_C_active.y;
        cpu_button_C_non.visible = false;
        this.cpu_button_C_non = cpu_button_C_non;


        //下側
        x_e = 0;
        y_e += matrix_hei / 2;
        var box_4 = makeBox(x_e, y_e, youColor, player_name_text);
        y_e += box_hei;
        this.addChild(box_4);
        this.box_4 = box_4;

        var box_5 = makeBox(x_e, y_e, cpuColor, cpu_name_text);
        x_e += box_wid;
        y_e = matrix_hei / 2;
        this.addChild(box_5);
        this.box_5 = box_5;

        var box_6 = makeBox(x_e, y_e, youColor, player_name_text);
        y_e += box_hei;
        this.addChild(box_6);
        this.box_6 = box_6;

        var box_7 = makeBox(x_e, y_e, cpuColor, cpu_name_text);
        x_e += box_wid;
        y_e = matrix_hei / 2;
        this.addChild(box_7);
        this.box_7 = box_7;

        //相手の選んだボタンD、アクティブ
        var cpu_button_D_active = cpuButton(D_NAME, "white", button_D_fillColor);
        this.addChild(cpu_button_D_active);
        cpu_button_D_active.x = cpu_button_C_active.x;
        cpu_button_D_active.y = y_e + cpu_btn_hei / 2 - matrix_hei / 2;
        this.cpu_button_D_active = cpu_button_D_active;
        //選ばれなかった場合
        var cpu_button_D_non = cpuButton(D_NAME, "gray", "white");
        this.addChild(cpu_button_D_non);
        cpu_button_D_non.x = cpu_button_D_active.x;
        cpu_button_D_non.y = cpu_button_D_active.y;
        cpu_button_D_non.visible = false;
        this.cpu_button_D_non = cpu_button_D_non;


        //選んでない方を薄くする箱を返す
        function makeFeedoutBox(x, y, wid, hei) {
            var feedout_box = new createjs.Shape();
            feedout_box.graphics
                .setStrokeStyle(0)
                .beginFill("rgba(255,255,255,0.8)")
                .drawRect(x, y, wid, hei);
            feedout_box.visible = false;

            return feedout_box;

        }

        //選ばれていない選択を薄くする
        var you_C_feedout_box = makeFeedoutBox(0, -matrix_hei / 2, matrix_wid / 2, matrix_hei);
        this.addChild(you_C_feedout_box);
        this.you_C_feedout_box = you_C_feedout_box;

        var you_D_feedout_box = makeFeedoutBox(-matrix_wid / 2, -matrix_hei / 2, matrix_wid / 2, matrix_hei);
        this.addChild(you_D_feedout_box);
        this.you_D_feedout_box = you_D_feedout_box;

        var cpu_C_feedout_box = makeFeedoutBox(-matrix_wid / 2, 0, matrix_wid, matrix_hei / 2);
        this.addChild(cpu_C_feedout_box);
        this.cpu_C_feedout_box = cpu_C_feedout_box;

        var cpu_D_feedout_box = makeFeedoutBox(-matrix_wid / 2, -matrix_hei / 2, matrix_wid, matrix_hei / 2);
        this.addChild(cpu_D_feedout_box);
        this.cpu_D_feedout_box = cpu_D_feedout_box;

        //数値を設定
        this.setValue();

        //小さく
        this.scaleX = 1 / matrix_scale;
        this.scaleY = 1 / matrix_scale;

    }

    //数値を設定
    setValue() {
        this.box_0.setValue(a);
        this.box_1.setValue(b);
        this.box_2.setValue(c);
        this.box_3.setValue(d);
        this.box_4.setValue(e);
        this.box_5.setValue(f);
        this.box_6.setValue(g);
        this.box_7.setValue(h);
    }

    //Cボックスを目立たせる
    C_kirakira(C_f = true) {
        this.you_C_box.visible = C_f;
        this.you_C_white_box.visible = C_f;
        this.you_C_feedout_box.visible = C_f;
        this.you_D_box.visible = !C_f;
        this.you_D_white_box.visible = !C_f;
        this.you_D_feedout_box.visible = !C_f;
    }

    //Dボックスを目立たせる
    D_kirakira() {
        this.C_kirakira(false)
        /*
        this.you_D_box.visible = true;
        this.you_D_white_box.visible = true;
        this.you_C_box.visible = false;
        this.you_C_white_box.visible = false;
        */
    }

    //キラキラを止める
    stop_kirakira() {
        this.you_C_box.visible = false;
        this.you_C_white_box.visible = false;
        this.you_C_feedout_box.visible = false;
        this.you_D_box.visible = false;
        this.you_D_white_box.visible = false;
        this.you_D_feedout_box.visible = false;
        this.cpu_C_box.visible = false;
        this.cpu_C_white_box.visible = false;
        this.cpu_C_feedout_box.visible = false;
        this.cpu_D_box.visible = false;
        this.cpu_D_white_box.visible = false;
        this.cpu_D_feedout_box.visible = false;
    }

    //相手がCを選んだら、そちらを見せる
    cpu_kirakira(C_f = true) {
        this.cpu_C_box.visible = C_f;
        this.cpu_C_white_box.visible = C_f;
        this.cpu_C_feedout_box.visible = C_f;
        this.cpu_D_box.visible = !C_f;
        this.cpu_D_white_box.visible = !C_f;
        this.cpu_D_feedout_box.visible = !C_f;
    }

    //相手の選んでいないボタンをグレーアウト
    cpuButton_gray(C_f = false, default_f = !C_f) {
        this.cpu_button_C_non.visible = !C_f;
        this.cpu_button_D_non.visible = !default_f;

    }

}


//ボックスのプロパティ
{
    var box_space = box_hei * 0.3;
    var box_text_size = (box_hei - box_space) * 0.9;
}

//表示するボックスのclass
class BoxRewards extends createjs.Container {

    constructor(fillColor = "red", plusText = "who") {
        super();

        //箱
        var box = new createjs.Shape();
        box.graphics
            .setStrokeStyle(1 * matrix_scale)
            .beginStroke(white_color)
            .beginFill(fillColor)
            .drawRoundRect(box_space / 2, box_space / 2, box_wid - box_space, box_hei - box_space, 1 * matrix_scale);
        this.addChild(box);

        //表記
        var text_who = new createjs.Text("", "", "");
        text_who.text = plusText + ": ";
        text_who.font = String(box_text_size) + "px sans-serif";
        text_who.color = black_color;
        text_who.textAlign = "left";
        text_who.textBaseline = "bottom";
        text_who.x = 15;
        text_who.y = box_hei / 2 + box_text_size / 2;
        this.addChild(text_who);

        //数値
        var text_value = new createjs.Text("", "", "");
        text_value.text = "de";
        text_value.font = String(box_text_size) + "px sans-serif";
        text_value.color = black_color;
        text_value.textAlign = "center";
        text_value.textBaseline = "bottom";
        text_value.x = box_wid - box_text_size;
        text_value.y = box_hei / 2 + box_text_size / 2;
        this.addChild(text_value);
        this.text_value = text_value;

        this.setValue();
    }

    setValue(a = 0) {
        this.text_value.text = String(a);
    }
}


//得点画像のプロパティ
{
    var score_size = 50;
    var score_spa = 5;

    var deer_pro = ["./images/deer.png", 50, 3, "white"];
    var rabbit_pro = ["./images/rabbit.png", 35, 2, "white"];
    var rat_pro = ["./images/rat.png", 30, 1, "white"];
    var score_list = [deer_pro, rabbit_pro, rat_pro];
}

//ポップアップの得点画像のclass
class ScoreImage extends createjs.Container {

    constructor(wid, image_src, size, scoreText, fillColor, howmany = 1) {
        super();

        this.wid = wid;
        var score_s = new createjs.Container();
        this.addChild(score_s);
        //score_s.x = 0;

        var image = new Image();
        image.src = image_src;
        image.onload = () => {

            for (var i = 0; i < howmany; i++) {
                wid += score_spa;

                var score_boards = new createjs.Container();
                this.addChild(score_boards);
                score_boards.x = wid;

                var circle_size = size / 2;
                var circle = new createjs.Shape();
                circle.graphics
                    .setStrokeStyle(1)
                    .beginStroke("black")
                    .beginFill("rgba(255,255,255,0.8)")
                    .drawCircle(0, 0, circle_size);
                score_boards.addChild(circle);
                circle.x = size / 2;

                var animalImage = new createjs.Bitmap(image);

                animalImage.scaleX = size / animalImage.getBounds().width;
                animalImage.scaleY = animalImage.scaleX;

                animalImage.x = circle.x - size / 2;
                animalImage.y = -size / 2;

                score_boards.addChild(animalImage)

                var ten_size = 10;
                var ten = new createjs.Shape();
                ten.graphics
                    .setStrokeStyle(1)
                    .beginStroke("gray")
                    .beginFill(fillColor)
                    .drawCircle(0, 0, ten_size)
                score_boards.addChild(ten);
                ten.x = circle.x - size * 0.4;
                ten.y = size * 0.4;

                var label = new createjs.Text("", "20px sans-serif", "black");
                label.text = String(scoreText);
                label.x = ten.x;
                label.y = ten.y;
                label.textAlign = "center";
                label.textBaseline = "middle";
                score_boards.addChild(label);

                wid += size + score_spa;

            }

        }
    }

}

//得点から画像の表示数を割り出し、リストを返す関数
function toScoreList(score) {
    var list = [];
    var bo = 0;

    function checking(value) {
        bo = 0;

        bo = parseInt(score / value);
        score = parseInt(score % value);

        list.push(bo);
    }

    checking(3);
    checking(2);
    checking(1);

    //console.log(list);

    return list;
}

//得点ボードのclass
class ScoreBorad extends createjs.Container {

    constructor(list = [1, 2, 3], scoreList = score_list) {
        super();

        this.scoreList = scoreList;

        var score = new createjs.Container();
        this.addChild(score);
        this.score = score;

        var wid = 0;

        for (var i = 0; i < scoreList.length; i++) {
            var score_obj = new ScoreImage(wid, scoreList[i][0], scoreList[i][1], scoreList[i][2], scoreList[i][3], list[i]);
            score.addChild(score_obj);
            wid += (scoreList[i][1] + score_spa * 2) * list[i];
            score_obj.x = wid;

        }

        score.x = 0;

        var box = new createjs.Shape();
        if (DEBUG) this.addChild(box);
        this.box = box;
        box.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .drawRect(-wid / 2, -35, wid, 70);

        //this.setScore(toScoreList(5));

    }

    setScore(list = [1, 2, 3]) {
        var scoreList = this.scoreList;
        this.removeAllChildren();

        var score = new createjs.Container();
        this.addChild(score);
        this.score = score;

        var wid = 0;

        for (var i = 0; i < scoreList.length; i++) {
            var score_obj = new ScoreImage(wid, scoreList[i][0], scoreList[i][1], scoreList[i][2], scoreList[i][3], list[i]);
            score.addChild(score_obj);
            wid += (scoreList[i][1] + score_spa * 2) * list[i];

        }

        score.x = -wid / 2;

        var box = new createjs.Shape();
        //this.addChild(box);
        this.box = box;
        box.graphics
            .setStrokeStyle(1)
            .beginStroke("black")
            .drawRect(-wid / 2, -35, wid, 70);
    }
}


//ボタンのプロパティ
{
    //ボタンのサイズ
    var button_wid = 120;
    var button_hei = 70;
    var button_round = 30;
    //ボタンの色
    var button_stroke_size = 1;
    var button_stroke_color = "black";
    var button_fill_color = "rgba(255,0,255,0.5)";
    //ボタンのテキスト
    var button_text_fontsize = button_hei / 2;
    var button_text = "default";
    var button_text_font = String(button_text_fontsize) + "px sans-serif";
    var button_text_color = "black";
    var button_text_textAlign = "center";
    var button_text_textBaseline = "bottom";
    var button_text_x = 0;
    var button_text_y = button_text_fontsize / 2;

}

//ボタンのclass
class ChoiceButton extends createjs.Container {

    constructor(Text = button_text, button_textColor = button_text_color, button_fillColor = button_fill_color, listen_f = true) {
        super();

        //自分をステージに追加
        game_stage.addChild(this);

        //見た目を表示
        var button = new createjs.Shape();
        button.graphics
            .setStrokeStyle(button_stroke_size)
            .beginStroke(button_stroke_color)
            .beginFill(button_fillColor)
            .drawRoundRect(-button_wid / 2, -button_hei / 2, button_wid, button_hei, button_round);
        this.addChild(button);

        //「選択（CかD）」のテキストを表示
        var text = new createjs.Text("", "", "");
        text.text = Text;
        text.font = button_text_font;
        text.color = button_textColor;
        //中心にセット
        text.x = button_text_x;
        text.y = button_text_y;
        text.textAlign = button_text_textAlign;
        text.textBaseline = button_text_textBaseline;
        this.addChild(text);

        //リスナーを付ける
        if (listen_f) this.listenerThis();

        var rate = 1 / 60 * 0.5;
        //(max-min)+min
        button.alpha = Math.random() * (1.2 - 0.8) + 0.8;
        //console.log(button.alpha);

        if (listen_f) {
            createjs.Ticker.addEventListener("tick", function () {
                button.alpha += rate;
                if (button.alpha >= 1.2 || button.alpha <= 0.8) {
                    rate *= -1;
                }
            });
        }

    }

    listenerThis() {
        var listener = this;

        this.addEventListener("mousedown", handleMouseDown);
        this.addEventListener("click", handleClick);
        this.addEventListener("mouseover", handleMouseOver);
        this.addEventListener("mouseout", handleMouseOut);

        function handleMouseDown() {
            listener.scaleX = 1.1;
            listener.scaleY = 1.1;

        }

        function handleClick() {
            listener.scaleX = 1.2;
            listener.scaleY = 1.2;

        }

        function handleMouseOver() {
            listener.scaleX = 1.2;
            listener.scaleY = 1.2;

        }

        function handleMouseOut() {
            listener.scaleX = 1.0;
            listener.scaleY = 1.0;

        }

    }

}

//継承
class MyStar extends createjs.Shape {
    constructor() {
        super();

        // 円を作成します
        this.graphics.beginStroke("Purple");// 線の色を指定
        this.graphics.setStrokeStyle(5);// 線の幅を指定
        this.graphics.drawCircle(0, 0, 150); // 半径150pxの円を記述
        this.graphics.endStroke();

        // 多角形を作成します
        this.graphics.beginFill('Purple'); // 塗りの色を指定
        this.graphics.drawPolyStar(0, 0, 150, 5, 0.6, -90); // 半径150pxの星を記述
        this.graphics.endFill();
    }
}

/** コンテナーを継承したサブクラスです。 */
class MyContainer extends createjs.Container {
    constructor() {
        super();

        // 円を作成します
        var circle = new createjs.Shape();
        circle.graphics.beginStroke("DarkRed");// 線の色を指定
        circle.graphics.setStrokeStyle(5);// 線の幅を指定
        circle.graphics.drawCircle(0, 0, 150); // 50pxの星を記述
        this.addChild(circle); // 表示リストに追加

        // 多角形を作成します
        var poly = new createjs.Shape();
        poly.graphics.beginFill('DarkRed'); // 赤色で描画するように設定
        poly.graphics.drawPolyStar(0, 0, 150, 5, 0.6, -90); // 150pxの星を記述
        this.addChild(poly); // 表示リストに追加
    }
}

