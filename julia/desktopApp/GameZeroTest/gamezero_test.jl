println("testing...")

##

# add GameZero
# add Colors
#両方のパッケージが必要だよ

# https://docs.juliahub.com/GameZero/tTDGf/0.1.3/

##

using GameZero
using Colors

#例の実行
#rungame("C:\\path\\to\\game\\Spaceship\\Spaceship.jl")

##

WIDTH = 600
HEIGHT = 600
BACKGROUND=colorant"black"
BALL_SIZE = 10
MARGIN = 50
BRICKS_X = 10
BRICKS_Y = 5
BRICK_W = (WIDTH - 2 * MARGIN) ÷ BRICKS_X
BRICK_H = 25

ball = Circle(WIDTH / 2, HEIGHT / 2, BALL_SIZE/2)
ball_vel = (0,0)
bat = Rect(WIDTH / 2, HEIGHT - 50, 120, 12)

bricks = []

struct Brick
    brick::Rect
    brick_color
    highlight_color
end

function reset()
    deleteat!(bricks, 1:length(bricks))
    for x in 1:BRICKS_X
        for y in 1:BRICKS_Y
            hue = (x + y - 2) / BRICKS_X
            saturation = ( (y-1) / BRICKS_Y) * 0.5 + 0.5
            brick_color = HSV(hue*360, saturation, 0.8)
            highlight_color = HSV(hue*360, saturation * 0.7, 1.0)
            brick = Brick( Rect(
                ((x-1) * BRICK_W + MARGIN, (y-1) * BRICK_H + MARGIN),
                (BRICK_W - 1, BRICK_H - 1)
            ), brick_color, highlight_color )
            push!(bricks, brick)
        end
    end

    ball.center = (WIDTH / 2, HEIGHT / 3)  #should be centre
    global ball_vel = (rand(-200:200), 400)
end

reset()

function draw(g::Game)
    clear()
    for b in bricks
        draw(b.brick, b.brick_color, fill=true)
        draw(Line(b.brick.bottomleft, b.brick.topleft), b.highlight_color)
        draw(Line(b.brick.topleft, b.brick.topright), b.highlight_color)
    end
    draw(bat, colorant"pink", fill=true)
    draw(ball, colorant"white", fill=true)
end

function update(g::Game)
    global dx, dy
    a.position.x += dx
    a.position.y += dy
    if a.x > 400-a.w || a.x < 2
        dx = -dx
        play_sound("eep")
    end
    if a.y > 400-a.h || a.y < 2
        dy = -dy
        play_sound("eep")
    end

    if g.keyboard.DOWN
        dy = 2
    elseif g.keyboard.UP
        dy = -2
    elseif g.keyboard.LEFT
        dx = -2
    elseif g.keyboard.RIGHT
        dx = 2
    end

end

function update(g::Game)