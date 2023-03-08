##

println("test")

##

println("test2")

##

#MY_C モジュール：全ての変数の定義、関数の定義を入れるところ

module MY_C

  #examples:

  #cannot change
  struct testObject
    NAME_this
  end

  #宣言の方法
  function testObject(_NAME_this)
    NAME_this = _NAME_this
    return testObject(NAME_this)
  end

  #can change
  mutable struct testObject_mut
    NAME_this
  end

  function testObject_mut(_NAME_this)
    NAME_this = _NAME_this
    return testObject_mut(NAME_this)
  end

  function myPrint(m)
    println(m)
  end


  #here newers:


  #agent class
  struct agentData
    NAME
    angle::Float64
    self_w::Float64
    other_w::Float64
    strategy
  end

  function agentData(_NAME,_angle,_strategy)
    NAME = _NAME
    angle = _angle
    strategy = _strategy
    return agentData(NAME,angle,cos(pi / 180 * angle),sin(pi / 180 * angle),strategy)
  end


end

##

using .MY_C

MY_C.myPrint("will")

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
angleList = [180.0, 157.5, 135.0, 90.0, 0.0]

#囚人のジレンマゲームのマトリックス
#自分にとっての、CC,CD,DC,DDの順（左が自分の選択）。相手にとっては、CC,DC,CD,DDの順である点に注意。
dillemmaMatrix = [2,0,3,1]

println(angleList[1])
println(dillemmaMatrix[1])


#SVOから、表情を出力するfunction
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

#マトリックスとSVO角度を受け取り、期待効用から選択する方を出力するfunction。
#1（協力、A）と2（非協力、B）で返す

##

#1つのセルに対する期待効用を返すfunction
function equUtilitybyaCell(selfWeight,otherWeight,selfValue,otherValue)
  return round(selfWeight * selfValue + otherWeight * otherValue,digits=2)
end

#期待効用から選択を返すfunction
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

  println(choiceText)

  return choice
end

println(equUtilityandChoise(dillemmaMatrix,0.7,0.7))

for i in 1:8
  testSelf,testOther = WeightfromSVO((i-1)*45)
  println(45*(i-1)," :",equUtilityandChoise(dillemmaMatrix,testSelf,testOther))
  println()
end

##

#マトリックスとSVO候補リストから、周辺確率を出力するfunction

#・プレイヤーがAとBを選んだ場合、それぞれで分岐する。（独立の確率表になるよ）

#・2（プレイヤー分岐）× SVO候補の数 × 3（それぞれの表情）

##

#マトリックスとSVO候補リストから周辺確率を出力するfunction
function probaDistribution(gameMatrix,SVOCandidateList)
  #SVOの候補数
  svoCandidateSize = length(SVOCandidateList)
  #println("SVOの候補数は、",svoCandidateSize)

  #プレイヤーが協力した場合の周辺確率
  CoopDistributionList = zeros(Float64,3,svoCandidateSize)
  #println(CoopDistributionList)

  #全ての候補の重みを事前に計算
  weightList = zeros(Float64,2,svoCandidateSize)

  for i in 1:svoCandidateSize
    weightList[1,i],weightList[2,i] = WeightfromSVO(SVOCandidateList[i])
  end
  #println(weightList)

  #周辺確率分布を計算
  for i in 1:svoCandidateSize
    CoopDistributionList[EmotionExpressionfromSVO(weightList[1,i],weightList[2,i],gameMatrix[1],gameMatrix[1]),i] += 1
  end

  CoopDistributionList /= svoCandidateSize
  #println(CoopDistributionList)

  #プレイヤーが非協力した場合の周辺確率
  DefectDistributionList = zeros(Float64,3,svoCandidateSize)
  #println(DefectDistributionList)

  #周辺確率分布を計算
  for i in 1:svoCandidateSize
    DefectDistributionList[EmotionExpressionfromSVO(weightList[1,i],weightList[2,i],gameMatrix[2],gameMatrix[3]),i] += 1
  end

  DefectDistributionList /= svoCandidateSize
  #println(DefectDistributionList)

  return CoopDistributionList,DefectDistributionList

end

probaDistribution(dillemmaMatrix,angleList)

##

#= # ゲームを10回分実行するfunction

・片方のエージェントは全て固定のA（1）しか選ばない。

・プレイヤーはランダムに選択していく。 

天野君バージョンの実験

=#

##

#ゲームを10回行うfunction
#ゲームマトリックスと、エージェントのSVOを設定する必要がある。

round_n_Def = 20

#行われるゲームのデフォルト
#gameMatrix_Def = [dillemmaMatrix]*round_n_Def
gameMatrix_Def = fill(dillemmaMatrix,round_n_Def)

#プレイヤーのデフォルト実行手
playerChoiceList_Def = [RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer()]

function PlayGame_AmanoEx(gameMatrix,agentsAngleSVO,flagNeutral=false,flagRand=true,playerChoiceList=playerChoiceList_Def,round_n=round_n_Def)
  #agentのSVO重みを計算
  agentsSelfWeight, agentsOtherWeight = WeightfromSVO(agentsAngleSVO)
  #println("self=", agentsSelfWeight, " : other=", agentsOtherWeight)
  #println("True svo is : ",agentsAngleSVO)

  #結果の保存先
  emotionList = zeros(Float64,round_n)

  #周辺確率のリスト(更新されない。使う方)
  coopDistributionList,defectDistributionList = probaDistribution(gameMatrix,angleList)
  DistributionList = [coopDistributionList,defectDistributionList]
  #println(DistributionList)

  #ベイズ更新の確率リスト
  bayseaProbabilityList = fill(1.0,length(angleList))
  bayseaProbabilityList /= sum(bayseaProbabilityList)
  #println(bayseaProbabilityList)

  #ベイズ更新の履歴リスト
  legacyBayseaList = zeros(Float64,round_n+1,length(angleList))
  legacyBayseaList[1,:] = bayseaProbabilityList
  #println(legacyBayseaList)

  #ランダムに生成する場合は実行する
  if flagRand
    playerChoiceList = [RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer(),RandomofPlayer()]
  end

  #指定のラウンド数まで実行する
  for i in 1:round_n
    #println()
    #ラウンド数
    #println("round ",i)

    #プレイヤーのランダム手
    #playerChoice = RandomofPlayer()
    playerChoice = playerChoiceList[i]

    playerState = "Coop"
    if playerChoice == 2
      playerState = "Defect"
    end
    #println("players choise:",playerState," : ",playerChoice)

    #エージェントの手（常に1（協力、C、A））
    agentChoice = 1

    #それぞれの得点。自分の選択はリスト上では2つ移動する。相手の選択は1つ移動させる。
    agentScore = gameMatrix[(agentChoice-1)*2 + playerChoice]
    playerScore = gameMatrix[(playerChoice-1)*2 + agentChoice]

    #println("player :",playerScore," = agent :",agentScore)

    agentEmotion = EmotionExpressionfromSVO(agentsSelfWeight,agentsOtherWeight,agentScore,playerScore)
    if flagNeutral
      agentEmotion = 2
    end

    #println("agent emotion is ",agentEmotion)

    emotionList[i] = agentEmotion

    #周辺確率の参照
    probaList = DistributionList[playerChoice][agentEmotion,:]
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
testLegacy = PlayGame_AmanoEx(dillemmaMatrix,180.0,true)

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
plot!(testLegacy[:,5],label=angleList[5],ylims=(-0.2,1.2))
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

function simulateGraph(whoNo=1,test_n=test_n,flagNeutral=false)
  #平均を求めるためのリスト
  simuList = zeros(Float64,test_n,round_n_Def+1,length(angleList))

  for i in 1:test_n
    #println(PlayGame(dillemmaMatrix,angleList[whoNo]))
    #println()
    if !flagNeutral
      simuList[i,:,:] = PlayGame_AmanoEx(dillemmaMatrix,angleList[whoNo],flagNeutral)
    else
      simuList[i,:,:] = PlayGame_AmanoEx(dillemmaMatrix,angleList[1],flagNeutral)
    end
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
      aveSimuList[1,i,j] = mean(simuList[:,i,j])
      aveSimuList[2,i,j] = std(simuList[:,i,j])
      #println("std=",aveSimuList[2,i,j])
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

  indexList = [0:20]

  #グラフにプロット
  gr()
  mya = plot(indexList,aveSimuList[1,:,1],ribbon=aveSimuList[2,:,1]/2,fillalpha = fillAlpha,label=angleList[1])
  plot!(indexList,aveSimuList[1,:,2],ribbon=aveSimuList[2,:,2]/2,fillalpha = fillAlpha,label=angleList[2])
  plot!(indexList,aveSimuList[1,:,3],ribbon=aveSimuList[2,:,3]/2,fillalpha = fillAlpha,label=angleList[3])
  plot!(indexList,aveSimuList[1,:,4],ribbon=aveSimuList[2,:,4]/2,fillalpha = fillAlpha,label=angleList[4])
  plot!(indexList,aveSimuList[1,:,5],ribbon=aveSimuList[2,:,5]/2,fillalpha = fillAlpha,label=angleList[5],xlims=(0,20),ylims=(-0.2,1.2))

  #true_SVO = "True SVO:"*string(angleList[whoNo])
  #plot!(title=true_SVO)
  plot!(title="True SVO:"*string(angleList[whoNo]))
  plot!(titlefontsize=fontSize_graphs)
  plot!(xtickfontsize=fontSize_graphs)
  plot!(ytickfontsize=fontSize_graphs)
  plot!(legendfontsize=fontSize_graphs-2)
  plot!(legend=:right)
  plot!(ylabel="Probability of inferred SVO",xlabel="Round")
  plot!(xguidefont=fontSize_graphs,yguidefont=fontSize_graphs)

  if flagNeutral
    plot!(title="True SVO: N.A.")
  end

  return mya

end

one_te = simulateGraph(1,10000)
simulateGraph(2,10000)
simulateGraph(3,10000)
simulateGraph(4,10000)
simulateGraph(5,10000)
simulateGraph(1,10000,true)

println("simu over...")

#display(one_te)
#savefig(one_te,"plot180a10000s20r_v1.1.pdf")

#画像を保存したいとき

#= 
savefig(simulateGraph(1,10000),"images/plot180a10000s20r_v1.1.pdf")
savefig(simulateGraph(2,10000),"images/plot157.5a10000s20r_v1.1.pdf")
savefig(simulateGraph(3,10000),"images/plot135a10000s20r_v1.1.pdf")
savefig(simulateGraph(4,10000),"images/plot90a10000s20r_v1.1.pdf")
savefig(simulateGraph(5,10000),"images/plot0a10000s20r_v1.1.pdf")
savefig(simulateGraph(1,10000,true),"images/plotNeutrala10000s20r_v1.1.pdf")
 =#
##
