##ウィンドウズアプリにコンパイルする

using PackageCompiler

##

AppName = Base.prompt("Who file do you want to make exe? Enter file name(only one file name).")

create_app(AppName, AppName*".exe", sysimage=:default)

