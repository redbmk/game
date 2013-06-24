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

    function defined(value) { return typeof value !== 'undefined'; }

    function spawnGhost(offset, transparency) {
        if (!defined(transparency)) transparency = .4;

        return Crafty.e('2D, DOM, Color, Multiway')
            .color('rgba(0,0,255,' + transparency + ')')
            .attr('offset', defined(offset) ? offset : time._x)
            .extend(history[0])
            .bind('EnterFrame', function () {
                var localTime = time._x - this.offset,
                    state = history[localTime];

                if (!state) { state = history[Math.floor(localTime)]; }

                if (state) {
                    this.extend(state);
                } else {
                    this.w = this.h = 0;
                }
            });
    }

    function pauseTime() {
        time.isPaused = !time.isPaused;

        if (time.isPaused) {
            time.attr('dX', 0);
            protagonist.disableControl()
                .attr('shadows', [ 1, 2, 3, 4, 5, 6, 7, 8, 9 ].map(function (num) {
                    return spawnGhost(num, 1 - (num / 10));
                }));
        } else {
            time.attr('dX', 1);
            protagonist.attr('shadows').forEach(function (shadow) { shadow.destroy(); });
            delete protagonist.attr('shadows');
            protagonist.enableControl();
        }
    }

    window.addEventListener('load', function load(event) {
        window.removeEventListener('load', load, false);

        Crafty.init();
        Crafty.background('rgb(127, 127, 127)');

        time = Crafty.e('2D, Multiway')
            .attr({ x: 0, y: 0, dX: 1, dY: 0, isPaused: false })
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
                switch (e.key) {
                    case Crafty.keys.G:
                        spawnGhost();
                        break;
                    case Crafty.keys.SPACE:
                        pauseTime();
                        break;
                    case Crafty.keys.ESC:
                        Crafty.stop();
                        break;
                }
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
            });
    }, false);
})();
