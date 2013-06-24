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

var protagonist, time, history, ghost;

(function() {
    "use strict";

    history = [];

    function spawnGhost() {
        Crafty.e('2D, DOM, Color, Multiway')
            .color('rgba(0,0,255,.4)')
            .attr({
                offset: time._x,
                x:      history[0].x,
                y:      history[0].y,
                w:      history[0].w,
                h:      history[0].h
            })
            .bind('EnterFrame', function () {
                var currentTime = time._x - this.offset,
                    state       = history[currentTime];

                this.x = state.x;
                this.y = state.y;
                this.w = state.w;
                this.h = state.h;
            });
    }

    window.addEventListener('load', function load(event) {
        window.removeEventListener('load', load, false);

        Crafty.init();
        Crafty.background('rgb(127, 127, 127)');

        time = Crafty.e('2D, Multiway')
            .attr({ x: 0, y: 0, dX: 1, dY: 0 })
            .bind('EnterFrame', function () {
                history[this.x] = {
                    x: protagonist._x,
                    y: protagonist._y,
                    w: protagonist._w,
                    h: protagonist._h
                };
                this.x += this.dX;
            })
            .bind('KeyDown', function(e) {
                if (e.key == Crafty.keys.G) spawnGhost();
            })

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
            });
    }, false);
})();
