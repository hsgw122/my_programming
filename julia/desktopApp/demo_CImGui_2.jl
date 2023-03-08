##パッケージイン

using CImGui

##デモのイン

#"demo"の部分は以下に変更して、いろいろ見れます
# :examples

#include(joinpath(pathof(CImGui), "..", "..", "examples", "demo.jl"))

using CImGui
using CImGui.CSyntax
using CImGui.CSyntax.CStatic
using CImGui.GLFWBackend
using CImGui.OpenGLBackend
using CImGui.GLFWBackend.GLFW
using CImGui.OpenGLBackend.ModernGL
using Printf

function button_callback(ptr)
    global button_pressed = true
end

function main_loop()
    global button_pressed = false
    
    ccall(:igBegin, Cvoid, (Ptr{Cchar}, Ptr{Cbool}, Cint), "My Application", C_NULL, 0)
    
    if ccall(:igButton, Cbool, (Ptr{Cchar}, ImVec2), "Press me!", ImVec2(100, 50))
        button_callback(0)
    end
    
    if button_pressed
        ccall(:igText, Cvoid, (Ptr{Cchar}, Vararg{Any}...), "A")
    end
    
    ccall(:igEnd, Cvoid, ())
end

while true
    main_loop()
end
