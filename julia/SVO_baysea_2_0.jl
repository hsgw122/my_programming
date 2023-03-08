##

print("testing now")
print(".")
print(".")
println(".")

println("okay:")

##

# 相手の行動は固定、よってリストで与えることに。エージェントの出力形式に合わせればよいか？

#やりたいことは、
#・Juliaで
#・相手のエージェントの行動はC（A、協力）固定の時に
#・囚人のジレンマゲームで、参加者がAとBをランダムに出力するとして、
#・10回、ゲームを行った場合に、
#・参加者の出力するランダム配列を全通り試し、相手のSVOの予測平均を出す。

##

# 用意すべきもの
#= 
上記をするためには、
・マトリックスの用意（エージェント固定なので、Aの2点、Bの3点が必要かな。あとは、エージェントの獲得点数。）
・マトリックスからエージェントが出力する表情の計算
・記録するための10列のリスト、および全パターン実行の保存先
・模擬プレイヤーとして、AとBを出力する人。
・ベイズ更新の関数、保存式
=#

##

#= 
以下は、最低限の条件

・エージェントの計算において、判定は下2桁でroundしたものを使う。

・エージェントの出力する表情は、sad、neutral、joyの3種類である（数値化する方が良い）

・実行された角度は、（今のところ）180.0、157.5、135.0、112.5～22.5、0.0、の5つであり、加えてneutral-neutralである。
 =#

 ##

#= 
 # ページワン

・実行する角度リスト

・ジレンマゲームのマトリックス

・表情出力関数 
=#

##

#cos(pi / 180 * angle)

#実行する角度のリスト
angleList = [45.0, 5.0, -5.0, -45.0]


#囚人のジレンマゲームのマトリックス
#自分にとっての、CC,CD,DC,DDの順（左が自分の選択）。相手にとっては、CC,DC,CD,DDの順である点に注意。
dillemmaMatrix = [2,0,3,1]


#鹿狩りゲームのマトリックス。合計で5種類×2＝10種類、存在している。
#普通に違う5種と、その上下左右を入れ替えた5種があるのさ。

staghunt_1 = [2,0,1,1]
staghunt_1_inv = [1,1,0,2]

staghunt_2 = [3,0,1,1]
staghunt_2_inv = [1,1,0,3]

staghunt_3 = [3,0,2,1]
staghunt_3_inv = [1,2,0,3]

staghunt_4 = [3,0,2,2]
staghunt_4_inv = [2,2,0,3]

staghunt_5 = [3,1,2,2]
staghunt_5_inv = [2,2,1,3]

gameList = zeros(Float64,15,4)
gameList_box = [staghunt_1,staghunt_1_inv,staghunt_2,staghunt_2_inv,staghunt_3,staghunt_3_inv,staghunt_4,staghunt_4_inv,staghunt_5,staghunt_5_inv,dillemmaMatrix,dillemmaMatrix,dillemmaMatrix,dillemmaMatrix,dillemmaMatrix]

println(gameList_box[1][1])

for i in 1:length(gameList_box)
  #println(i)
  for j in 1:4
    #println(gameList_box[i,j])
    gameList[i,j] = gameList_box[i][j]
  end
end

println(gameList)

println(angleList[1])
println(dillemmaMatrix[1])
println(gameList)


#SVOの重みとpayoff（利得、マトリックスの値）から、表情を出力するfunction
#表情は今回使わなかったよ（特に効果とかなかったし……）
function EmotionExpressionfromSVO(selfWeight,otherWeight,selfValue,otherValue)

    #重みから効用を計算。下2桁に。digitsで下何桁
    utility = round(selfWeight * selfValue + otherWeight * otherValue,digits=2)
    #println("utility=",utility)

    #判定のための変数
    # 1 : bad
    # 2 : neutral
    # 3 : joy　としたよ。
    emotion = 2

    if utility > 0.0
        emotion = 3
    elseif utility < 0.0
        emotion = 1
    end
    #println("emotion=",emotion)

    return emotion
end

EmotionExpressionfromSVO(1,0,2,2)

EmotionExpressionfromSVO(0,0,2,2)

##

#Juliaのインテリセンスが効かないときは、不便かもだが、環境が遅い可能性あり。拡張機能を確認し、いろいろと再起動すべし。

#角度を受け取り、SVOの重みに変換するfunction

##

#角度を受け取り、重み2つを出力するfunction
function WeightfromSVO(angleSVO)
  return cos(pi / 180 * angleSVO),sin(pi / 180 * angleSVO)
end

print(WeightfromSVO(180))

##

#ランダムにA(1)かB(2)かを出力する、プレイヤーfunction

##

#1か2をランダムに出力するプレイヤーfunction
function RandomofPlayer()
  rate = rand(1:2)
  #print(rate)
  return rate
end

RandomofPlayer()

##

#マトリックスとSVOの重みを受け取り、期待効用から選択する方を出力するfunction。
#1（協力、A）と2（非協力、B）で返す

##

#1つのセルに対する期待効用を返すfunction
function equUtilitybyaCell(selfWeight,otherWeight,selfValue,otherValue)
  return round(selfWeight * selfValue + otherWeight * otherValue,digits=2)
end

#期待効用と重みから、選択を返すfunction
function equUtilityandChoise(gameMatrix,selfWeight,otherWeight)
  #デフォルトは協力
  choice = 1
  choiceText = "Coop"

  #協力した場合の期待効用
  utilityCoop = equUtilitybyaCell(selfWeight,otherWeight,gameMatrix[1],gameMatrix[1])*0.5+equUtilitybyaCell(selfWeight,otherWeight,gameMatrix[2],gameMatrix[3])*0.5
  #非協力した場合の期待効用
  utilityDefect = equUtilitybyaCell(selfWeight,otherWeight,gameMatrix[3],gameMatrix[2])*0.5+equUtilitybyaCell(selfWeight,otherWeight,gameMatrix[4],gameMatrix[4])*0.5

  #協力よりも非協力が良いなら変更する
  if utilityCoop < utilityDefect
    choice = 2
    choiceText = "Defect"
  end

  #println(choiceText)

  return choice
end

println(equUtilityandChoise(dillemmaMatrix,0.7,0.7))

for i in 1:8
  testSelf,testOther = WeightfromSVO((i-1)*45)
  println(45*(i-1)," :",equUtilityandChoise(staghunt_1_inv,testSelf,testOther))
  println()
end

##

#マトリックスとSVO候補リストから、周辺確率を出力するfunction

#・プレイヤーがAとBを選んだ場合、それぞれで分岐する。（独立の確率表になるよ）

#・2（プレイヤー分岐）× SVO候補の数 × 3（それぞれの表情）

#ココがそのままだとダメな奴。
#なんでかというと、「エージェントの選択」に応じて分岐しているから。

#・11（ゲーム分岐）× SVO候補の数 × 2（それぞれのエージェントの選択）

#これに変更しないといけない

##

#マトリックスとSVO候補リストから周辺確率を出力するfunction
function probaDistribution(gameMatrix,SVOCandidateList)

  #ゲームの数
  #gameTypeS = length(gameMatrixList[:,1])
  #println("gametyeps",gameTypeS)

  #SVOの候補数
  svoCandidateSize = length(SVOCandidateList)
  #println("SVOの候補数は、",svoCandidateSize)

  #全ての計算結果を載せるためのリスト
  #DistributionList = zeros(Float64,gameTypeS,2,svoCandidateSize)
  DistributionList = zeros(Float64,2,svoCandidateSize)
  #println(DistributionList)

  #全ての候補の重みを事前に計算
  weightList = zeros(Float64,2,svoCandidateSize)

  for i in 1:svoCandidateSize
    weightList[1,i],weightList[2,i] = WeightfromSVO(SVOCandidateList[i])
  end
  #println(weightList)

  #for i in 1:gameTypeS
    #ゲームを参照して保持する
    #gameMatrix = gameMatrixList[i,:]
    #println(gameMatrix)

    #周辺確率分布を計算
    #for j in 1:svoCandidateSize
      #DistributionList[i,equUtilityandChoise(gameMatrix,weightList[1,j],weightList[2,j]),j] += 1
    #end

    #平均化する。確率の合計を1にするのだ（そのままだと1を超えて、SVOの数になっている。今回は4かな？）
    #DistributionList[i,:,:] /= svoCandidateSize
    #println(DistributionList[i])

  #end

  #周辺確率分布を計算
  for i in 1:svoCandidateSize
    DistributionList[equUtilityandChoise(gameMatrix,weightList[1,i],weightList[2,i]),i] += 1
  end

  #平均化する。確率の合計を1にするのだ（そのままだと1を超えて、SVOの数になっている。今回は4かな？）
  DistributionList /= svoCandidateSize
  #println(DistributionList)

  return DistributionList

end

test_list = [0 1 2 3 ; 0 1 2 3]

probaDistribution(test_list[1,:],angleList)
probaDistribution(gameList[1,:],angleList)

##

#= # ゲームを10回分実行するfunction

・片方のエージェントは全て固定のA（1）しか選ばない。

・プレイヤーはランダムに選択していく。 

天野君バージョンの実験

=#

##

#ゲームを10回行うfunction
#ゲームマトリックスと、エージェントのSVOを設定する必要がある。

#また、1個のゲームをラウンド数実行になっているため、10種をランダムに実行、という形にしたいね。めもめも

round_n_Def = 15

#ランダムに並べ替えたいときに使うやつ
using Random

#1～10をランダムに返す。これで、ゲームをランダムに表示できるでしょう
println(randperm(10))

#行われるゲームのデフォルト
#gameMatrix_Def = [dillemmaMatrix]*round_n_Def
#gameMatrix_Def = fill(dillemmaMatrix,round_n_Def)
gameMatrix_Def = gameList

#プレイヤーのデフォルト実行手
playerChoiceList_Def = [RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer()]

# ゲームを指定回数行うfuncition
#・行うゲームリスト
#・相手の真のSVO
#・ゲームがランダムに順番替えされるかのフラグ
#・エージェントの表情が平常時固定かのフラグ
#・エージェント側の選択がランダムなのかのフラグ
#・エージェントの選択リスト
#・ゲーム回数
# が引数です。

function PlayGame(gameMatrixList,agentsAngleSVO,flagRand_gametype=true,flagEmotion_Neutral=false,flag_agentChoice=true,agentChoiceList=playerChoiceList_Def,round_n=round_n_Def)
#function PlayGame(gameMatrixList,agentsAngleSVO,flagRand_gametype=true,flagEmotion_Neutral=false,flagRand_playerChoice=true,playerChoiceList=playerChoiceList_Def,round_n=round_n_Def)
  #agentのSVO重みを計算
  agentsSelfWeight, agentsOtherWeight = WeightfromSVO(agentsAngleSVO)
  #println("self=", agentsSelfWeight, " : other=", agentsOtherWeight)
  #println("True svo is : ",agentsAngleSVO)

  #結果の保存先
  emotionList = zeros(Float64,round_n)

  #ゲームのサイズ。何回ゲームを行うかを調べるよ
  gameSize = length(gameMatrixList[:,1])
  #println("game size =",gameSize)

  #周辺確率のリストの保存先
  DistributionList = zeros(Float64,gameSize,2,length(angleList))
  #println(DistributionList)

  #全てのゲームで周辺確率を保持するよ
  for i in 1:gameSize
    #println("game = ",gameMatrixList[i,:])
    #周辺確率のリスト(更新されない。使う方)
    DistributionList[i,:,:] = probaDistribution(gameMatrixList[i,:],angleList)
    #println(i,DistributionList[i,:,:])
  end

  #周辺確率のリスト(更新されない。使う方)
  #DistributionList = probaDistribution(gameMatrix,angleList)
  #DistributionList = [coopDistributionList,defectDistributionList]
  #println(DistributionList)

  #ベイズ更新の確率リスト。一時的に保存されるboxですね。（functionの中でのみ使う）
  bayseaProbabilityList = fill(1.0,length(angleList))
  bayseaProbabilityList /= sum(bayseaProbabilityList)
  #println(bayseaProbabilityList)

  #ベイズ更新の履歴リスト
  legacyBayseaList = zeros(Float64,round_n+1,length(angleList))
  legacyBayseaList[1,:] = bayseaProbabilityList
  #println(legacyBayseaList)

  #デフォルトのゲーム順番
  gameNumbers = [1;2;3;4;5;6;7;8;9;10;11;11;11;11;11]
  #println(gameNunmbers)

  #ゲームを並べ替えるならば、10回目までは並べ替える
  if flagRand_gametype
    randNumbers = randperm(10)
    for i in 1:10
      gameNumbers[i] = randNumbers[i]
    end
    #println(gameNumbers)
  end

  #ランダムにプレイヤーの選択を生成する場合は実行する
  #if flagRand_playerChoice
    #playerChoiceList = [RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer()]
  #end

  #1手前の保存、デフォルトは協力（1）
  player_Chose_before_1 = 1
  agent_Chose_before_1 = 1

  #入れ替えフラグ
  flag_InvetMatrix = false

  #もし、入れ替えるならば、囚人のジレンマは入れ替える
  if rand(1:2) == 1
    flag_InvetMatrix = true
  end

  #指定のラウンド数まで実行する
  for i in 1:round_n
    #println()
    #ラウンド数
    #println("round ",i)

    #今回のゲームのマトリックス
    gameMatrix_box = gameMatrixList[gameNumbers[i],:]

    if flag_InvetMatrix
      if i > 10
        a = gameMatrix_box[1]
        b = gameMatrix_box[2]
        c = gameMatrix_box[3]
        d = gameMatrix_box[4]
        gameMatrix_box[1] = d
        gameMatrix_box[2] = c
        gameMatrix_box[3] = b
        gameMatrix_box[4] = a
        #println(gameMatrix_box)
      end
    end

    #プレイヤーのランダム手
    #playerChoice = RandomofPlayer()
    #playerChoice = playerChoiceList[i]
    playerChoice = RandomofPlayer()
    player_Chose_before_1 = playerChoice

    playerState = "Coop"
    if playerChoice == 2
      playerState = "Defect"
    end
    #println("players choise:",playerState," : ",playerChoice)

    #エージェントの手（計算し、選択結果を返す）
    agentChoice = equUtilityandChoise(gameMatrix_box,agentsSelfWeight,agentsOtherWeight)

    #エージェントは11回目は必ず裏切る
    if i == 11
      agentChoice = 2

    #12回目以降は事前の相手の手をマネする
    elseif i > 11
      agentChoice = player_Chose_before_1
    end
    agent_Chose_before_1 = agentChoice

    #println(agentChoice)

    #それぞれの得点。自分の選択はリスト上では2つ移動する。相手の選択は1つ移動させる。
    agentScore = gameMatrix_box[(agentChoice-1)*2 + playerChoice]
    playerScore = gameMatrix_box[(playerChoice-1)*2 + agentChoice]

    #println("player :",playerScore," = agent :",agentScore)

    agentEmotion = EmotionExpressionfromSVO(agentsSelfWeight,agentsOtherWeight,agentScore,playerScore)
    if flagEmotion_Neutral
      agentEmotion = 2
    end

    #println("agent emotion is ",agentEmotion)

    emotionList[i] = agentEmotion

    #周辺確率の参照
    #probaList = DistributionList[playerChoice][agentEmotion,:]
    probaList = DistributionList[gameNumbers[i],agentChoice,:]
    #println("probaList = ",probaList)
    #println("bayseaProbabilityList = ",bayseaProbabilityList)
    #println("probaList*baysea = ",probaList.*bayseaProbabilityList)

    for i in 1:length(angleList)
      over_proba = probaList[i]
      over_bayseaProba = bayseaProbabilityList[i]
      under_sum = sum(probaList.*bayseaProbabilityList)

      #println(over_proba," ",over_bayseaProba," ",under_sum)
      

      #不定値の分母を避けたい
      if under_sum == "NaN" || under_sum == 0
        under_sum = 0.000001
      end
      
      #bayseaProbabilityList[i] = (probaList[i]*bayseaProbabilityList[i]) / sum(probaList.*bayseaProbabilityList)
      bayseaProbabilityList[i] = (over_proba * over_bayseaProba) / under_sum
      #println(" bay :",bayseaProbabilityList[i])
    end

    #println("updated list = ",bayseaProbabilityList)

    legacyBayseaList[i+1,:] = bayseaProbabilityList

  end

  #println()
  #表情リストの表示。返さない。（返すのはSVOのベイズ確率のリストの履歴。）
  #println(emotionList)

  #ベイズ更新の履歴リストの表示。
  #println(legacyBayseaList)

  return legacyBayseaList

end

println()
testLegacy = PlayGame(gameList,45.0)

##

#グラフによるプロット

##

using Plots

##


gr()
plot!(xtickfontsize=20)
plot(testLegacy[:,1],label=angleList[1])
plot!(testLegacy[:,2],label=angleList[2])
plot!(testLegacy[:,3],label=angleList[3])
plot!(testLegacy[:,4],label=angleList[4])
#plot!(testLegacy[:,5],label=angleList[5],ylims=(-0.2,1.2))
plot!(xtickfontsize=12)

#plot!(result_pop_simu_a[:,8],label=angle_list_a[8],ylims=(-10,4000))

##

#複数回の実行によるシミュレーション

##

using Statistics

test_n = 2*2*2*2*2*2*2*2*2*2
println(test_n)

#フォントのサイズ
fontSize_graphs = 15

#test_n = 100
println(test_n)

println("simulation by :",test_n)

function simulateGraph(whoNo=1,test_n=test_n,flagRand_gametypes=true)
  #平均を求めるためのリスト
  simuList = zeros(Float64,test_n,round_n_Def+1,length(angleList))

  for i in 1:test_n
    #println(PlayGame(dillemmaMatrix,angleList[whoNo]))
    #println()

    simuList[i,:,:] = PlayGame(gameList,angleList[whoNo],flagRand_gametypes)

    #1回目は表示してみる、デバッグ
    #if i == 1
    #  println(simuList[i,:,:])
    #end
  end

  #平均と標準偏差を載せるリスト
  aveSimuList = zeros(Float64,2,round_n_Def+1,length(angleList))

  for i in 1:round_n_Def+1
    for j in 1:length(angleList)
      #println("round :",i," angle :",angleList[j])
      #println(simuList[:,i,j])
      #println(mean(simuList[:,i,j]))

      #平均値
      aveSimuList[1,i,j] = mean(simuList[:,i,j])
      #標準偏差
      aveSimuList[2,i,j] = std(simuList[:,i,j])
      #println("std=",aveSimuList[2,i,j])

      #標準誤差
      #aveSimuList[2,i,j] = aveSimuList[2,i,j] / sqrt(length(simuList[:,i,j])-1)

      #aveSimuList[2,i,j] = aveSimuList[2,i,j] / 100
      #println("ste?=",aveSimuList[2,i,j])
      #println()
    end
    #println(i)
    #println()
  end

  #println(aveSimuList)
  #println()

  #simuList /= test_n
  #println(simuList)

  fillAlpha = 0.1

  indexList = [0:round_n_Def]

  #グラフにプロット
  gr()
  mya = plot(indexList,aveSimuList[1,:,1],ribbon=aveSimuList[2,:,1]/2,fillalpha = fillAlpha,label=angleList[1])
  plot!(indexList,aveSimuList[1,:,2],ribbon=aveSimuList[2,:,2]/2,fillalpha = fillAlpha,label=angleList[2])
  plot!(indexList,aveSimuList[1,:,3],ribbon=aveSimuList[2,:,3]/2,fillalpha = fillAlpha,label=angleList[3])
  plot!(indexList,aveSimuList[1,:,4],ribbon=aveSimuList[2,:,4]/2,fillalpha = fillAlpha,label=angleList[4])
  #plot!(indexList,aveSimuList[1,:,5],ribbon=aveSimuList[2,:,5]/2,fillalpha = fillAlpha,label=angleList[5],xlims=(0,20),ylims=(-0.2,1.2))

  #true_SVO = "True SVO:"*string(angleList[whoNo])
  #plot!(title=true_SVO)
  plot!(title="True SVO:"*string(angleList[whoNo]))
  plot!(titlefontsize=fontSize_graphs)
  plot!(xtickfontsize=fontSize_graphs)
  plot!(ytickfontsize=fontSize_graphs)
  plot!(legendfontsize=fontSize_graphs-2)
  plot!(legend=:right)

  #x軸とy軸のラベルの設定
  plot!(ylabel="Probability of inferred SVO",xlabel="Round")
  plot!(xguidefont=fontSize_graphs,yguidefont=fontSize_graphs)

  #if flagRand_gametypes
  #  plot!(title="True SVO: Neutral-Neutral")
  #end

  return mya

end

#println("mya")
one_te = simulateGraph(1,10000)
simulateGraph(2,10000)
simulateGraph(3,10000)
simulateGraph(4,10000)
#simulateGraph(5,10000)
#simulateGraph(1,10000,true)

println("simu over...")

version_fig = "v1.0"

#画像を保存したいとき

#= 
savefig(simulateGraph(1,10000),"images/plot45a10000s15r_"*version_fig*".pdf")
savefig(simulateGraph(2,10000),"images/plot5a10000s15r_"*version_fig*".pdf")
savefig(simulateGraph(3,10000),"images/plot-5a10000s15r_"*version_fig*".pdf")
savefig(simulateGraph(4,10000),"images/plot-45a10000s15r_"*version_fig*".pdf")
 =#

##

#頻度の場合のモデル

##

function simulateGraph(whoNo=1,test_n=test_n,flagRand_gametypes=true)
  #平均を求めるためのリスト
  simuList = zeros(Float64,test_n,round_n_Def+1,length(angleList))

  for i in 1:test_n
    #println(PlayGame(dillemmaMatrix,angleList[whoNo]))
    #println()

    simuList[i,:,:] = PlayGame(gameList,angleList[whoNo],flagRand_gametypes)

    #1回目は表示してみる、デバッグ
    #if i == 1
    #  println(simuList[i,:,:])
    #end
  end

  #平均と標準偏差を載せるリスト
  aveSimuList = zeros(Float64,2,round_n_Def+1,length(angleList))

  for i in 1:round_n_Def+1
    for j in 1:length(angleList)
      #println("round :",i," angle :",angleList[j])
      #println(simuList[:,i,j])
      #println(mean(simuList[:,i,j]))

      #平均値
      aveSimuList[1,i,j] = mean(simuList[:,i,j])
      #標準偏差
      aveSimuList[2,i,j] = std(simuList[:,i,j])
      #println("std=",aveSimuList[2,i,j])

      #標準誤差
      #aveSimuList[2,i,j] = aveSimuList[2,i,j] / sqrt(length(simuList[:,i,j])-1)

      #aveSimuList[2,i,j] = aveSimuList[2,i,j] / 100
      #println("ste?=",aveSimuList[2,i,j])
      #println()
    end
    #println(i)
    #println()
  end

  #println(aveSimuList)
  #println()

  #simuList /= test_n
  #println(simuList)

  fillAlpha = 0.1

  indexList = [0:round_n_Def]

  #グラフにプロット
  gr()
  mya = plot(indexList,aveSimuList[1,:,1],ribbon=aveSimuList[2,:,1]/2,fillalpha = fillAlpha,label=angleList[1])
  plot!(indexList,aveSimuList[1,:,2],ribbon=aveSimuList[2,:,2]/2,fillalpha = fillAlpha,label=angleList[2])
  plot!(indexList,aveSimuList[1,:,3],ribbon=aveSimuList[2,:,3]/2,fillalpha = fillAlpha,label=angleList[3])
  plot!(indexList,aveSimuList[1,:,4],ribbon=aveSimuList[2,:,4]/2,fillalpha = fillAlpha,label=angleList[4])
  #plot!(indexList,aveSimuList[1,:,5],ribbon=aveSimuList[2,:,5]/2,fillalpha = fillAlpha,label=angleList[5],xlims=(0,20),ylims=(-0.2,1.2))

  #true_SVO = "True SVO:"*string(angleList[whoNo])
  #plot!(title=true_SVO)
  plot!(title="True SVO:"*string(angleList[whoNo]))
  plot!(titlefontsize=fontSize_graphs)
  plot!(xtickfontsize=fontSize_graphs)
  plot!(ytickfontsize=fontSize_graphs)
  plot!(legendfontsize=fontSize_graphs-2)
  plot!(legend=:right)

  #x軸とy軸のラベルの設定
  plot!(ylabel="Probability of inferred SVO",xlabel="Round")
  plot!(xguidefont=fontSize_graphs,yguidefont=fontSize_graphs)

  #if flagRand_gametypes
  #  plot!(title="True SVO: Neutral-Neutral")
  #end

  return mya

end

##

#状況の場合のモデル

##