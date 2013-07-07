/*
    Copyright © 2013  Braden Michael Kelley

    This program is free software: you can redistribute it and/or modify
    it under the terms of the GNU General Public License as published by
    the Free Software Foundation, either version 3 of the License, or
    (at your option) any later version.

    This program is distributed in the hope that it will be useful,
    but WITHOUT ANY WARRANTY; without even the implied warranty of
    MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
    GNU General Public License for more details.

    You should have received a copy of the GNU General Public License
    along with this program.  If not, see <http://www.gnu.org/licenses/>.
*/

var protagonist, history, ghost;

(function() {
    "use strict";

    history = [];

    function defined(value) { return typeof value !== 'undefined'; }

    function spawnGhost(entity, offset, transparency) {
        if (!defined(transparency)) transparency = .4;
        if (!defined(entity))       entity       = protagonist;
        if (!defined(offset))       offset       = entity.time._x;

        var ghost = Crafty.e('2D, DOM, Color, Multiway')
            .color('rgba(0,0,255,' + transparency + ')')
            .attr({
                offset:         offset,
                originalOffset: offset
            })
            .extend(history[0])
            .multiway(3, {
                        K: -90,
                H: 180, J:  90, L: 0
            })
            .bind('EnterFrame', function () {
                var localTime = entity.time._x - this.offset,
                    state     = history[localTime];

                if (!state) { state = history[Math.floor(localTime)]; }

                if (state) {
                    this.extend(state);
                } else {
                    this.w = this.h = 0;
                }
            })
            .disableControl();

        return ghost;
    }

    function pauseTime(entity) {
        if (!defined(entity)) entity = protagonist;
        entity.time.isPaused = !entity.time.isPaused;

        if (entity.time.isPaused) {
            entity.time.attr('dX', 0);
            entity.disableControl()
                .attr('shadows', [ 2, 3, 4, 5, 6, 7, 8, 9 ].map(function (num) {
                    return spawnGhost(entity, num, 1 - (num / 10)).enableControl();
                }));
        } else {
            entity.time.attr('dX', 1);
            entity.attr('shadows').forEach(function (shadow) { shadow.destroy(); });
            entity.attr('shadows', null);
            entity.enableControl();
        }
    }

    function createTimeElement(entity) {
        return Crafty.e('2D, Multiway')
            .attr({ x: 0, y: 0, dX: 1, dY: 0, isPaused: false })
            .bind('EnterFrame', function () {
                //getting tricky...changing "time" can kill the ghost. what happens when in two places at once?
                //time needs to be relative. Maybe use x/y coordinates?? x could be the overall time and y could be local time?
                //or each instance could have their own timeline perhaps (e.g. the offset)
                //or "history" could keep track of time for each instance (e.g. history[0] = { ghost: {x:1,y:2,etc:etc}, protagonist: {x:10,y:100,etc:etc} };)
                //      ...i don't think this one makes sense.
                history[this.x] = {
                    x: entity._x,
                    y: entity._y,
                    w: entity._w,
                    h: entity._h
                };
                this.x += this.dX;
            });
    }

    function drawClock(time) {
        Crafty.e('2D, DOM, Shape')
            .circle(40)
            .color('white')
            .attr({ x: 11, y: 11 });

        var hand = Crafty.e('2D, DOM, Shape')
            .rect(2, 30)
            .color('black')
            .attr({ x: 51, y: 50, rotation: 180 })
            .bind('EnterFrame', function () {
                this.rotation = time.x;
            });

        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 85, y: 50, w: 3, h: 3});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 15, y: 50, w: 3, h: 3});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 50, y: 15, w: 3, h: 3});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 50, y: 85, w: 3, h: 3});

        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 81, y: 32, w: 2, h: 2});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 81, y: 68, w: 2, h: 2});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 19, y: 32, w: 2, h: 2});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 19, y: 68, w: 2, h: 2});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 32, y: 81, w: 2, h: 2});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 68, y: 81, w: 2, h: 2});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 32, y: 19, w: 2, h: 2});
        Crafty.e('2D, DOM, Color').color('rgb(0,0,0)').attr({ x: 68, y: 19, w: 2, h: 2});
    }

    window.addEventListener('load', function load(event) {
        window.removeEventListener('load', load, false);

        Crafty.init();
        Crafty.background('rgb(127, 127, 127)');

        Crafty.e('2D, DOM, Text')
            .attr({ x: 8, y: 8 })
            .bind('EnterFrame', function () {
                this.text(new Date().getSeconds());
            });

        protagonist = Crafty.e('2D, DOM, Color, Multiway')
            .color('rgb(0,0,255)')
            .attr({
                x: Math.round((Crafty.DOM.window.width  - 10) / 2),
                y: Math.round((Crafty.DOM.window.height - 10) / 2),
                w: 10, h: 10
            })
            .multiway(5, {
                        W: -90,
                A: 180, S:  90, D: 0
            })
            .bind('EnterFrame', function() {
                var lastShadow;

                if (Crafty.keydown[Crafty.keys.LEFT_ARROW]) {
                    if (this.time.isPaused) {
                        lastShadow = this.shadows[this.shadows.length - 1];
                        if (lastShadow.offset < this.time._x - lastShadow.originalOffset) {
                            this.shadows.forEach(function (shadow) { ++shadow.offset; });
                        }
                    } else {
                        this.time.dX -= .25;
                    }
                }

                if (Crafty.keydown[Crafty.keys.RIGHT_ARROW]) {
                    if (this.time.isPaused) {
                        if (this.shadows[0].offset > this.shadows[0].originalOffset) {
                            this.shadows.forEach(function (shadow) { --shadow.offset; });
                        }
                    } else {
                        this.time.dX += .25;
                    }
                }
            })
            .bind('KeyDown', function(e) {
                switch (e.key) {
                    case Crafty.keys.G:
                        spawnGhost(this);
                        break;
                    case Crafty.keys.SPACE:
                        pauseTime(this);
                        break;
                    case Crafty.keys.ESC:
                        Crafty.stop();
                        break;
                }
            });
        protagonist.attr('time', createTimeElement(protagonist));
        drawClock(protagonist.time);

    }, false);
})();
